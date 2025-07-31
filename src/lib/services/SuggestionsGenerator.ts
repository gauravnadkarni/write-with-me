import { SuggestionModel } from '../types/suggestion-model'

export interface SuggestionsGenerator {
  generateSuggestion(context: string): Promise<Array<SuggestionModel>>
}
