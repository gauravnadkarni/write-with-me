import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { SuggestionModel } from '../types/suggestion-model'
import { SuggestionsGenerator } from './SuggestionsGenerator'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `You are an AI language assistant specialized in providing quick and accurate sentence completion suggestions.
- Your task is to generate 1 to 3 possible continuations for a given partial sentence or phrase.
- The input may contain a few words, an incomplete sentence, or even an incomplete word.
- If the last word in the input is incomplete, complete the word before continuing the sentence.
- If the input ends at a full word, suggest sentence completions with leading and trailing spaces.
- Ensure each completion is grammatically correct and coherent with the input.
- Ensure the output is grammatically correct and coherent.
- Only provide the completion part, not the entire sentence including the input.
- Return the response as a JSON object with a single key "suggestions" containing an array of suggestion objects.
- Single suggestion object contain the following keys:
  - "id": A unique identifier for the suggestion.
  - "text": The suggested sentence completion.
- The array should have a minimum of 1 suggestion and a maximum of 3 suggestions.
- Remember, your completions should only include the new text that continues or completes the input, not the entire sentence including the input text.
- IMPORTANT: Check if the input ends with a space:
  - If the input has a trailing space (ends with whitespace), the value of the text property of all suggestion objects must start WITHOUT any leading space
  - If the input has NO trailing space (ends directly with a character/word), the value of the text property of all suggestion objects must start WITH a leading space`
const COMPLETION_TEMPERATURE = 0.3
const MAX_COMPLETION_TOKENS = 200

const SuggestionSchema = z.object({
  id: z.number(),
  text: z.string(),
})

// Schema for the complete response
const ResponseSchema = z.object({
  suggestions: z.array(SuggestionSchema).min(1).max(3),
})

export class ClaudeSuggestionsGenerator implements SuggestionsGenerator {
  constructor() {}

  async generateSuggestion(context: string): Promise<Array<SuggestionModel>> {
    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: MAX_COMPLETION_TOKENS,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: context,
          },
        ],
        temperature: COMPLETION_TEMPERATURE,
      })
      const textContent = message.content.find((block) => block.type === 'text')
      if (!textContent || typeof textContent.text !== 'string') {
        console.log(message, 'no valid text')
        throw new Error('No valid text response from Claude')
      }
      const rawResponse = JSON.parse(textContent.text)
      const validatedResponse = ResponseSchema.parse(rawResponse)
      return validatedResponse.suggestions.map((suggestion) => ({
        ...suggestion,
        id: suggestion.id.toString(),
      }))
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        console.error('Schema validation error:', error.errors)
        throw new Error('Invalid response format from Claude')
      }
      if (error instanceof SyntaxError) {
        console.error('JSON parsing error:', error)
        throw new Error('Invalid JSON response from Claude')
      }
      console.error('Unexpected error:', error)
      throw error
    }
  }
}
