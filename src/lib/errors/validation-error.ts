import { AbstractError } from './abstract-error'

export class ValidationError extends AbstractError {
  constructor(message: string, code?: number, payload?: unknown) {
    super(message, code || 400, payload)
  }
}
