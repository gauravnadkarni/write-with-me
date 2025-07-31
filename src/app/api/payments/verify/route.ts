// app/api/generate/route.ts

import { apiWrapper } from '@/lib/api-wrapper'
import { AppError } from '@/lib/errors/app-error'
import { getCheckoutSessionBySessionId } from '@/lib/services/stripe-handler'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const apiAction = async () => {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      throw new AppError('No session ID', 400)
    }

    const session = await getCheckoutSessionBySessionId(sessionId)
    return {
      payload: { success: session.payment_status === 'paid' },
      code: 200,
    }
  }

  return apiWrapper(apiAction)
}
