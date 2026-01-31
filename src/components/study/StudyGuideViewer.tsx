import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface Section {
  title: string;
  keyTerms: string[];
  concepts: string[];
  questions: string[];
}

interface StudyGuideData {
  sections: Section[];
  practiceExercises: string[];
}

export const StudyGuideViewer = ({ bookId, chapterName }: { bookId: string; chapterName?: string }) => {
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState<StudyGuideData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadStudyGuide();
  }, [bookId, chapterName]);

  const loadStudyGuide = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-study-material", {
        body: { bookId, materialType: "study_guide", chapterName },
      });

      if (error) throw error;

      if (data?.material?.content) {
        setGuide(data.material.content);
      }
    } catch (error) {
      console.error("Error loading study guide:", error);
      toast({
        title: "Error",
        description: "Failed to load study guide. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin mb-4" />
        <p className="text-muted-foreground">Generating study guide...</p>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No study guide available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold mb-4">Study Sections</h3>
        <Accordion type="single" collapsible className="w-full">
          {guide.sections.map((section, index) => (
            <AccordionItem key={index} value={`section-${index}`}>
              <AccordionTrigger className="text-left">
                <span className="font-semibold">{section.title}</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div>
                    <h4 className="font-medium mb-2">Key Terms</h4>
                    <div className="flex flex-wrap gap-2">
                      {section.keyTerms.map((term, i) => (
                        <Badge key={i} variant="secondary">
                          {term}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Core Concepts</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {section.concepts.map((concept, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {concept}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Study Questions</h4>
                    <ul className="list-decimal list-inside space-y-1">
                      {section.questions.map((question, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Practice Exercises</h3>
        <div className="space-y-3">
          {guide.practiceExercises.map((exercise, index) => (
            <div key={index} className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Exercise {index + 1}:</span> {exercise}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
