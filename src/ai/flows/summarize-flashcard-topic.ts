'use server';

/**
 * @fileOverview Summarizes a topic for flashcard generation.
 *
 * - summarizeFlashcardTopic - A function that summarizes a topic.
 * - SummarizeFlashcardTopicInput - The input type for the summarizeFlashcardTopic function.
 * - SummarizeFlashcardTopicOutput - The return type for the summarizeFlashcardTopic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeFlashcardTopicInputSchema = z.object({
  topic: z.string().describe('The topic to summarize.'),
});
export type SummarizeFlashcardTopicInput = z.infer<
  typeof SummarizeFlashcardTopicInputSchema
>;

const SummarizeFlashcardTopicOutputSchema = z.object({
  summary: z.string().describe('A summary of the topic.'),
});
export type SummarizeFlashcardTopicOutput = z.infer<
  typeof SummarizeFlashcardTopicOutputSchema
>;

export async function summarizeFlashcardTopic(
  input: SummarizeFlashcardTopicInput
): Promise<SummarizeFlashcardTopicOutput> {
  return summarizeFlashcardTopicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeFlashcardTopicPrompt',
  input: {schema: SummarizeFlashcardTopicInputSchema},
  output: {schema: SummarizeFlashcardTopicOutputSchema},
  prompt: `Summarize the following topic in a concise manner:\n\n{{topic}}`,
});

const summarizeFlashcardTopicFlow = ai.defineFlow(
  {
    name: 'summarizeFlashcardTopicFlow',
    inputSchema: SummarizeFlashcardTopicInputSchema,
    outputSchema: SummarizeFlashcardTopicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
