import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-flashcard-topic.ts';
import '@/ai/flows/generate-flashcards.ts';
import '@/ai/flows/suggest-flashcard-topics.ts';
