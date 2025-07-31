import {
  activateQueuedSubscription,
  getActiveSubscriptionByUserId,
  getGracedSubscriptionByUserId,
  getQueuedSubscriptionByUserId,
  getValidSubscriptionByUserId,
  updateSubscriptionById,
} from '../repositories/subscriptions'

import { isBefore } from 'date-fns'
import { createSubscription } from '../repositories/subscriptions' // Repository functions
import {
  SubscriptionModel,
  SubscriptionStatusEnum,
} from '../types/subscription-model'

export const getValidSubscription = async (
  userId: string
): Promise<SubscriptionModel | null> => {
  const validSubscription = await getValidSubscriptionByUserId(userId)
  if (!validSubscription) {
    return null
  }
  if (
    [SubscriptionStatusEnum.ACTIVE, SubscriptionStatusEnum.GRACED].includes(
      validSubscription.status as SubscriptionStatusEnum
    )
  ) {
    return validSubscription
  }
  //its cancelled. check the currentPeriodEnd part
  const now = new Date()
  const isValid = isBefore(now, validSubscription.currentPeriodEnd)
  if (isValid) {
    return validSubscription
  }
  return null
}

export const getCurrentSubscription = async (
  userId: string
): Promise<SubscriptionModel | null> => {
  const activeSubscription = await getActiveSubscriptionByUserId(userId)
  if (!activeSubscription) {
    const gracedSubscription = await getGracedSubscriptionByUserId(userId)
    if (!gracedSubscription) {
      return null
    }
    return gracedSubscription
  }
  return activeSubscription
}

export const processCheckoutSessionCompleted = async (
  userId: string,
  subscriptionId: string,
  subscriptionItemId: string,
  priceId: string,
  currentPeriodStart: Date,
  currentPeriodEnd: Date
) => {
  return createSubscription(
    userId,
    subscriptionId,
    subscriptionItemId,
    priceId,
    SubscriptionStatusEnum.ACTIVE,
    currentPeriodStart,
    currentPeriodEnd
  )
}

export const handleSubscriptionRenewal = async (
  userId: string,
  subscriptionId: string,
  subscriptionItemId: string,
  priceId: string,
  currentPeriodStart: Date,
  currentPeriodEnd: Date
) => {
  const activeSubscription = await getActiveSubscriptionByUserId(userId)
  if (activeSubscription) {
    await updateSubscriptionById(activeSubscription.id, userId, {
      status: SubscriptionStatusEnum.INACTIVE,
    })
  }
  const queuedSubscription = await getQueuedSubscriptionByUserId(userId)
  if (queuedSubscription) {
    await activateQueuedSubscription(userId)
    return
  }
  await createSubscription(
    userId,
    subscriptionId,
    subscriptionItemId,
    priceId,
    SubscriptionStatusEnum.ACTIVE,
    currentPeriodStart,
    currentPeriodEnd
  )
}

export const handleSubscriptionChange = async (
  userId: string,
  subscriptionId: string,
  subscriptionItemId: string,
  priceId: string,
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  previousState: string | undefined,
  cancellationStatus: string | undefined
) => {
  if (cancellationStatus === 'cancellation_requested') {
    await handleSubscriptionCanceled(userId, subscriptionId)
    return
  }

  if (previousState === 'incomplete' || previousState === 'past_due') {
    return
  }
  const activeSubscription = await getActiveSubscriptionByUserId(userId)
  if (activeSubscription) {
    if (activeSubscription.currentPeriodEnd === currentPeriodEnd) {
      // Same end period, plan change will be in next billing cycle
      await createSubscription(
        userId,
        subscriptionId,
        subscriptionItemId,
        priceId,
        SubscriptionStatusEnum.QUEUED,
        currentPeriodEnd,
        currentPeriodEnd
      )
    } else {
      // different end period, plan change will start right away
      await updateSubscriptionById(activeSubscription.id, userId, {
        status: SubscriptionStatusEnum.INACTIVE,
      })
      await createSubscription(
        userId,
        subscriptionId,
        subscriptionItemId,
        priceId,
        SubscriptionStatusEnum.ACTIVE,
        currentPeriodStart,
        currentPeriodEnd
      )
    }
  }
}

export const handleSubscriptionCanceled = async (
  userId: string,
  subscriptionId: string
) => {
  const activeSubscription = await getActiveSubscriptionByUserId(
    userId,
    subscriptionId
  )
  if (!activeSubscription) {
    return null
  }
  return updateSubscriptionById(activeSubscription.id, userId, {
    status: SubscriptionStatusEnum.CANCELED,
  })
}

export const handlePaymentFailure = async (
  userId: string,
  subscriptionId: string,
  subscriptionItemId: string,
  attemptCount: number,
  nextAttempt: number | null
) => {
  const activeSubscription = await getActiveSubscriptionByUserId(
    userId,
    subscriptionId
  )
  if (activeSubscription) {
    await updateSubscriptionById(activeSubscription.id, userId, {
      status: SubscriptionStatusEnum.INACTIVE,
    })
    if (nextAttempt !== null) {
      await createSubscription(
        userId,
        subscriptionId,
        subscriptionItemId,
        activeSubscription.priceId,
        SubscriptionStatusEnum.GRACED,
        activeSubscription.currentPeriodEnd,
        activeSubscription.currentPeriodEnd
      )
    }
  } else {
    const gracedSubscription = await getGracedSubscriptionByUserId(userId)
    if (gracedSubscription && nextAttempt === null) {
      await updateSubscriptionById(gracedSubscription.id, userId, {
        status: SubscriptionStatusEnum.INACTIVE,
      })
    }
  }
}

export const getActiveSubscription = async (userId: string) =>
  getActiveSubscriptionByUserId(userId)
