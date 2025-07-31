'use client' // Error components must be Client Components

import useAuthStore from '@/lib/store/authStore'
import useDraftsStore from '@/lib/store/draftsStore'
import useFoldersStore from '@/lib/store/foldersStore'
import useSubscriptionsStore from '@/lib/store/subscriptionsStore'
import useSuggestionsStore from '@/lib/store/suggestionsStore'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { resetState: resetAuthState } = useAuthStore()
  const { resetState: resetFoldersState } = useFoldersStore()
  const { resetState: resetDraftsState } = useDraftsStore()
  const { resetState: resetSubscriptionsState } = useSubscriptionsStore()
  const { resetState: resetSuggestionsState } = useSuggestionsStore()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={() => {
          resetAuthState()
          resetFoldersState()
          resetDraftsState()
          resetSubscriptionsState()
          resetSuggestionsState()
          reset()
        }}
      >
        Try again
      </button>
    </div>
  )
}
