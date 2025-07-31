import { NextResponse } from 'next/server'
import { handleError } from './utils'

type ApiWrapper<T> = () => Promise<T & { code: number; payload: unknown }>

export async function apiWrapper<T>(
  action: ApiWrapper<T>,
  rawResponse = false
) {
  try {
    const result = await action()
    if (rawResponse) {
      const { payload } = result
      return NextResponse.json(payload)
    }
    return NextResponse.json(
      { success: true, data: result.payload },
      { status: result.code || 200 }
    )
  } catch (error: unknown) {
    const response = handleError(error)
    return NextResponse.json(response, { status: response.code })
  }
}
