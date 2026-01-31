import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, ChevronRight, RotateCcw, RefreshCw } from "lucide-react";

interface Flashcard {
  front: string;
  back: string;
}

interface FlashcardData {
  cards: Flashcard[];
}

export const FlashcardViewer = ({ bookId, chapterName }: { bookId: string; chapterName?: string }) => {
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<FlashcardData | null>(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadFlashcards();
  }, [bookId, chapterName]);

  const loadFlashcards = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-study-material", {
        body: { bookId, materialType: "flashcard", chapterName },
      });

      if (error) throw error;

      if (data?.material?.content) {
        setFlashcards(data.material.content);
      }
    } catch (error) {
      console.error("Error loading flashcards:", error);
      toast({
        title: "Error",
        description: "Failed to load flashcards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (currentCard < (flashcards?.cards.length || 0) - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    }
  };

  const previousCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
  };

  const resetDeck = () => {
    setCurrentCard(0);
    setIsFlipped(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin mb-4" />
        <p className="text-muted-foreground">Generating flashcards...</p>
      </div>
    );
  }

  if (!flashcards) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No flashcards available.</p>
      </div>
    );
  }

  const card = flashcards.cards[currentCard];

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">
          Card {currentCard + 1} of {flashcards.cards.length}
        </p>
      </div>

      <div
        className="relative h-80 cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden">
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20 p-8 flex flex-col items-center justify-center text-center">
              <p className="text-lg font-medium mb-4">{card.front}</p>
              <p className="text-sm text-muted-foreground">Click to flip</p>
            </div>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <div className="w-full h-full bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl border-2 border-secondary/20 p-8 flex flex-col items-center justify-center text-center">
              <p className="text-lg">{card.back}</p>
              <p className="text-sm text-muted-foreground mt-4">Click to flip back</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button onClick={previousCard} disabled={currentCard === 0} variant="outline" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button onClick={resetDeck} variant="ghost" size="icon">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          onClick={nextCard}
          disabled={currentCard === flashcards.cards.length - 1}
          variant="outline"
          size="icon"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};
