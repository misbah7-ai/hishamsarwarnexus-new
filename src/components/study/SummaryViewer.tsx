import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SummaryData {
  overview: string;
  keyPoints: string[];
  mainThemes: { theme: string; description: string }[];
  conclusion: string;
}

export const SummaryViewer = ({ bookId, chapterName }: { bookId: string; chapterName?: string }) => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSummary();
  }, [bookId, chapterName]);

  const loadSummary = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-study-material", {
        body: { bookId, materialType: "summary", chapterName },
      });

      if (error) throw error;

      if (data?.material?.content) {
        setSummary(data.material.content);
      }
    } catch (error) {
      console.error("Error loading summary:", error);
      toast({
        title: "Error",
        description: "Failed to load summary. Please try again.",
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
        <p className="text-muted-foreground">Generating summary...</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No summary available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold mb-4">Overview</h3>
        <p className="text-muted-foreground leading-relaxed">{summary.overview}</p>
      </div>

      <Separator />

      <div>
        <h3 className="text-xl font-bold mb-4">Key Points</h3>
        <div className="space-y-3">
          {summary.keyPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">{point}</p>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-xl font-bold mb-4">Main Themes</h3>
        <div className="space-y-4">
          {summary.mainThemes.map((theme, index) => (
            <div key={index} className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">{theme.theme}</h4>
              <p className="text-sm text-muted-foreground">{theme.description}</p>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-xl font-bold mb-4">Conclusion</h3>
        <p className="text-muted-foreground leading-relaxed">{summary.conclusion}</p>
      </div>
    </div>
  );
};
