// app/api/generate/route.ts

import { apiWrapper } from '@/lib/api-wrapper'
import { AppError } from '@/lib/errors/app-error'
import { AuthError } from '@/lib/errors/auth-error'
import { ValidationError } from '@/lib/errors/validation-error'
import { findUsageByDate } from '@/lib/repositories/usage'
import { ClaudeSuggestionsGenerator } from '@/lib/services/ClaudeSuggestionsGenerator'
import { deductUsageForCurrentPeriod } from '@/lib/services/usage-handler'
import { createClient } from '@/lib/supabaseServer'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const apiAction = async () => {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      throw new AuthError('Unauthorized', 401, error)
    }
    const { context } = await req.json()
    if (!context) {
      throw new ValidationError('Sentence context is missing')
    }

    const updateApiUsage = await findUsageByDate(user.id, new Date())
    if (!updateApiUsage || updateApiUsage.requestCount <= 0) {
      throw new AppError('No credits remaining', 400)
    }
    const response = await new ClaudeSuggestionsGenerator().generateSuggestion(
      context
    )

    await deductUsageForCurrentPeriod(user.id)

    return {
      payload: response.map((item) => {
        return {
          id: item.id,
          text: `${item.text} `,
        }
      }),
      code: 200,
    }
  }

  return apiWrapper(apiAction)
}
