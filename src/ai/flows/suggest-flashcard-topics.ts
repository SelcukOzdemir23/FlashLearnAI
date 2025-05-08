'use server';
/**
 * @fileOverview Suggests related flashcard topics based on user input.
 *
 * - suggestFlashcardTopics - A function that suggests flashcard topics.
 * - SuggestFlashcardTopicsInput - The input type for the suggestFlashcardTopics function.
 * - SuggestFlashcardTopicsOutput - The return type for the suggestFlashcardTopics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFlashcardTopicsInputSchema = z.object({
  currentTopic: z.string().describe('The current topic typed by the user, potentially incomplete.'),
});
export type SuggestFlashcardTopicsInput = z.infer<typeof SuggestFlashcardTopicsInputSchema>;

const SuggestFlashcardTopicsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of 3-5 related or more specific topic suggestions.'),
});
export type SuggestFlashcardTopicsOutput = z.infer<typeof SuggestFlashcardTopicsOutputSchema>;

export async function suggestFlashcardTopics(input: SuggestFlashcardTopicsInput): Promise<SuggestFlashcardTopicsOutput> {
  // Prevent API calls for very short or empty inputs if not handled by debouncer/caller
  if (!input.currentTopic || input.currentTopic.trim().length < 3) {
    return { suggestions: [] };
  }
  return suggestFlashcardTopicsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFlashcardTopicsPrompt',
  input: {schema: SuggestFlashcardTopicsInputSchema},
  output: {schema: SuggestFlashcardTopicsOutputSchema},
  prompt: `Based on the user's current input for a flashcard topic, provide 3 to 5 suggestions for related or more specific topics.
The suggestions should be concise and suitable for flashcard generation. Aim for variety in the suggestions, covering different aspects or sub-topics if possible.
User input: {{{currentTopic}}}

Return the suggestions as a JSON object with a "suggestions" array.
Example for input "History of Rome":
{
  "suggestions": [
    "Roman Republic",
    "Roman Empire",
    "Julius Caesar",
    "Punic Wars",
    "Fall of the Western Roman Empire"
  ]
}
Example for input "Eco":
{
  "suggestions": [
    "Ecosystems and Biomes",
    "Ecological Succession",
    "Conservation Biology",
    "Population Ecology",
    "Human Impact on Ecosystems"
  ]
}
`,
});

const suggestFlashcardTopicsFlow = ai.defineFlow(
  {
    name: 'suggestFlashcardTopicsFlow',
    inputSchema: SuggestFlashcardTopicsInputSchema,
    outputSchema: SuggestFlashcardTopicsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    // Ensure output is not null and suggestions array exists, provide empty array as fallback
    return output ?? { suggestions: [] };
  }
);
