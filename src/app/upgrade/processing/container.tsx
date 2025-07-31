'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { CircleCheckBig } from 'lucide-react'
import { CircleX } from 'lucide-react'

export const Container: React.FC<React.PropsWithChildren> = () => {
  const [status, setStatus] = useState<
    'SUCCESS' | 'FAILED' | 'PENDING' | 'NOACK'
  >('PENDING')
  const [checkAttempts, setCheckAttempts] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!sessionId) return setStatus('FAILED')

    const interval = setInterval(async () => {
      if (!sessionId) {
        setStatus('FAILED')
        return
      }
      setCheckAttempts((prevState) => prevState + 1)
      const res = await fetch(`/api/payments/verify?session_id=${sessionId}`)
      const data = await res.json()

      if (data.success) {
        setStatus('SUCCESS')
        clearInterval(interval)
        router.push('/upgrade') // Redirect to dashboard after confirmation
      } else if (checkAttempts > 60) {
        setStatus('NOACK')
        clearInterval(interval)
        router.push('/upgrade')
      }
    }, 3000) // Poll every 3 seconds

    return () => clearInterval(interval) // Cleanup interval on unmount
  }, [sessionId, router, checkAttempts])

  return (
    <div className="flex justify-center items-center min-h-screen">
      {status === 'PENDING' && (
        <LoaderCircle className="w-72 h-72 animate-spin" />
      )}
      {status === 'NOACK' && (
        <div className="flex flex-col items-center">
          <LoaderCircle className="w-72 h-72 text-blue-300" />
          <div className="text-sm">
            We are trying to confirm your payment. We will let you know once it
            is done.
          </div>
        </div>
      )}
      {status === 'FAILED' && (
        <div className="flex flex-col items-center">
          <CircleX className="w-72 h-72 text-red-300" />
          <div className="text-md text-red-500">Payment Failed.</div>
        </div>
      )}
      {status === 'SUCCESS' && (
        <div className="flex flex-col items-center">
          <CircleCheckBig className="w-72 h-72 text-green-300" />
          <div className="text-sm">Payment Successful.</div>
        </div>
      )}
    </div>
  )
}
