// src/ai/flows/generate-flashcards.ts
'use server';

/**
 * @fileOverview Flashcard generator from a topic.
 *
 * - generateFlashcards - A function that generates flashcards for a given topic.
 * - GenerateFlashcardsInput - The input type for the generateFlashcards function.
 * - GenerateFlashcardsOutput - The return type for the generateFlashcards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFlashcardsInputSchema = z.object({
  topic: z.string().describe('The topic to generate flashcards for.'),
});
export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;

const FlashcardSchema = z.object({
  question: z.string().describe('The flashcard question.'),
  answer: z.string().describe('The flashcard answer.'),
});

const GenerateFlashcardsOutputSchema = z.object({
  flashcards: z.array(FlashcardSchema).describe('The generated flashcards.'),
});
export type GenerateFlashcardsOutput = z.infer<typeof GenerateFlashcardsOutputSchema>;

export async function generateFlashcards(input: GenerateFlashcardsInput): Promise<GenerateFlashcardsOutput> {
  return generateFlashcardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFlashcardsPrompt',
  input: {schema: GenerateFlashcardsInputSchema},
  output: {schema: GenerateFlashcardsOutputSchema},
  prompt: `You are an expert educator. Generate a set of flashcards for the given topic.

Topic: {{{topic}}}

Each flashcard should have a question and a corresponding answer.
Return the flashcards as a JSON array.

Example:
{
  "flashcards": [
    {
      "question": "What is the capital of France?",
      "answer": "Paris"
    },
    {
      "question": "What is the highest mountain in the world?",
      "answer": "Mount Everest"
    }
  ]
}
`,
});

const generateFlashcardsFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFlow',
    inputSchema: GenerateFlashcardsInputSchema,
    outputSchema: GenerateFlashcardsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
