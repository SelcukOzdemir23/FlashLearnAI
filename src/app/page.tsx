"use client";

import * as React from "react";
import { BrainCircuit, Loader2, AlertTriangle, Smile } from "lucide-react";
import type * as z from "zod";
import { generateFlashcards, type GenerateFlashcardsOutput } from "@/ai/flows/generate-flashcards";
import type { Flashcard } from "@/types/flashcard";
import { TopicInputForm } from "@/components/topic-input-form";
import { FlashcardDisplay } from "@/components/flashcard-display";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import type { flashcardTopicSchema } from "@/lib/schemas"; // Assuming schema is defined here

export default function HomePage() {
  const [flashcards, setFlashcards] = React.useState<Flashcard[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleTopicSubmit = async (values: z.infer<typeof flashcardTopicSchema>) => {
    setIsLoading(true);
    setError(null);
    setFlashcards(null);

    try {
      const result: GenerateFlashcardsOutput = await generateFlashcards({ topic: values.topic });
      if (result.flashcards && result.flashcards.length > 0) {
        setFlashcards(result.flashcards);
        toast({
          title: "Success!",
          description: `Generated ${result.flashcards.length} flashcards for "${values.topic}".`,
        });
      } else {
        setError(`No flashcards could be generated for "${values.topic}". Try a different topic or rephrase.`);
        toast({
          title: "No Flashcards",
          description: `Could not generate flashcards for "${values.topic}".`,
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error("Error generating flashcards:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to generate flashcards: ${errorMessage}`);
      toast({
        title: "Generation Failed",
        description: "An error occurred while generating flashcards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-background text-foreground">
      <header className="mb-8 sm:mb-12 text-center">
        <div className="flex items-center justify-center space-x-3">
          <BrainCircuit className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            FlashLearn<span className="text-primary">AI</span>
          </h1>
        </div>
        <p className="mt-2 text-lg text-muted-foreground">
          Unlock knowledge with AI-powered flashcards.
        </p>
      </header>

      <div className="w-full max-w-md mb-8 sm:mb-12">
        <TopicInputForm onSubmit={handleTopicSubmit} isLoading={isLoading} />
      </div>

      {isLoading && (
        <div className="flex flex-col items-center space-y-3 text-primary mt-8">
          <Loader2 className="h-12 w-12 animate-spin" />
          <p className="text-lg font-medium">Generating your flashcards...</p>
          <p className="text-sm text-muted-foreground">This might take a moment.</p>
        </div>
      )}

      {error && !isLoading && (
        <Alert variant="destructive" className="w-full max-w-xl mt-8">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && flashcards && flashcards.length > 0 && (
        <FlashcardDisplay flashcards={flashcards} />
      )}
      
      {!isLoading && !error && flashcards === null && (
         <div className="mt-12 text-center p-8 border-2 border-dashed border-border rounded-lg max-w-lg">
            <Smile className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Ready to Learn?</h2>
            <p className="text-muted-foreground">
              Enter a topic above to generate your personalized flashcards. Explore subjects like history, science, languages, and more!
            </p>
          </div>
      )}
      
      {!isLoading && !error && flashcards && flashcards.length === 0 && (
        <div className="mt-12 text-center p-8 border-2 border-dashed border-border rounded-lg max-w-lg">
          <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Flashcards Found</h2>
          <p className="text-muted-foreground">
            We couldn't generate any flashcards for the topic you entered. Please try a different or more specific topic.
          </p>
        </div>
      )}

      <footer className="mt-16 py-6 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} FlashLearnAI. Powered by AI.</p>
      </footer>
    </main>
  );
}
