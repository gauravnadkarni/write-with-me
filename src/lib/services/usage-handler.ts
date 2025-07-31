import { BillingCycle } from '@prisma/client'
import { addMonths } from 'date-fns'
import { AppError } from '../errors/app-error'
import { getValidSubscriptionByUserId } from '../repositories/subscriptions'
import {
  createUsageRecordForUser,
  deductCredit,
  findUsageByDate,
  updateUsageById,
} from '../repositories/usage'
import { PriceTypeEnum } from '../types/pricing-model'
import { getPricingById } from './pricing-handler'

//adjust for prorata
export const createNewUsageRecord = async (userId: string) => {
  let requestCount = 5
  const validSubscription = await getValidSubscriptionByUserId(userId)
  const now = new Date()
  const oneMonthLater = addMonths(now, 1)
  if (!validSubscription) {
    await createUsageRecordForUser(userId, requestCount, now, oneMonthLater)
    return
  }
  const pricing = await getPricingById(validSubscription.priceId)
  if (!pricing) {
    throw new AppError('Pricing not found', 404)
  }

  if (pricing.planType === PriceTypeEnum.PRO) {
    if (pricing.billingCycle === BillingCycle.MONTHLY) requestCount = 100
    if (pricing.billingCycle === BillingCycle.YEARLY) requestCount = 4000
    await createUsageRecordForUser(userId, requestCount, now, oneMonthLater)
    return
  } else if (pricing.planType === PriceTypeEnum.TEAM) {
    if (pricing.billingCycle === BillingCycle.MONTHLY) requestCount = 500
    if (pricing.billingCycle === BillingCycle.YEARLY) requestCount = 10000
    await createUsageRecordForUser(userId, requestCount, now, oneMonthLater)
    return
  }

  await createUsageRecordForUser(userId, requestCount, now, oneMonthLater)
}

export const getUsageForCurrentPeriod = async (userId: string) => {
  const now = new Date()
  return findUsageByDate(userId, now)
}

export const deductUsageForCurrentPeriod = async (userId: string) => {
  const now = new Date()
  const usage = await findUsageByDate(userId, now)
  if (!usage) {
    throw new AppError('Unable to find usage record', 500)
  }
  if (usage.requestCount <= 0) {
    throw new AppError('No requests left for current period', 400)
  }
  //await updateUsageById(userId, usage.id, usage.requestCount - 1)
  await deductCredit(userId, 1)
}

export const updateUsageRecord = async (userId: string) => {
  let requestCount = 5
  const validSubscription = await getValidSubscriptionByUserId(userId)
  const now = new Date()
  const oneMonthLater = addMonths(now, 1)
  if (!validSubscription) {
    throw new AppError('Invalid subscription', 400)
  }
  const pricing = await getPricingById(validSubscription.priceId)
  if (!pricing) {
    throw new AppError('Pricing not found', 404)
  }

  if (pricing.planType === PriceTypeEnum.PRO) {
    if (pricing.billingCycle === BillingCycle.MONTHLY) requestCount = 100
    if (pricing.billingCycle === BillingCycle.YEARLY) requestCount = 4000
    const usage = await findUsageByDate(userId, now)
    if (!usage) {
      await createUsageRecordForUser(userId, requestCount, now, oneMonthLater)
      return
    }
    await updateUsageById(userId, usage.id, usage.requestCount + requestCount)
    return
  } else {
    if (pricing.billingCycle === BillingCycle.MONTHLY) requestCount = 500
    if (pricing.billingCycle === BillingCycle.YEARLY) requestCount = 10000
    const usage = await findUsageByDate(userId, now)
    if (!usage) {
      await createUsageRecordForUser(userId, requestCount, now, oneMonthLater)
      return
    }
    await updateUsageById(userId, usage.id, usage.requestCount + requestCount)
    return
  }
}
