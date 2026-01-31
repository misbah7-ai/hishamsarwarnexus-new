import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ResearchTool = () => {
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState("summary");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a research query",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    console.log("Starting research with query:", query);

    try {
      console.log("Invoking n8n-research function with query:", query.trim(), "format:", format);
      
      const { data, error } = await supabase.functions.invoke("n8n-research", {
        body: { query: query.trim(), format },
      });

      console.log("Function response - data:", data, "error:", error);

      if (error) {
        console.error("Research error details:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to complete research. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data?.error) {
        console.error("Research returned error:", data.error);
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      console.log("Research results:", data);
      setResults(data);
      
      toast({
        title: "Research Complete",
        description: "Your research results are ready",
      });
    } catch (error) {
      console.error("Error during research:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-subtle">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            AI Research Assistant
          </h2>
          <p className="text-xl text-muted-foreground">
            Get instant research insights powered by advanced AI
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-card/50 border-primary/20">
          <CardHeader>
            <CardTitle>Start Your Research</CardTitle>
            <CardDescription>
              Enter your research topic or question below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResearch} className="space-y-4">
              <div className="space-y-3">
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary</SelectItem>
                    <SelectItem value="explanation">Explanation</SelectItem>
                    <SelectItem value="roadmap">Roadmap</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="What would you like to research?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={loading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={loading} size="lg">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Researching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Research
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {results && (
              <div className="mt-6 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-primary/20">
                <h3 className="text-xl font-semibold mb-4 text-primary">Research Results</h3>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {typeof results === 'string' ? (
                    <p className="whitespace-pre-wrap">{results}</p>
                  ) : (
                    <pre className="text-sm whitespace-pre-wrap bg-background/50 p-4 rounded">
                      {JSON.stringify(results, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
