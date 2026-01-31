import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Highlighter, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Highlight {
  id: string;
  content: string;
  page_number?: number;
  chapter_name?: string;
  note?: string;
  created_at: string;
}

interface BookHighlightsProps {
  bookId: string;
  userId: string;
}

export function BookHighlights({ bookId, userId }: BookHighlightsProps) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHighlight, setNewHighlight] = useState({ content: "", note: "" });
  const { toast } = useToast();

  useEffect(() => {
    fetchHighlights();
  }, [bookId, userId]);

  const fetchHighlights = async () => {
    const { data } = await (supabase as any)
      .from("book_highlights")
      .select("*")
      .eq("book_id", bookId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data) setHighlights(data as Highlight[]);
  };

  const addHighlight = async () => {
    if (!newHighlight.content.trim()) {
      toast({ title: "Please add highlight content", variant: "destructive" });
      return;
    }

    const { error } = await (supabase as any).from("book_highlights").insert({
      book_id: bookId,
      user_id: userId,
      content: newHighlight.content,
      note: newHighlight.note || null,
    });

    if (error) {
      toast({ title: "Failed to add highlight", variant: "destructive" });
      return;
    }

    toast({ title: "Highlight added successfully" });
    setNewHighlight({ content: "", note: "" });
    setShowAddForm(false);
    fetchHighlights();
  };

  const deleteHighlight = async (id: string) => {
    const { error } = await (supabase as any)
      .from("book_highlights")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Failed to delete highlight", variant: "destructive" });
      return;
    }

    toast({ title: "Highlight deleted" });
    fetchHighlights();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Highlighter className="h-5 w-5" />
            Your Highlights
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Highlight
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <div className="mb-4 p-4 border rounded-lg space-y-3">
            <Textarea
              placeholder="Paste your highlight here..."
              value={newHighlight.content}
              onChange={(e) =>
                setNewHighlight({ ...newHighlight, content: e.target.value })
              }
              rows={3}
            />
            <Textarea
              placeholder="Add a note (optional)"
              value={newHighlight.note}
              onChange={(e) =>
                setNewHighlight({ ...newHighlight, note: e.target.value })
              }
              rows={2}
            />
            <div className="flex gap-2">
              <Button onClick={addHighlight} size="sm">
                Save Highlight
              </Button>
              <Button
                onClick={() => {
                  setShowAddForm(false);
                  setNewHighlight({ content: "", note: "" });
                }}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {highlights.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No highlights yet. Add your first highlight to remember key insights.
            </p>
          ) : (
            highlights.map((highlight) => (
              <div
                key={highlight.id}
                className="p-3 border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <p className="text-sm italic mb-2">"{highlight.content}"</p>
                {highlight.note && (
                  <p className="text-xs text-muted-foreground mb-2">
                    Note: {highlight.note}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {new Date(highlight.created_at).toLocaleDateString()}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteHighlight(highlight.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
