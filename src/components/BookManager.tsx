import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Upload, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  processed: boolean;
}

export const BookManager = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching books:", error);
      return;
    }

    setBooks(data || []);
  };

  const handleUpload = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide title and content",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create book record
      const { data: book, error: bookError } = await supabase
        .from("books")
        .insert({
          title,
          author: "Hisham Sarwar",
          description,
          file_path: `text-upload-${Date.now()}`,
          processed: false,
        })
        .select()
        .single();

      if (bookError) throw bookError;

      // Process the book content
      const { error: processError } = await supabase.functions.invoke("process-book", {
        body: { bookId: book.id, text: content },
      });

      if (processError) throw processError;

      toast({
        title: "Success",
        description: "Book uploaded and processing started",
      });

      setTitle("");
      setDescription("");
      setContent("");
      fetchBooks();
    } catch (error) {
      console.error("Error uploading book:", error);
      toast({
        title: "Error",
        description: "Failed to upload book",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (bookId: string) => {
    try {
      const { error } = await supabase.from("books").delete().eq("id", bookId);
      if (error) throw error;
      
      toast({ title: "Book deleted successfully" });
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="book-manager" className="min-h-screen py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-12 h-12 text-primary" />
            <h2 className="text-4xl md:text-5xl font-bold">Manage Books</h2>
          </div>
          <p className="text-xl text-muted-foreground">
            Upload and manage Hisham Sarwar's book library
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Form */}
          <Card className="p-6">
            <h3 className="text-2xl font-bold mb-4">Upload New Book</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Book Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter book title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the book"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="content">Book Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste the full text content here"
                  rows={10}
                />
              </div>
              <Button onClick={handleUpload} disabled={isUploading} className="w-full">
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Book
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Book List */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Existing Books</h3>
            {books.length === 0 ? (
              <Card className="p-6 text-center text-muted-foreground">
                No books uploaded yet
              </Card>
            ) : (
              books.map((book) => (
                <Card key={book.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{book.title}</h4>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                      {book.description && (
                        <p className="text-sm mt-2">{book.description}</p>
                      )}
                      <div className="mt-2">
                        {book.processed ? (
                          <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">
                            ✓ Processed
                          </span>
                        ) : (
                          <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">
                            ⏳ Processing...
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(book.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
