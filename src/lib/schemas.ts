import * as z from "zod";

export const flashcardTopicSchema = z.object({
  topic: z.string().min(3, {
    message: "Topic must be at least 3 characters long.",
  }).max(100, {
    message: "Topic must be at most 100 characters long.",
  }),
});
