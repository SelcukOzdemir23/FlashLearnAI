"use client";

import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { flashcardTopicSchema } from "@/lib/schemas";

interface TopicInputFormProps {
  onSubmit: (values: z.infer<typeof flashcardTopicSchema>) => Promise<void>;
  isLoading: boolean;
}

export function TopicInputForm({ onSubmit, isLoading }: TopicInputFormProps) {
  const form = useForm<z.infer<typeof flashcardTopicSchema>>({
    resolver: zodResolver(flashcardTopicSchema),
    defaultValues: {
      topic: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Enter a Topic</FormLabel>
              <FormControl>
                <Input placeholder="e.g., The Renaissance, Quantum Physics, JavaScript Fundamentals" {...field} className="text-base" />
              </FormControl>
              <FormDescription>
                Provide a topic or subject area to generate flashcards.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full text-base py-6">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Flashcards...
            </>
          ) : (
            "Generate Flashcards"
          )}
        </Button>
      </form>
    </Form>
  );
}
