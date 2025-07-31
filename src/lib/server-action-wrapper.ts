import { handleError } from './utils'

type ServerAction<T> = () => Promise<T>

export async function serverActionWrapper<T>(action: ServerAction<T>) {
  try {
    const result = await action()
    return { success: true, data: result }
  } catch (error: unknown) {
    return handleError(error)
  }
}
