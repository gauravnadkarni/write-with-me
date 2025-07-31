import { apiWrapper } from '@/lib/api-wrapper'
import { toZonedTime } from 'date-fns-tz'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { AppError } from '@/lib/errors/app-error'
import { getPricingByExternalId } from '@/lib/services/pricing-handler'
import {
  handlePaymentFailure,
  handleSubscriptionChange,
  handleSubscriptionRenewal,
  processCheckoutSessionCompleted,
} from '@/lib/services/subscription-handler'
import { getUserByStripeCustomerId } from '@/lib/services/user-handler'
import {
  getCheckoutSessionBySessionId,
  getSubscription,
  unpackEvent,
} from '@/lib/services/stripe-handler'
import { updateUsageRecord } from '@/lib/services/usage-handler'

export async function POST(req: Request) {
  const apiAction = async () => {
    const body = await req.text()
    const event = unpackEvent(body, headers())

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const sessionWithLineItems = await getCheckoutSessionBySessionId(
          session.id,
          {
            expand: ['line_items.data.price'],
          }
        )
        if (
          !sessionWithLineItems.line_items ||
          !sessionWithLineItems.line_items.data ||
          sessionWithLineItems.line_items.data.length === 0
        ) {
          throw new AppError('Invalid checkout session', 400)
        }

        if (!sessionWithLineItems.line_items.data[0].price) {
          throw new AppError('Invalid checkout session', 400)
        }
        const subscriptionLineItemId =
          sessionWithLineItems.line_items.data[0].id
        const priceId = sessionWithLineItems.line_items?.data[0].price.id
        const subscription = await getSubscription(
          session.subscription as string
        )
        const currentPeriodStart = toZonedTime(
          subscription.current_period_start * 1000,
          'UTC'
        )
        const currentPeriodEnd = toZonedTime(
          subscription.current_period_end * 1000,
          'UTC'
        )

        const localPriceId = await getPricingByExternalId(priceId!)
        if (!localPriceId) throw new AppError('Price not found', 404)
        await processCheckoutSessionCompleted(
          session.metadata!.userId,
          session.subscription as string,
          subscriptionLineItemId,
          localPriceId.id,
          currentPeriodStart,
          currentPeriodEnd
        )
        await updateUsageRecord(session.metadata!.userId)
        break
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        if (
          !subscription.items ||
          !subscription.items.data ||
          subscription.items.data.length === 0
        ) {
          throw new AppError('Invalid subscription', 400)
        }
        const subscriptionLineItemId = subscription.items.data[0].id
        const priceId = subscription.items.data[0].price.id
        const stripeUserId = subscription.customer as string
        const currentPeriodStart = toZonedTime(
          subscription.current_period_start * 1000,
          'UTC'
        )
        const currentPeriodEnd = toZonedTime(
          subscription.current_period_end * 1000,
          'UTC'
        )
        const localPriceId = await getPricingByExternalId(priceId!)
        if (!localPriceId) throw new AppError('Price not found', 404)
        const user = await getUserByStripeCustomerId(stripeUserId!)
        if (!user) throw new AppError('User not found', 400)

        const previousAttributes = event.data.previous_attributes
        const cancellationStatus = subscription.cancellation_details?.reason

        await handleSubscriptionChange(
          user.id,
          subscription.id,
          subscriptionLineItemId,
          localPriceId.id,
          currentPeriodStart,
          currentPeriodEnd,
          previousAttributes?.status,
          cancellationStatus !== null ? cancellationStatus : undefined
        )
        break
      }
      case 'customer.subscription.deleted': {
        /*const subscription = event.data.object;
        let stripeUserId = subscription.metadata?.userId;
        if(!stripeUserId) {
          stripeUserId = subscription.customer as string;
        }
        const user = await getUserByStripeCustomerId(stripeUserId!);
        if(!user) throw new AppError("User not found", 400);

        await handleSubscriptionCanceled(
          user.id,
          subscription.id
        );*/
        break
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        if (
          !invoice.lines ||
          !invoice.lines.data ||
          invoice.lines.data.length === 0
        ) {
          throw new AppError('Invalid payload', 400)
        }
        const nextAttempt = invoice.next_payment_attempt
        const attemptCount = invoice.attempt_count
        const subscriptionLineItemId = invoice.lines.data[0].id
        await handlePaymentFailure(
          invoice.customer as string,
          invoice.subscription as string,
          subscriptionLineItemId as string,
          attemptCount,
          nextAttempt
        )
        break
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.billing_reason === 'subscription_create') {
          break
        }
        if (
          !invoice.lines ||
          !invoice.lines.data ||
          invoice.lines.data.length === 0
        ) {
          throw new AppError('Invalid subscription', 400)
        }
        const subscriptionLineItemId = invoice.lines.data[0]
          .subscription_item as string
        const userId = invoice.customer as string
        const subscriptionId = invoice.subscription as string
        const price = invoice.lines.data[0].price
        if (!price) throw new AppError('Price not found', 400)
        const localPriceId = await getPricingByExternalId(price.id)
        if (!localPriceId) throw new AppError('Price not found', 404)
        //const amountPaid = invoice.amount_paid / 100;
        //const currency = invoice.currency;
        const currentPeriodStart = toZonedTime(
          invoice.period_start * 1000,
          'UTC'
        )
        const currentPeriodEnd = toZonedTime(invoice.period_end * 1000, 'UTC')
        if (!userId) {
          throw new AppError('Missing user ID in invoice metadata.', 404)
        }
        await handleSubscriptionRenewal(
          userId,
          subscriptionId,
          subscriptionLineItemId,
          localPriceId.id,
          currentPeriodStart,
          currentPeriodEnd
        )
        break
      }
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return { payload: { received: true }, code: 200 }
  }
  return apiWrapper(apiAction)
}
