"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { Flashcard } from "@/types/flashcard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FlashcardDisplayProps {
  flashcards: Flashcard[];
}

export function FlashcardDisplay({ flashcards }: FlashcardDisplayProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const currentFlashcard = flashcards[currentIndex];

  if (!currentFlashcard) {
    return <p>No flashcard to display.</p>;
  }

  return (
    <div className="w-full max-w-xl flex flex-col items-center space-y-6">
      <div className="perspective-container w-full h-72 sm:h-80 md:h-96" onClick={handleFlip} role="button" tabIndex={0} aria-pressed={isFlipped} onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? handleFlip() : null}>
        <div className={cn("flashcard-inner", { "is-flipped": isFlipped })}>
          <div className="flashcard-face flashcard-front">
            <Card className="w-full h-full flex flex-col shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl sm:text-2xl text-primary">Question</CardTitle>
                <CardDescription className="text-sm">Click card to reveal answer</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-center justify-center p-4 sm:p-6">
                <p className="text-lg sm:text-xl md:text-2xl text-center text-card-foreground">{currentFlashcard.question}</p>
              </CardContent>
            </Card>
          </div>
          <div className="flashcard-face flashcard-back">
            <Card className="w-full h-full flex flex-col shadow-xl bg-accent text-accent-foreground">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl sm:text-2xl">Answer</CardTitle>
                 <CardDescription className="text-sm text-accent-foreground/80">Click card to show question</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-center justify-center p-4 sm:p-6">
                <p className="text-lg sm:text-xl md:text-2xl text-center">{currentFlashcard.answer}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-full">
        <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0} aria-label="Previous flashcard">
          <ChevronLeft className="h-5 w-5" />
          Previous
        </Button>
        <p className="text-muted-foreground font-medium">
          {currentIndex + 1} / {flashcards.length}
        </p>
        <Button variant="outline" onClick={handleNext} disabled={currentIndex === flashcards.length - 1} aria-label="Next flashcard">
          Next
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      <Button variant="ghost" onClick={handleFlip} className="mt-2 sm:hidden" aria-label="Flip card">
          <RotateCcw className="mr-2 h-4 w-4" /> Flip Card
      </Button>
    </div>
  );
}
