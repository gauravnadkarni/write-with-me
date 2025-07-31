import { apiWrapper } from '@/lib/api-wrapper'
import { AuthError } from '@/lib/errors/auth-error'
import { ValidationError } from '@/lib/errors/validation-error'
import {
  cancelSubscription,
  getSubscriptionCancellationDatetime,
} from '@/lib/services/stripe-handler'
import { handleSubscriptionCanceled } from '@/lib/services/subscription-handler'
import { createClient } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  const apiAction = async () => {
    const supabase = await createClient()
    const {
      data: { user: userData },
      error,
    } = await supabase.auth.getUser()

    if (error || !userData) {
      throw new AuthError('Unauthorized', 401, error)
    }
    const { subscriptionId } = await req.json()
    if (!subscriptionId) {
      throw new ValidationError('Subscription ID is missing', 400)
    }

    await cancelSubscription(subscriptionId)
    await handleSubscriptionCanceled(userData.id, subscriptionId) //do it here as cancel subscription occurs in the webhook which is async and will not update ui immediately
    const cancellationAt = getSubscriptionCancellationDatetime(subscriptionId)
    return {
      payload: {
        success: 'Subscription cancelled',
        cancellation_at: cancellationAt,
        url: '/upgrade',
      },
      code: 200,
    }
  }

  return apiWrapper(apiAction)
}
