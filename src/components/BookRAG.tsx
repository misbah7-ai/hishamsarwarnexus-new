import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Send, Loader2, Book, Trash2, Plus, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

const MAX_MESSAGES = 10;

// Format n8n response according to specific rules
const formatN8nResponse = (rawResponse: string): string => {
  // Return the response as-is, expecting n8n to include source info
  return rawResponse;
};

export const BookRAG = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Ask me anything about Hisham Sarwar's books. I'll search the content and provide answers based only on what's in his books!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>("all");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showConversations, setShowConversations] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBooks();
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchConversations();
    }
  }, [userId]);

  // Removed auto-scroll to prevent page jumping

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
    }
  };

  const fetchConversations = async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      return;
    }

    setConversations(data || []);
  };

  const loadConversation = async (conversationId: string) => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(MAX_MESSAGES);

    if (error) {
      console.error("Error loading conversation:", error);
      toast({
        title: "Error",
        description: "Failed to load conversation",
        variant: "destructive",
      });
      return;
    }

    const loadedMessages: Message[] = data.map(msg => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    setMessages(loadedMessages);
    setCurrentConversation(conversationId);
    setShowConversations(false);
  };

  const createNewConversation = async () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create conversations",
        variant: "destructive",
      });
      return;
    }

    // Clear current conversation first
    setCurrentConversation(null);
    setMessages([
      {
        role: "assistant",
        content: "Ask me anything about Hisham Sarwar's books. I'll search the content and provide answers based only on what's in his books!",
      },
    ]);

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: userId,
        title: `Chat ${new Date().toLocaleString()}`,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive",
      });
      return;
    }

    setCurrentConversation(data.id);
    await fetchConversations();
    toast({
      title: "New Conversation",
      description: "Started a new conversation",
    });
  };

  const confirmDeleteConversation = (conversationId: string) => {
    setConversationToDelete(conversationId);
    setDeleteDialogOpen(true);
  };

  const deleteConversation = async () => {
    if (!conversationToDelete) return;

    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", conversationToDelete);

    if (error) {
      console.error("Error deleting conversation:", error);
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      });
      return;
    }

    if (currentConversation === conversationToDelete) {
      setCurrentConversation(null);
      setMessages([
        {
          role: "assistant",
          content: "Ask me anything about Hisham Sarwar's books. I'll search the content and provide answers based only on what's in his books!",
        },
      ]);
    }

    fetchConversations();
    setDeleteDialogOpen(false);
    setConversationToDelete(null);
    toast({
      title: "Deleted",
      description: "Conversation deleted successfully",
    });
  };

  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from("books")
      .select("id, title, author")
      .eq("processed", true)
      .order("title");

    if (error) {
      console.error("Error fetching books:", error);
      toast({
        title: "Error",
        description: "Failed to load books",
        variant: "destructive",
      });
      return;
    }

    setBooks(data || []);
  };

  // Removed scrollToBottom function to prevent page jumping

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Create conversation if it doesn't exist yet
    let conversationId = currentConversation;
    if (!conversationId && userId) {
      const { data, error } = await supabase
        .from("conversations")
        .insert({
          user_id: userId,
          title: userMessage.substring(0, 50) + (userMessage.length > 50 ? "..." : ""),
        })
        .select()
        .single();

      if (!error && data) {
        conversationId = data.id;
        setCurrentConversation(data.id);
        await fetchConversations();
      }
    }

    // Save user message to database if conversation exists
    if (conversationId) {
      await supabase.from("chat_messages").insert({
        conversation_id: conversationId,
        role: "user",
        content: userMessage,
      });
    }

    try {
      const { data, error } = await supabase.functions.invoke('n8n-research', {
        body: { 
          query: userMessage,
          format: "summary"
        }
      });

      if (error) {
        console.error("Research error:", error);
        throw error;
      }

      let assistantContent = data?.output || "I couldn't process your query. Please try again.";
      
      // Format the response according to user requirements
      // Parse the n8n response and structure it properly
      const formattedContent = formatN8nResponse(assistantContent);

      const assistantMessage = {
        role: "assistant" as const,
        content: formattedContent
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Save assistant message to database if conversation exists
      if (conversationId) {
        await supabase.from("chat_messages").insert({
          conversation_id: conversationId,
          role: "assistant",
          content: assistantMessage.content,
        });
      }
    } catch (error) {
      console.error("Research API Error:", error);
      toast({
        title: "Error",
        description: "Failed to get research results. Please try again.",
        variant: "destructive",
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section id="book-rag" className="min-h-screen py-20 px-4 bg-background">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-12 h-12 text-primary" />
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight">Explore His Books</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ask questions and get answers directly from Hisham Sarwar's books
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-4 mb-4">
          <Card className={`lg:col-span-1 bg-card/50 backdrop-blur border-border/50 ${showConversations ? 'block' : 'hidden lg:block'}`}>
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Conversations
              </h3>
              <Button size="sm" onClick={createNewConversation} disabled={!userId}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <ScrollArea className="h-[500px]">
              <div className="p-2 space-y-2">
                {!userId ? (
                  <p className="text-sm text-muted-foreground p-2">Sign in to save conversations</p>
                ) : conversations.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-2">No conversations yet</p>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                        currentConversation === conv.id
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0" onClick={() => loadConversation(conv.id)}>
                          <p className="text-sm font-medium truncate">{conv.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(conv.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteConversation(conv.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>

          <Card className={`lg:col-span-3 bg-card/50 backdrop-blur border-border/50 shadow-lg ${showConversations ? 'hidden lg:block' : 'block'}`}>
            {/* Header with controls */}
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setShowConversations(!showConversations)}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Book className="w-5 h-5 text-muted-foreground" />
                  <Select value={selectedBook} onValueChange={setSelectedBook}>
                    <SelectTrigger className="w-full max-w-xs">
                      <SelectValue placeholder="Select a book" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Books</SelectItem>
                      {books.map((book) => (
                        <SelectItem key={book.id} value={book.id}>
                          {book.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={createNewConversation}
                  disabled={!userId}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Chat
                </Button>
              </div>
            </div>

          {/* Messages */}
          <div className="h-[600px] overflow-y-auto p-6 space-y-6">
            {messages.map((message, index) => (
              <div key={index} className="space-y-4">
                {message.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-lg p-4 bg-primary text-primary-foreground">
                      <p>{message.content}</p>
                    </div>
                  </div>
                 ) : (
                  <div className="bg-muted rounded-lg p-4">
                    <div 
                      className="whitespace-pre-wrap leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: message.content
                          .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
                      }}
                    />
                  </div>
                 )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about Hisham's content..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          </Card>
        </div>

        {books.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              No books available yet. Upload and process books to enable the RAG agent.
            </p>
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the conversation and all its messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteConversation}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};
