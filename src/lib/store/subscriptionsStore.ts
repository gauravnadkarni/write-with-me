// src/store/useStore.ts
import { create } from 'zustand'
import { UserSubscription } from '../types/subscription-model'

type SubscriptionState = {
  checkoutUrl: string | null
  currentSubscription:
    | (Omit<UserSubscription, 'periodEndDate'> & { periodEndDate: string })
    | null
  getSuccess: boolean
  getError: string | null
  isGetProcessing: boolean
  upgradeSuccess: boolean
  cancelSuccess: boolean
  upgradeError: string | null
  cancelError: string | null
  isUpgradeProcessing: boolean
  isCancelProcessing: boolean
}

type SubscriptionActions = {
  startSubscriptionGet: () => void
  getSubscription: () => void
  getSubscriptionSuccess: (
    data: Omit<UserSubscription, 'periodEndDate'> & { periodEndDate: string }
  ) => void
  getSubscriptionFailure: (error: string) => void

  startSubscriptionUpgrade: () => void
  upgradeSubscription: (priceId: string) => void
  upgradeSubscriptionSuccess: (url: string) => void
  upgradeSubscriptionFailure: (error: string) => void

  startSubscriptionCancel: () => void
  cancelSubscription: (subscriptionId: string) => void
  cancelSubscriptionSuccess: (isCancelled: boolean) => void
  cancelSubscriptionFailure: (error: string) => void

  setCurrentSubscription: (
    subscription:
      | (Omit<UserSubscription, 'periodEndDate'> & { periodEndDate: string })
      | null
  ) => void
  resetState: () => void
}

const initialSubscriptionState: SubscriptionState = {
  checkoutUrl: null,
  currentSubscription: null,
  getSuccess: false,
  getError: null,
  isGetProcessing: false,
  upgradeSuccess: false,
  cancelSuccess: false,
  upgradeError: null,
  cancelError: null,
  isUpgradeProcessing: false,
  isCancelProcessing: false,
}

const useSubscriptionsStore = create<SubscriptionState & SubscriptionActions>(
  (set, get) => ({
    ...initialSubscriptionState,
    startSubscriptionGet: () => {
      const currentState = get()
      set({
        ...currentState,
        isGetProcessing: true,
        checkoutUrl: null,
        currentSubscription: null,
      })
    },
    getSubscription: async () => {
      get().startSubscriptionGet()
      try {
        const rawResponse = await fetch('/api/subscriptions/current', {
          method: 'GET',
        })
        const response = await rawResponse.json()
        if ('error' in response) {
          throw response.error
        }
        if (!response.data.plan) {
          throw new Error('Plan not found')
        }
        const subscriptionData = response.data.plan
        get().setCurrentSubscription(subscriptionData)
        get().getSubscriptionSuccess(subscriptionData)
      } catch (error: unknown) {
        if (typeof error === 'string') {
          get().getSubscriptionFailure(error)
          return
        }
        get().getSubscriptionFailure('Error has occured in the backend')
      }
    },
    getSubscriptionSuccess: () => {
      const currentState = get()
      set({
        ...currentState,
        isGetProcessing: false,
        getSuccess: true,
        getError: null,
      })
    },
    getSubscriptionFailure: (error) => {
      const currentState = get()
      set({
        ...currentState,
        isGetProcessing: false,
        getSuccess: false,
        getError: error,
      })
    },

    startSubscriptionUpgrade: () => {
      const currentState = get()
      set({
        ...currentState,
        isUpgradeProcessing: true,
        checkoutUrl: null,
      })
    },
    upgradeSubscription: async (priceId: string) => {
      get().startSubscriptionUpgrade()
      try {
        const rawResponse = await fetch('/api/subscriptions/upgrade', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ priceId }),
        })
        const response = await rawResponse.json()
        if ('error' in response) {
          throw response.error
        }

        if (!response.data.url) {
          throw new Error('Payment URL not found')
        }
        get().upgradeSubscriptionSuccess(response.data.url)
      } catch (error: unknown) {
        if (typeof error === 'string') {
          get().upgradeSubscriptionFailure(error)
          return
        }
        get().upgradeSubscriptionFailure('Error has occured in the backend')
      }
    },
    upgradeSubscriptionSuccess: (url: string) => {
      const currentState = get()
      set({
        ...currentState,
        isUpgradeProcessing: false,
        upgradeSuccess: true,
        checkoutUrl: url,
      })
    },
    upgradeSubscriptionFailure: (error) => {
      const currentState = get()
      set({
        ...currentState,
        isUpgradeProcessing: false,
        upgradeError: error,
      })
    },

    startSubscriptionCancel: () => {
      const currentState = get()
      set({
        ...currentState,
        isCancelProcessing: true,
        cancelSuccess: false,
        cancelError: null,
      })
    },
    cancelSubscription: async (subscriptionId: string) => {
      get().startSubscriptionCancel()
      try {
        const rawResponse = await fetch('/api/subscriptions/cancel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ subscriptionId }),
        })
        const response = await rawResponse.json()
        if ('error' in response) {
          throw response.error
        }

        if (!response.data.url) {
          throw new Error('Payment URL not found')
        }
        const cancelRedirectUrl = response.data.url
        get().cancelSubscriptionSuccess(cancelRedirectUrl)
      } catch (error: unknown) {
        if (typeof error === 'string') {
          get().cancelSubscriptionFailure(error)
          return
        }
        get().cancelSubscriptionFailure('Error has occured in the backend')
      }
    },
    cancelSubscriptionSuccess: (isCancelled: boolean) => {
      const currentState = get()
      set({
        ...currentState,
        isCancelProcessing: false,
        cancelSuccess: isCancelled,
        cancelError: null,
      })
    },
    cancelSubscriptionFailure: (error) => {
      const currentState = get()
      set({
        ...currentState,
        isCancelProcessing: false,
        cancelSuccess: false,
        cancelError: error,
      })
    },

    setCurrentSubscription: (
      subscription:
        | (Omit<UserSubscription, 'periodEndDate'> & { periodEndDate: string })
        | null
    ) => {
      const currentState = get()
      set({
        ...currentState,
        currentSubscription: subscription,
      })
    },
    resetState: () => {
      set({ ...initialSubscriptionState })
    },
  })
)

export default useSubscriptionsStore
