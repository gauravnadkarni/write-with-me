import { AbstractError } from './abstract-error'

export class AuthError extends AbstractError {
  constructor(message: string, code?: number, payload?: unknown) {
    super(message, code || 401, payload)
  }
}
