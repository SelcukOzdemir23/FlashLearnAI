// src/components/topic-input-form.tsx
"use client";

import * as React from "react";
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
import { suggestFlashcardTopics } from "@/ai/flows/suggest-flashcard-topics";

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

  const { watch, setValue } = form;
  const currentTopicValue = watch("topic");
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = React.useState(false);
  const [suggestionError, setSuggestionError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handler = setTimeout(async () => {
      if (currentTopicValue && currentTopicValue.trim().length >= 3) {
        setIsLoadingSuggestions(true);
        setSuggestionError(null);
        try {
          const result = await suggestFlashcardTopics({ currentTopic: currentTopicValue });
          setSuggestions(result.suggestions || []);
        } catch (err) {
          console.error("Error fetching suggestions:", err);
          setSuggestionError("Could not load suggestions at this time.");
          setSuggestions([]);
        } finally {
          setIsLoadingSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setSuggestionError(null); // Clear error if input becomes too short
      }
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [currentTopicValue]);

  const handleSuggestionClick = (suggestion: string) => {
    setValue("topic", suggestion, { shouldValidate: true });
    setSuggestions([]); // Clear suggestions after selection
    setSuggestionError(null);
    // Optionally, automatically submit the form:
    // form.handleSubmit(onSubmit)();
  };

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
                <Input 
                  placeholder="e.g., The Renaissance, Quantum Physics" 
                  {...field} 
                  className="text-base" 
                  onChange={(e) => {
                    field.onChange(e); // Ensure react-hook-form's onChange is called
                    // currentTopicValue will be updated by watch, triggering useEffect
                  }}
                />
              </FormControl>
              <FormDescription>
                Provide a topic or subject area to generate flashcards. Suggestions will appear below.
              </FormDescription>
              <FormMessage />

              {isLoadingSuggestions && (
                <div className="mt-2 text-sm text-muted-foreground flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading suggestions...
                </div>
              )}
              {suggestionError && !isLoadingSuggestions && (
                  <div className="mt-2 text-sm text-destructive">
                      {suggestionError}
                  </div>
              )}
              {!isLoadingSuggestions && !suggestionError && suggestions.length > 0 && (
                <div className="mt-3 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Suggestions:</p>
                  <ul className="rounded-md border border-input bg-background shadow-sm max-h-48 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="border-b border-input last:border-b-0">
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full justify-start h-auto py-2 px-3 text-sm font-normal text-left"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
