import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuizGenerator } from "./study/QuizGenerator";
import { FlashcardViewer } from "./study/FlashcardViewer";
import { MindMapViewer } from "./study/MindMapViewer";
import { SummaryViewer } from "./study/SummaryViewer";
import { StudyGuideViewer } from "./study/StudyGuideViewer";
import { AudioOverview } from "./study/AudioOverview";
import { BookOpen, Brain, Lightbulb, FileText, GraduationCap, Headphones } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface StudyToolsProps {
  bookId: string;
  bookTitle: string;
}

export const StudyTools = ({ bookId, bookTitle }: StudyToolsProps) => {
  const [activeTab, setActiveTab] = useState("");
  const [chapters, setChapters] = useState<string[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string>("all");
  const [shouldGenerate, setShouldGenerate] = useState(false);

  useEffect(() => {
    loadChapters();
  }, [bookId]);

  useEffect(() => {
    if (activeTab) {
      setSelectedChapter("all");
      setShouldGenerate(false);
    }
  }, [activeTab]);

  const loadChapters = async () => {
    console.log("Loading chapters for book:", bookId);
    const { data, error } = await supabase
      .from("book_chunks")
      .select("chapter_name")
      .eq("book_id", bookId)
      .not("chapter_name", "is", null)
      .order("chunk_index");

    console.log("Chapters data:", data);
    console.log("Chapters error:", error);

    if (data) {
      const uniqueChapters = Array.from(new Set(data.map(d => d.chapter_name).filter(Boolean))) as string[];
      console.log("Unique chapters:", uniqueChapters);
      setChapters(uniqueChapters);
    }
  };

  const handleGenerate = () => {
    setShouldGenerate(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Study Tools</h2>
        <p className="text-muted-foreground">
          AI-powered study materials for {bookTitle}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Summary</span>
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Quiz</span>
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Flashcards</span>
          </TabsTrigger>
          <TabsTrigger value="mindmap" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Mind Map</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Study Guide</span>
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Headphones className="h-4 w-4" />
            <span className="hidden sm:inline">Audio</span>
          </TabsTrigger>
        </TabsList>

        {!activeTab ? (
          <Card className="p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">Select a Study Tool</h3>
            <p className="text-muted-foreground">Choose a tool from the options above to get started</p>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="mb-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Chapter</label>
                <Select value={selectedChapter} onValueChange={(value) => { setSelectedChapter(value); setShouldGenerate(false); }}>
                  <SelectTrigger className="w-full max-w-md bg-background">
                    <SelectValue placeholder="Select a chapter" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="all">All Chapters (Full Book)</SelectItem>
                    {chapters.length > 0 ? (
                      chapters.map((chapter) => (
                        <SelectItem key={chapter} value={chapter}>
                          {chapter}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-chapters" disabled>
                        No individual chapters available for this book
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {chapters.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {chapters.length} chapter{chapters.length !== 1 ? 's' : ''} available
                  </p>
                )}
              </div>
              
              {!shouldGenerate && (
                <button
                  onClick={handleGenerate}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Generate Study Material
                </button>
              )}
            </div>

            {shouldGenerate && (
              <>
                <TabsContent value="summary">
                  <SummaryViewer bookId={bookId} chapterName={selectedChapter === "all" ? undefined : selectedChapter} />
                </TabsContent>

                <TabsContent value="quiz">
                  <QuizGenerator bookId={bookId} chapterName={selectedChapter === "all" ? undefined : selectedChapter} />
                </TabsContent>

                <TabsContent value="flashcards">
                  <FlashcardViewer bookId={bookId} chapterName={selectedChapter === "all" ? undefined : selectedChapter} />
                </TabsContent>

                <TabsContent value="mindmap">
                  <MindMapViewer bookId={bookId} chapterName={selectedChapter === "all" ? undefined : selectedChapter} />
                </TabsContent>

                <TabsContent value="guide">
                  <StudyGuideViewer bookId={bookId} chapterName={selectedChapter === "all" ? undefined : selectedChapter} />
                </TabsContent>

                <TabsContent value="audio">
                  <AudioOverview bookId={bookId} bookTitle={bookTitle} chapterName={selectedChapter === "all" ? undefined : selectedChapter} />
                </TabsContent>
              </>
            )}
          </Card>
        )}
      </Tabs>
    </div>
  );
};
