import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z, ZodSchema } from 'zod'
import { AppError } from '../errors/app-error'
import { SuggestionModel } from '../types/suggestion-model'
import { SuggestionsGenerator } from './SuggestionsGenerator'

const SYSTEM_PROMPT = `You are an AI language assistant that provides sentence completion suggestions based on a partial sentence or phrase given as context.
- Your task is to generate 1 to 3 possible sentence continuations.
- The input may contain a few words, an incomplete sentence, or even an incomplete word.
- If the last word in the input is incomplete, complete the word before continuing the sentence.
- If the input ends at a full word, suggest sentence completions with leading and trailing spaces.
- Ensure the output is grammatically correct and coherent.
- Return the response as a JSON array where each object contains:
  - "id": A unique identifier for the suggestion.
  - "text": The suggested sentence completion.
  - "includesWordCompletion": A boolean indicating whether the completion includes an incomplete word (true) or only extends the sentence (false).
- The array should have a minimum of 1 suggestion and a maximum of 3 suggestions.`

const COMPLETION_TEMPERATURE = 0.3
const MAX_COMPLETION_TOKENS = 50
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const NextSentenceOrAutocompletePrediction: ZodSchema<
  Array<{ id: string; text: string; includesWordCompletion: boolean }>
> = z
  .array(
    z.object({
      text: z.string(),
      id: z.string(),
      includesWordCompletion: z.boolean(),
    })
  )
  .min(1)
  .max(3)

//type OutputType = z.infer<typeof NextSentenceOrAutocompletePrediction>;

export class ChatGptSuggestionsGenerator implements SuggestionsGenerator {
  constructor() {}

  async generateSuggestion(
    context: string
  ): Promise<Array<SuggestionModel & { includesWordCompletion: boolean }>> {
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      model: 'gpt-4o-2024-08-06', // Specify the model you wish to use
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: context },
      ],
      temperature: COMPLETION_TEMPERATURE,
      n: 3,
      max_completion_tokens: MAX_COMPLETION_TOKENS, // Adjust based on your needs
      response_format: zodResponseFormat(
        NextSentenceOrAutocompletePrediction,
        'next_sentence_or_autocomplete_prediction'
      ),
    }
    console.log('chat completion from chat gpt initiated')
    const chatCompletion = await openai.chat.completions.create(params)
    console.log(chatCompletion, 'chat completion from chat gpt')
    if (chatCompletion.choices[0].finish_reason === 'length') {
      throw new AppError('Incomplete response from the engine', 500)
    }
    console.log('chat completion from chat gpt', 'no finish reason')
    const completionText = chatCompletion.choices[0].message

    if (completionText.refusal) {
      console.log('chat completion from chat gpt', 'no refusal')
      throw new AppError('Backend engine refused to generate suggestions', 500)
    } else if (completionText.content) {
      console.log('chat completion from chat gpt', 'returning content')
      const parsedResponse: Array<
        SuggestionModel & { includesWordCompletion: boolean }
      > = NextSentenceOrAutocompletePrediction.parse(
        JSON.parse(completionText.content ?? '[]')
      )
      return parsedResponse
    }
    console.log('chat completion from chat gpt', 'no content')
    throw new AppError('No response content from engine', 500)
  }
}
