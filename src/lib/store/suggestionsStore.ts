// src/store/useStore.ts
import { create } from 'zustand'
import { SuggestionModel } from '../types/suggestion-model'
import { makeHttpPostCall } from '../utils'
import { UserSubscription } from '../types/subscription-model'

type SuggestionState = {
  currentSuggestions: Array<SuggestionModel & { isVisible: boolean }>
  isGetProcessing: boolean
  getSuccess: boolean
  getError: string | null
}

type SuggestionActions = {
  startGetSuggestions: (context: string) => void
  getSuggestions: (
    context: string,
    currentSubscription:
      | (Omit<UserSubscription, 'periodEndDate'> & {
          periodEndDate: string
        })
      | null
  ) => Promise<void>
  getSuggestionsSuccess: (
    data: Array<SuggestionModel & { isVisible: boolean }>
  ) => void
  getSuggestionsFailure: (error: string) => void
  clearCurrentSuggestions: () => void
  resetState: () => void
}

const initialSuggestionState: SuggestionState = {
  currentSuggestions: [],
  isGetProcessing: false,
  getError: null,
  getSuccess: false,
}

const useSuggestionsStore = create<SuggestionState & SuggestionActions>(
  (set, get) => ({
    ...initialSuggestionState,
    startGetSuggestions: () => {
      const currentState = get()
      set({
        ...currentState,
        currentSuggestions: [],
        isGetProcessing: true,
        getSuccess: false,
      })
    },
    getSuggestions: async (
      context: string,
      currentSubscription:
        | (Omit<UserSubscription, 'periodEndDate'> & {
            periodEndDate: string
          })
        | null
    ) => {
      try {
        if (
          !currentSubscription ||
          currentSubscription.totalCreditRemaining <= 0
        ) {
          return
        }
        get().startGetSuggestions(context)
        const response: {
          body: {
            data: Array<SuggestionModel>
            code: number
            error?: string
          }
        } = await makeHttpPostCall<{
          context: string
        }>('/api/suggestions', { context })
        if (response.body.error) {
          throw response.body.error
        }
        get().clearCurrentSuggestions()
        get().getSuggestionsSuccess(
          response.body.data.map((suggestion: SuggestionModel) => ({
            ...suggestion,
            isVisible: true,
          }))
        )
      } catch (error: unknown) {
        if (typeof error === 'string') {
          get().getSuggestionsFailure(
            error || 'Error has occured in the backend'
          )
          return
        }
        get().getSuggestionsFailure('Error has occured in the backend')
      }
    },
    getSuggestionsSuccess: (
      suggestions: Array<SuggestionModel & { isVisible: boolean }>
    ) => {
      const currentState = get()
      set({
        ...currentState,
        isGetProcessing: false,
        currentSuggestions: suggestions,
        getSuccess: true,
      })
    },
    getSuggestionsFailure: (error) => {
      const currentState = get()
      set({
        ...currentState,
        isGetProcessing: false,
        currentSuggestions: [],
        getError: error,
      })
    },
    clearCurrentSuggestions: () => {
      const currentState = get()
      set({
        ...currentState,
        isGetProcessing: false,
        currentSuggestions: [],
        getSuccess: false,
        getError: null,
      })
    },
    resetState: () => {
      set({ ...initialSuggestionState })
    },
  })
)

export default useSuggestionsStore
