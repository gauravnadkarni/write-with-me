import { apiWrapper } from '@/lib/api-wrapper'
import { AuthError } from '@/lib/errors/auth-error'
import { listAllPricings } from '@/lib/services/pricing-handler'
import { getValidSubscription } from '@/lib/services/subscription-handler'
import { getUsageForCurrentPeriod } from '@/lib/services/usage-handler'
import { createClient } from '@/lib/supabaseServer'
import { PriceTypeEnum } from '@/lib/types/pricing-model'
import { SubscriptionStatusEnum } from '@/lib/types/subscription-model'
import { BillingCycle } from '@prisma/client'

export async function GET() {
  const apiAction = async () => {
    const supabase = await createClient()
    const {
      data: { user: userData },
      error,
    } = await supabase.auth.getUser()

    if (error || !userData) {
      throw new AuthError('Unauthorized', 401, error)
    }
    let subscribedPriceData
    const pricing = await listAllPricings(1, 10)
    const currentSubscription = await getValidSubscription(userData.id)
    if (currentSubscription) {
      subscribedPriceData = pricing.find(
        (price) => price.id === currentSubscription.priceId
      )
    }
    if (!subscribedPriceData) {
      subscribedPriceData = pricing.find(
        (price) => price.planType === 'FREE' && price.billingCycle === 'MONTHLY'
      )
    }
    let totalCredit = 5
    const usage = await getUsageForCurrentPeriod(userData.id)

    if (subscribedPriceData?.planType === PriceTypeEnum.PRO) {
      if (subscribedPriceData.billingCycle === BillingCycle.YEARLY) {
        totalCredit = 4000
      } else {
        totalCredit = 100
      }
    } else if (subscribedPriceData?.planType === PriceTypeEnum.TEAM) {
      if (subscribedPriceData.billingCycle === BillingCycle.YEARLY) {
        totalCredit = 10000
      } else {
        totalCredit = 500
      }
    }

    return {
      payload: {
        plan: {
          id: subscribedPriceData!.id,
          name: subscribedPriceData!.name,
          isYearly: subscribedPriceData!.billingCycle === 'YEARLY',
          subscriptionId: currentSubscription
            ? currentSubscription.stripeSubscriptionId
            : undefined,
          isCanceled:
            currentSubscription?.status === SubscriptionStatusEnum.CANCELED,
          periodEndDate: currentSubscription?.currentPeriodEnd,
          priceId: currentSubscription?.priceId,
          totalCreditRemaining: usage?.requestCount ?? 0,
          totalCredit: totalCredit,
        },
      },
      code: 200,
    }
  }

  return apiWrapper(apiAction)
}
