export abstract class AbstractError extends Error {
  code: number
  payload?: unknown
  constructor(message: string, code: number, payload?: unknown) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.payload = payload
  }
}
