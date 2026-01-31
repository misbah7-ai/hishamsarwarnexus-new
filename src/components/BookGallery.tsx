import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BookSearch } from "./BookSearch";
import { ReadingProgress } from "./ReadingProgress";
import { BookHighlights } from "./BookHighlights";
import { StudyTools } from "./StudyTools";
import bookCoverCommunication from "@/assets/book-cover-communication-real.jpg";
import bookCoverBusiness from "@/assets/book-cover-business-real.jpg";
import bookCoverAI from "@/assets/book-cover-ai.jpg";
import bookCoverUrduReal from "@/assets/book-cover-urdu-real.jpg";

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
}

const bookCovers: Record<string, string> = {
  "Mastering Communication for Freelancers & Entrepreneurs": bookCoverCommunication,
  "Business Development Foundation": bookCoverBusiness,
  "Mastering Online Sales & Marketing Using AI": bookCoverAI,
  "سیکھنا سیکھو (Seekhna Seekho)": bookCoverUrduReal,
};

const chapters: Record<string, string[]> = {
  "Mastering Communication for Freelancers & Entrepreneurs": [
    "Why Communication is More Important Than Talent",
    "Understanding the Basics of Communication",
    "Building Confidence in Speaking English",
    "Body Language and Posture",
    "Writing Winning Proposals",
    "Handling Difficult Clients",
    "Building Long Term Client Relationships",
  ],
  "Business Development Foundation": [
    "Curiosity – The Driving Force Behind Digital Discovery",
    "Discipline – The Power of Consistency",
    "Skills – Mastering the Tools That Move Markets",
    "Networking – Turning Connections Into Capital",
    "Delegation – Scaling Through Trust and Systems",
  ],
  "Mastering Online Sales & Marketing Using AI": [
    "Who Is Hisham Sarwar",
    "Social Media Strategy",
    "Understanding Sales Versus Marketing",
    "Why AI Is a Game Changer for Social Media",
    "Understanding SEO and Its Importance",
    "Social Media Mastery",
    "Email Marketing Mastery",
  ],
};

export function BookGallery() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [showStudyTools, setShowStudyTools] = useState(false);
  const [studyBookId, setStudyBookId] = useState<string>("");
  const [studyBookTitle, setStudyBookTitle] = useState<string>("");

  useEffect(() => {
    fetchBooks();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) setUserId(data.user.id);
  };

  const fetchBooks = async () => {
    const { data } = await supabase
      .from("books")
      .select("*")
      .eq("processed", true)
      .order("title");
    
    if (data) {
      setBooks(data);
      setFilteredBooks(data);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredBooks(books);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(lowercaseQuery) ||
        book.author.toLowerCase().includes(lowercaseQuery) ||
        book.description?.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredBooks(filtered);
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    
    // Get recommendations (other books)
    const recs = books.filter(b => b.id !== book.id);
    setRecommendations(recs);
    
    // Scroll to selected book details
    setTimeout(() => {
      const detailsSection = document.getElementById('selected-book-details');
      detailsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const scrollToChat = () => {
    const chatSection = document.querySelector('[data-book-rag]');
    chatSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenStudyTools = (book: Book) => {
    setStudyBookId(book.id);
    setStudyBookTitle(book.title);
    setShowStudyTools(true);
    
    // Scroll to study tools after a short delay to allow render
    setTimeout(() => {
      const studyToolsSection = document.getElementById('study-tools-section');
      studyToolsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };


  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="outline">
            <BookOpen className="h-3 w-3 mr-1" />
            Book Library
          </Badge>
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">Hisham's Reading Corner</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Dive deep into practical strategies for communication, business development, and AI-powered marketing
          </p>
          <BookSearch onSearch={handleSearch} />
        </div>

        {/* Book Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {filteredBooks.map((book) => (
            <Card 
              key={book.id} 
              className="group hover:shadow-xl transition-all duration-300 border-2"
            >
              <CardHeader className="pb-4">
                <div className="aspect-[3/4] mb-4 overflow-hidden rounded-lg">
                  <img
                    src={bookCovers[book.title] || "/placeholder.svg"}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {book.title}
                </CardTitle>
                <CardDescription>{book.author}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{book.description}</p>
                {userId && <ReadingProgress bookId={book.id} userId={userId} />}
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                    onClick={() => handleSelectBook(book)}
                  >
                    Explore Book
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    variant="secondary"
                    className="w-full"
                    onClick={() => handleOpenStudyTools(book)}
                  >
                    Study Tools
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Book Details */}
        {selectedBook && (
          <div id="selected-book-details" className="bg-card border-2 rounded-xl p-8 mb-8">
            <div className="flex items-start gap-6 mb-6">
              <img
                src={bookCovers[selectedBook.title] || "/placeholder.svg"}
                alt={selectedBook.title}
                className="w-32 h-44 object-cover rounded-lg shadow-lg"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{selectedBook.title}</h3>
                <p className="text-muted-foreground mb-4">{selectedBook.author}</p>
                <p className="mb-4">{selectedBook.description}</p>
              </div>
            </div>

            {/* Chapter Navigation */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold mb-4">Chapters</h4>
              <div className="grid md:grid-cols-2 gap-3 mb-6">
                {chapters[selectedBook.title]?.map((chapter, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {idx + 1}
                    </div>
                    <span className="text-sm">{chapter}</span>
                  </div>
                ))}
              </div>
              
              {/* Highlights Section */}
              {userId && (
                <div className="mt-6">
                  <BookHighlights bookId={selectedBook.id} userId={userId} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Study Tools Section */}
        {showStudyTools && (
          <div id="study-tools-section" className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Study Tools</h3>
                  <p className="text-muted-foreground">{studyBookTitle}</p>
                </div>
              </div>
              <Button 
                onClick={() => setShowStudyTools(false)} 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto"
              >
                ← Back to Books
              </Button>
            </div>
            
            <Card className="border-2 shadow-xl">
              <CardContent className="p-6">
                <StudyTools bookId={studyBookId} bookTitle={studyBookTitle} />
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </section>
  );
}
