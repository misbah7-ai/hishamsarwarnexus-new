import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen } from "lucide-react";

interface ReadingProgressProps {
  bookId: string;
  userId: string;
}

export function ReadingProgress({ bookId, userId }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchProgress();
  }, [bookId, userId]);

  const fetchProgress = async () => {
    const { data } = await (supabase as any)
      .from("reading_progress")
      .select("progress_percentage")
      .eq("book_id", bookId)
      .eq("user_id", userId)
      .maybeSingle();

    if (data) {
      setProgress(data.progress_percentage || 0);
    }
  };

  if (progress === 0) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
      <BookOpen className="h-4 w-4 text-primary" />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">Reading Progress</span>
          <span className="text-xs text-muted-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
}
