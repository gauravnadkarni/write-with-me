import { AbstractError } from './abstract-error'

export class AppError extends AbstractError {
  constructor(message: string, code: number, payload?: unknown) {
    super(message, code, payload)
  }
}
