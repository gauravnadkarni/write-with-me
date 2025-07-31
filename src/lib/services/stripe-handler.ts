import Stripe from 'stripe'
import { updateStripeCustomerId } from './user-handler'
import { toZonedTime } from 'date-fns-tz'
import { AppError } from '../errors/app-error'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

export const createCustomer = async (userId: string, email: string) => {
  const customer = await stripe.customers.create({
    email,
  })

  // Save it in DB
  await updateStripeCustomerId(userId, customer.id)
  return customer
}

export const getCheckoutSession = async (
  userId: string,
  customerId: string,
  priceId: string,
  mode?: 'subscription',
  paymentMethodTypes?: ['card'],
  quantity?: number,
  successUrl?: string,
  cancelUrl?: string,
  metadata?: Record<string, unknown>
) => {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: paymentMethodTypes ? paymentMethodTypes : ['card'],
    mode: mode ? mode : 'subscription',
    line_items: [{ price: priceId, quantity: quantity ? quantity : 1 }],
    success_url: successUrl
      ? successUrl
      : `${process.env.NEXT_PUBLIC_SITE_URL}/upgrade/processing?session_id={CHECKOUT_SESSION_ID}&success=true`,
    cancel_url: cancelUrl
      ? cancelUrl
      : `${process.env.NEXT_PUBLIC_SITE_URL}/upgrade/processing?cancelled=true`,
    metadata: metadata ? { userId, ...metadata } : { userId },
  })
  return session
}

export const updateSubscription = async (
  subscriptionId: string,
  subscriptionItemId: string,
  newPriceId: string
) => {
  const updatedSubscription = await stripe.subscriptions.update(
    subscriptionId,
    {
      items: [
        {
          id: subscriptionItemId, // Existing item ID
          price: newPriceId,
        },
      ],
      billing_cycle_anchor: 'unchanged', // Change happens at next renewal
      proration_behavior: 'none', // No immediate charges
    }
  )
  return updatedSubscription
}

export const cancelSubscription = async (subscriptionId: string) => {
  const cancelledSubscription = await stripe.subscriptions.update(
    subscriptionId,
    {
      cancel_at_period_end: true,
    }
  )
  return cancelledSubscription
}

export const getSubscription = async (subscriptionId: string) =>
  stripe.subscriptions.retrieve(subscriptionId)

export const getSubscriptionCancellationDatetime = async (
  subscriptionId: string
) => {
  const subscription = await getSubscription(subscriptionId)
  let cancellationAt = null
  if (subscription.cancel_at) {
    cancellationAt = toZonedTime(subscription.cancel_at * 1000, 'UTC')
  } else if (subscription.cancel_at_period_end) {
    cancellationAt = toZonedTime(subscription.current_period_end * 1000, 'UTC')
  }
  return cancellationAt
}

export const getCheckoutSessionBySessionId = async (
  sessionId: string,
  options?: Record<string, unknown>
) => stripe.checkout.sessions.retrieve(sessionId, options)

export const unpackEvent = (body: string, headers: Headers) => {
  const signature = headers.get('stripe-signature') as string
  try {
    return Stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    )
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new AppError(`Webhook Error: ${err.message}`, 400)
    }
    throw new AppError('Webhook Error', 400)
  }
}
