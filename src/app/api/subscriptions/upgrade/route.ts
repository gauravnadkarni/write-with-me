// app/api/generate/route.ts

import { apiWrapper } from '@/lib/api-wrapper'
import { AppError } from '@/lib/errors/app-error'
import { AuthError } from '@/lib/errors/auth-error'
import { getPricingById } from '@/lib/services/pricing-handler'
import {
  createCustomer,
  getCheckoutSession,
  updateSubscription,
} from '@/lib/services/stripe-handler'
import { getActiveSubscription } from '@/lib/services/subscription-handler'
import { getUserById } from '@/lib/services/user-handler'
import { createClient } from '@/lib/supabaseServer'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const apiAction = async () => {
    const supabase = await createClient()
    const {
      data: { user: userData },
      error,
    } = await supabase.auth.getUser()

    if (error || !userData) {
      throw new AuthError('Unauthorized', 401, error)
    }
    const { priceId } = await req.json()

    const price = await getPricingById(priceId)
    if (!price || !price.stripePriceId) {
      throw new AppError('Price not found', 404)
    }

    // Ensure user exists
    const user = await getUserById(userData.id)
    if (!user) throw new AppError('User not found', 404)

    //check if there are active subscriptions
    const subscription = await getActiveSubscription(userData.id)
    if (subscription) {
      //if active subscription (There will not be any queued subscription)
      await updateSubscription(
        subscription.stripeSubscriptionId,
        subscription.stripeSubscriptionItemId,
        price.stripePriceId
      )
      return { payload: { redirect: false, update: true }, code: 200 }
    }

    //first time payment
    // Create a Stripe customer if not already created
    let stripeCustomerId = user.stripeCustomerId
    if (!stripeCustomerId) {
      const customer = await createCustomer(user.id, user.email)
      stripeCustomerId = customer.id
    }

    // Create Stripe Checkout Session
    const checkoutSession = await getCheckoutSession(
      user.id,
      stripeCustomerId,
      price.stripePriceId
    )
    return { payload: { url: checkoutSession.url, redirect: true }, code: 200 }
  }

  return apiWrapper(apiAction)
}
