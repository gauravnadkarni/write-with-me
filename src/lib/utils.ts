import { Editor } from '@tiptap/core'
import { clsx, type ClassValue } from 'clsx'
import { format, toZonedTime } from 'date-fns-tz'
import superagent, { SuperAgentRequest } from 'superagent'
import { twMerge } from 'tailwind-merge'
import { AbstractError } from './errors/abstract-error'
import { ErrorResponse } from './types/error'
import { parse } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const isValidationError = (
  error: unknown
): error is { name: string; errors: Record<string, unknown> } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    'errors' in error &&
    (error as { name: string }).name === 'ValidationError'
  )
}

export const handleError = (error: unknown): ErrorResponse => {
  if (error instanceof AbstractError) {
    return {
      error: error.message,
      code: error.code,
      payload: error.payload as Record<string, unknown>,
    }
  } else if (isValidationError(error)) {
    return { error: 'Validation Error', code: 400, payload: error.errors }
  } else if (error instanceof Error) {
    return { error: error.message, code: 500, payload: {} }
  }
  return { error: 'Unknown error occured', code: 500, payload: {} }
}

export const convertUtcDateTimeToLocal = (
  utcDate: Date,
  timeZone: string,
  outputFormat: string = 'yyyy-MM-dd HH:mm:ssXXX'
) => {
  const zonedDate = toZonedTime(utcDate, timeZone)
  return format(zonedDate, outputFormat, { timeZone })
}

export const convertStringToDateTime = (
  inputDateStr: string,
  inputFormat: string = 'yyyy-MM-dd HH:mm:ssXXX'
) => {
  return parse(inputDateStr, inputFormat, new Date()) // Ensure correct format
}

export const convertDateTimeStringToDifferentFormat = (
  inputDateStr: string,
  timeZone: string,
  inputFormat: string = 'yyyy-MM-dd HH:mm:ssXXX',
  outputFormat: string = 'yyyy-MM-dd HH:mm:ssXXX'
) => {
  const parsedDate = convertStringToDateTime(inputDateStr, inputFormat) // Parse with correct input format
  return convertUtcDateTimeToLocal(parsedDate, timeZone, outputFormat) // Convert to local time zone and format
}

export const exportToMarkdown = (editor: Editor) => {
  const markdown = editor.storage.markdown.getMarkdown()
  const blob = new Blob([markdown], { type: 'text/markdown' })
  const link = document.createElement('a')
  link.download = 'editor-content.md'
  link.href = window.URL.createObjectURL(blob)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const makeHttpGetCall = async <
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  url: string,
  bodyData: T = {} as T,
  headers: Record<string, string> = {}
): Promise<SuperAgentRequest> => superagent.get(url).set(headers).send(bodyData)

export const makeHttpPostCall = async <
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  url: string,
  bodyData: T = {} as T,
  headers: Record<string, string> = {}
): Promise<SuperAgentRequest> =>
  superagent.post(url).set(headers).send(bodyData)

export const getContext = (input: string | undefined): string | undefined => {
  if (!input) return undefined

  let cleanInput = input.replace(/<[^>]*>/g, '')

  cleanInput = cleanInput.replace(/[\n\t]+/g, ' ').replace(/\s+/g, ' ')
  // Removed the .trim() here

  if (!cleanInput) return undefined

  const sentences = cleanInput.match(/[^.]+[.]|[^.]+$/g)
  if (!sentences) return undefined

  const lastCompleteSentence =
    sentences.length > 1 ? sentences[sentences.length - 2] : ''

  const currentSentence = sentences[sentences.length - 1]

  const words = currentSentence.split(/\s+/)

  if (words.length > 20) {
    return words.slice(0, 20).join(' ')
  }

  // Using regex to preserve trailing whitespace
  let result = lastCompleteSentence + ' ' + currentSentence
  result = result.replace(/^(.*?)(\s*)$/, (_, content, trailingSpace) => {
    // Safe access to match results
    const matches = input.match(/\s*$/)
    const originalTrailingSpace = matches ? matches[0] : ''
    return content + (originalTrailingSpace || trailingSpace)
  })

  return result
}

export const replaceLongTextWithEllipses = (
  text: string,
  maxLength: number = 10
): string => (text.length > maxLength ? text.slice(0, maxLength) + '...' : text)

export const cleanString = (input: string): string => {
  if (!input) {
    return input
  }
  let cleanInput = input.replace(/<[^>]*>/g, '')
  cleanInput = cleanInput.replace(/[\n\t]+/g, ' ')
  cleanInput = cleanInput.replace(/\s+/g, ' ')
  return cleanInput.trim()
}
