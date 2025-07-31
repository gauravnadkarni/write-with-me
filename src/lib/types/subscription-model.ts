import { Subscriptions } from '@prisma/client'

export type SubscriptionModel = Subscriptions

export type SubscriptionModelWithoutUserId = Omit<Subscriptions, 'userId'>

export type SubscriptionModelWithoutTimestamps = Omit<
  Subscriptions,
  'createdAt' | 'updatedAt'
>

export type SubscriptionModelWithoutUserIdAndTimestamps = Omit<
  Subscriptions,
  'userId' | 'createdAt' | 'updatedAt'
>

export enum SubscriptionStatusEnum {
  ACTIVE = 'ACTIVE',
  GRACED = 'GRACED',
  INACTIVE = 'INACTIVE',
  QUEUED = 'QUEUED',
  CANCELED = 'CANCELED',
}

export type UserSubscription = {
  id: string
  name: string
  isYearly: boolean
  subscriptionId: string | undefined
  isCanceled: boolean | undefined
  periodEndDate: Date | null
  priceId: string
  totalCreditRemaining: number
  totalCredit: number
}
