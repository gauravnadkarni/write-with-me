'use client'

import { useEffect, useState } from 'react'

import { useSearchParams } from 'next/navigation'
import { validateAuthWithProvider } from '@/lib/actions/auth'

export default function Container() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      if (!code) {
        setError('Issue with login')
        return
      }
      const data = await validateAuthWithProvider(code)

      if ('error' in data) {
        console.error('Error fetching session:', data.error)
        window.opener.postMessage(
          { type: 'provider_oauth', error: 'Login failed' },
          window.location.origin
        )
      } else if (data.data!.session) {
        // Send the session data back to the main window
        window.opener.postMessage(
          { session: data.data!.session, type: 'provider_oauth' },
          window.location.origin
        )
      }

      // Close the popup
      window.close()
    }

    handleCallback()
  }, [searchParams])

  return error ? <h1>{error}</h1> : <h1>Loading...</h1>
}
