// src/store/useStore.ts
import { create } from 'zustand'
import {
  authWithProvider as authWithProviderServerAction,
  signout as signoutServerAction,
} from '../actions/auth'
import { ThirdPartyAuthProviders } from '../types/third-party-auth-providers'

// Define the types for your store's state
type AuthState = {
  user: {
    email: string
    id: string
  } | null
  signIn: {
    isSignedIn: boolean
    isSuccess: boolean
    isProcessing: boolean
    error: string | null
    provider: ThirdPartyAuthProviders | null
    callback: string | null
  }
  signOut: {
    isSignedOut: boolean
    isSuccess: boolean
    isProcessing: boolean
    error: string | null
  }
}

type AuthActions = {
  signin: (provider: ThirdPartyAuthProviders) => void
  signout: () => void
  signinStart: () => void
  signinSuccess: () => void
  signinFailure: (error: string) => void
  signoutStart: () => void
  signoutSuccess: () => void
  signoutFailure: (error: string) => void
  resetState: () => void
}

const initialState: AuthState = {
  user: null,
  signIn: {
    isSignedIn: false,
    isSuccess: false,
    isProcessing: false,
    error: null,
    provider: null,
    callback: null,
  },
  signOut: {
    isSignedOut: false,
    isSuccess: false,
    isProcessing: false,
    error: null,
  },
}

const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  ...initialState,
  signinStart: () => {
    set({
      ...initialState,
      signIn: {
        ...initialState.signIn,
        isProcessing: true,
      },
    })
  },
  signin: async (provider: ThirdPartyAuthProviders) => {
    try {
      get().signinStart()
      const response = await authWithProviderServerAction(provider)
      if ('error' in response) {
        throw response.error
      }
      const { data } = response
      set({
        ...initialState,
        signIn: {
          ...initialState.signIn,
          callback: data!.url,
        },
      })
    } catch (error: unknown) {
      if (typeof error === 'string') {
        get().signinFailure(error)
        return
      }
      get().signinFailure('Error has occured in the backend')
    }
  },
  signinSuccess: () => {
    const {
      signIn: { provider },
    } = initialState
    set({
      ...initialState,
      signIn: {
        ...initialState.signIn,
        provider,
        isSuccess: true,
        isSignedIn: true,
      },
    })
  },
  signinFailure: (error: string) => {
    const {
      signIn: { provider },
    } = initialState
    set({
      ...initialState,
      signIn: { ...initialState.signIn, provider, isSuccess: false, error },
    })
  },
  signout: async () => {
    try {
      get().signoutStart()
      const response = await signoutServerAction()
      if ('error' in response) {
        throw response.error
      }
      get().signoutSuccess()
    } catch (error: unknown) {
      if (typeof error === 'string') {
        get().signoutFailure(error)
        return
      }
      get().signoutFailure('Error has occured in the backend')
    }
  },
  signoutStart: () => {
    set({
      ...initialState,
      signOut: {
        ...initialState.signOut,
        isProcessing: true,
      },
    })
  },
  signoutSuccess: () => {
    set({
      ...initialState,
      signOut: {
        ...initialState.signOut,
        isSuccess: true,
        isSignedOut: true,
      },
    })
  },
  signoutFailure: (error: string) => {
    set({
      ...initialState,
      signOut: {
        ...initialState.signOut,
        isSuccess: false,
        error,
      },
    })
  },
  resetState: () => {
    set({ ...initialState })
  },
}))

export default useAuthStore
