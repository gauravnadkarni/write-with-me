import prisma, { applyWithUserFilter } from '@/lib/prisma'
import {
  SubscriptionModel,
  SubscriptionStatusEnum,
} from '../types/subscription-model'
import { AuthError } from '../errors/auth-error'

export const createSubscription = async (
  userId: string,
  stripeSubscriptionId: string,
  stripeSubscriptionItemId: string,
  priceId: string,
  status: SubscriptionStatusEnum,
  currentPeriodStart: Date,
  currentPeriodEnd: Date
) => {
  return prisma.subscriptions.create({
    data: {
      userId,
      stripeSubscriptionId,
      stripeSubscriptionItemId,
      priceId,
      status,
      currentPeriodStart,
      currentPeriodEnd,
    },
  })
}

export const getValidSubscriptionByUserId = async (
  userId: string,
  subscriptionId?: string
) => {
  if (!userId) {
    throw new AuthError('User not found', 401)
  }
  return prisma.subscriptions.findFirst({
    where: {
      OR: [
        {
          status: SubscriptionStatusEnum.ACTIVE,
        },
        {
          status: SubscriptionStatusEnum.GRACED,
        },
        {
          status: SubscriptionStatusEnum.CANCELED,
        },
      ],
      userId,
      ...(subscriptionId && { stripeSubscriptionId: subscriptionId }),
    },
    orderBy: [
      {
        currentPeriodEnd: 'desc',
      },
    ],
    take: 1,
  })
}

export const getActiveSubscriptionByUserId = async (
  userId: string,
  subscriptionId?: string
) => {
  return prisma.subscriptions.findFirst({
    ...applyWithUserFilter({
      userId,
      status: SubscriptionStatusEnum.ACTIVE,
      ...(subscriptionId && { stripeSubscriptionId: subscriptionId }),
    }),
  })
}

export const updateSubscriptionById = async (
  id: string,
  userId: string,
  subscription: Partial<SubscriptionModel>
) => {
  return prisma.subscriptions.updateMany({
    ...applyWithUserFilter({ userId, id }),
    data: {
      ...subscription,
    },
  })
}

export const getQueuedSubscriptionByUserId = async (userId: string) => {
  return prisma.subscriptions.findFirst({
    ...applyWithUserFilter({ userId, status: SubscriptionStatusEnum.QUEUED }),
  })
}

export const getGracedSubscriptionByUserId = async (userId: string) => {
  return prisma.subscriptions.findFirst({
    ...applyWithUserFilter({ userId, status: SubscriptionStatusEnum.GRACED }),
  })
}

export const getInactiveSubscriptionByUserId = async (userId: string) => {
  return prisma.subscriptions.findMany({
    ...applyWithUserFilter({ userId, status: SubscriptionStatusEnum.INACTIVE }),
  })
}

export const updateSubscriptionActiveStatusToInactive = async (
  userId: string
) => {
  return prisma.subscriptions.updateMany({
    ...applyWithUserFilter({ userId, status: SubscriptionStatusEnum.ACTIVE }),
    data: {
      status: SubscriptionStatusEnum.INACTIVE,
    },
  })
}

export const updateSubscriptionActiveStatusToCanceled = async (
  userId: string
) => {
  return prisma.subscriptions.updateMany({
    ...applyWithUserFilter({ userId, status: SubscriptionStatusEnum.ACTIVE }),
    data: {
      status: SubscriptionStatusEnum.CANCELED,
    },
  })
}

export const queueSubscriptionUpgrade = async (
  userId: string,
  stripeSubscriptionId: string,
  stripeSubscriptionItemId: string,
  priceId: string,
  currentPeriodStart: Date,
  currentPeriodEnd: Date
) => {
  return prisma.subscriptions.create({
    data: {
      userId,
      stripeSubscriptionId,
      stripeSubscriptionItemId,
      priceId,
      status: SubscriptionStatusEnum.QUEUED, // Mark new plan as queued
      currentPeriodStart,
      currentPeriodEnd,
    },
  })
}

export const activateQueuedSubscription = async (userId: string) => {
  return prisma.subscriptions.updateMany({
    ...applyWithUserFilter({ userId, status: SubscriptionStatusEnum.QUEUED }),
    data: {
      status: SubscriptionStatusEnum.ACTIVE,
    },
  })
}
