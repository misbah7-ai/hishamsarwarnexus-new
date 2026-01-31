import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Sparkles, Copy, ExternalLink, MessageSquare, Volume2, VolumeX, BookOpen, PlayCircle, Lightbulb, Target, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ConversationsList from "./ConversationsList";

const MentorMind = () => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string; videoLink?: string }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [playingMessageIndex, setPlayingMessageIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
  };

  const topicCategories = {
    freelancing: [
      { q: "How do I start freelancing?", video: "https://www.youtube.com/watch?v=0lFLu1uapx4" },
      { q: "How to choose my freelancing skill?", video: "https://www.youtube.com/watch?v=YF72Rri8k_0" },
      { q: "How to win my first freelance project?", video: "https://www.youtube.com/watch?v=lqEJAjiLO_8" },
      { q: "How to write winning proposals?", video: "https://www.youtube.com/watch?v=oQGNegadjcQ" },
      { q: "How to retain clients?", video: "https://www.youtube.com/watch?v=6PcaHcjl7dQ" },
    ],
    mindset: [
      { q: "How to stay motivated?", video: "https://www.youtube.com/@HishamSarwar/videos" },
      { q: "How to overcome fear?", video: "https://www.youtube.com/@HishamSarwar/videos" },
      { q: "Building mental strength", video: "https://www.youtube.com/@HishamSarwar/videos" },
    ],
    branding: [
      { q: "How to build personal brand?", video: "https://www.youtube.com/@HishamSarwar/videos" },
      { q: "Using LinkedIn for marketing", video: "https://www.youtube.com/watch?v=f9323TOT7rY" },
      { q: "Creating digital presence", video: "https://www.youtube.com/@HishamSarwar/videos" },
    ],
    marketing: [
      { q: "Digital Marketing with AI", video: "https://www.youtube.com/watch?v=PeHQTSvO67M" },
      { q: "Digital marketing strategies", video: "https://www.youtube.com/@HishamSarwar/videos" },
      { q: "SEO and social media tips", video: "https://www.youtube.com/@HishamSarwar/videos" },
    ],
  };

  const [selectedTopic, setSelectedTopic] = useState<string>("freelancing");
  const suggestedQuestions = topicCategories[selectedTopic as keyof typeof topicCategories];

  const quickSuggestions = [
    "How do I start freelancing?",
    "Tips for winning first client",
    "How to stay consistent?",
    "Personal branding advice"
  ];

  const playlists = [
    {
      title: "LCT - Life Changing",
      description: "Complete life-changing training covering freelancing, digital marketing, business growth, and personal development.",
      icon: GraduationCap,
      color: "gold",
      link: "https://www.youtube.com/playlist?list=PLHi_NUJDIGWK3J_3xoL8yXqWbingAizhG",
      topics: ["Freelancing", "Digital Marketing", "Business Growth", "Personal Development"],
    },
    {
      title: "Freelancing Mastery",
      description: "79 videos covering everything about freelancing - from getting started to landing clients and scaling your career.",
      icon: Target,
      color: "electric-blue",
      link: "https://lctonline.pk/freelancing/",
      topics: ["Getting Started", "Finding Work", "Client Management"],
    },
    {
      title: "SEO Mastery",
      description: "38 videos teaching Search Engine Optimization fundamentals and advanced strategies for ranking websites.",
      icon: Lightbulb,
      color: "gold",
      link: "https://lctonline.pk/seo/",
      topics: ["SEO Basics", "Keyword Research", "Link Building"],
    },
    {
      title: "YouTube Growth",
      description: "18 videos on growing your YouTube channel organically through proper SEO and content optimization.",
      icon: BookOpen,
      color: "electric-blue",
      link: "https://lctonline.pk/youtube/",
      topics: ["Video SEO", "Channel Setup", "Content Strategy"],
    },
  ];

  const featuredVideos = [
    {
      title: "How to start freelancing | Freelancing for beginners",
      url: "https://www.youtube.com/watch?v=0lFLu1uapx4",
      category: "Freelancing",
    },
    {
      title: "Digital Marketing Using AI",
      url: "https://www.youtube.com/watch?v=PeHQTSvO67M",
      category: "AI & Marketing",
    },
    {
      title: "How to win the First freelance project",
      url: "https://www.youtube.com/watch?v=lqEJAjiLO_8",
      category: "Freelancing",
    },
    {
      title: "Three Ways To Make Money Online For Pakistanis",
      url: "https://www.youtube.com/watch?v=sEEEJ8QNmec",
      category: "TEDx Talk",
    },
  ];

  // Removed auto-scroll to prevent page jumping

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Answer copied to clipboard",
    });
  };

  const playAudio = async (text: string, messageIndex: number) => {
    try {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      if (playingMessageIndex === messageIndex) {
        setPlayingMessageIndex(null);
        return;
      }

      setPlayingMessageIndex(messageIndex);

      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: { text },
      });

      if (error) throw error;

      if (data.audioContent) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
          { type: "audio/mpeg" }
        );
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        
        audio.onended = () => {
          setPlayingMessageIndex(null);
          URL.revokeObjectURL(audioUrl);
        };
        
        await audio.play();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      toast({
        title: "Error",
        description: "Failed to play audio",
        variant: "destructive",
      });
      setPlayingMessageIndex(null);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingMessageIndex(null);
  };

  const loadConversation = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("role, content, video_link")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const loadedMessages = data.map(msg => ({
        role: msg.role,
        content: msg.content,
        videoLink: msg.video_link || undefined,
      }));

      setMessages(loadedMessages);
      setCurrentConversationId(conversationId);
    } catch (error) {
      console.error("Error loading conversation:", error);
      toast({
        title: "Error",
        description: "Failed to load conversation",
        variant: "destructive",
      });
    }
  };

  const createNewConversation = async (firstMessage: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save conversations",
          variant: "destructive",
        });
        return null;
      }

      const title = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : "");
      
      const { data, error } = await supabase
        .from("conversations")
        .insert({ user_id: user.id, title })
        .select()
        .single();

      if (error) throw error;

      return data.id;
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive",
      });
      return null;
    }
  };

  const saveMessage = async (conversationId: string, role: string, content: string, videoLink?: string) => {
    try {
      const { error } = await supabase
        .from("chat_messages")
        .insert({
          conversation_id: conversationId,
          role,
          content,
          video_link: videoLink || null,
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Create conversation if this is the first message
    let conversationId = currentConversationId;
    if (!conversationId && isAuthenticated) {
      conversationId = await createNewConversation(userMessage);
      if (conversationId) {
        setCurrentConversationId(conversationId);
      }
    }

    // Add user message
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);

    // Save user message
    if (conversationId) {
      await saveMessage(conversationId, "user", userMessage);
    }

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mentor-chat`;
      
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "Rate Limit Exceeded",
            description: "Too many requests. Please wait a moment and try again.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        if (response.status === 402) {
          toast({
            title: "AI Credits Exhausted",
            description: "Please add credits to continue using HishamSarwarNexus.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let textBuffer = "";
      let streamDone = false;
      let videoLink = "";

      // Check if question matches any video topic
      const allTopics = Object.values(topicCategories).flat();
      const matchedTopic = allTopics.find(t => 
        userMessage.toLowerCase().includes(t.q.toLowerCase().split(' ').slice(0, 3).join(' '))
      );
      if (matchedTopic) {
        videoLink = matchedTopic.video;
      }

      // Add empty assistant message that we'll update
      setMessages((prev) => [...prev, { role: "assistant", content: "", videoLink }]);

      let finalAssistantMessage = "";

      while (!streamDone && reader) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantMessage += content;
              finalAssistantMessage = assistantMessage;
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  ...newMessages[newMessages.length - 1],
                  content: assistantMessage,
                };
                return newMessages;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Save assistant message
      if (conversationId && finalAssistantMessage) {
        await saveMessage(conversationId, "assistant", finalAssistantMessage, videoLink);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
      // Remove the user message if there was an error
      setMessages((prev) => prev.slice(0, -1));
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <section id="chat" className="py-24 bg-gradient-to-b from-background to-navy-light relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-electric-blue rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <Badge className="mb-4 bg-electric-blue/20 text-electric-blue border-electric-blue font-bold text-base">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Guidance
          </Badge>
          <h2 className="font-heading text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            HishamSarwar<span className="text-electric-blue">Nexus</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Get instant, concise guidance on freelancing, mindset, personal branding, and digital marketing — 
            powered by AI trained on Hisham Sarwar's wisdom.
          </p>
        </div>

        <div className="max-w-6xl mx-auto flex gap-6">
          {isAuthenticated && (
            <ConversationsList
              selectedConversationId={currentConversationId}
              onSelectConversation={loadConversation}
              onNewConversation={handleNewChat}
            />
          )}

          <div className="flex-1">
          <Card className="bg-gradient-card border-gold/20 p-6 shadow-elegant">
            {/* Messages Display */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[400px] max-h-[500px]">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-electric-blue opacity-50" />
                  <p className="text-muted-foreground mb-6">
                    Start a conversation with HishamSarwarNexus AI
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
                    {quickSuggestions.map((question, idx) => (
                      <Button
                        key={idx}
                        size="sm"
                        variant="outline"
                        onClick={() => setInput(question)}
                        className="border-electric-blue/30 hover:bg-electric-blue/10"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        msg.role === "user"
                          ? "bg-electric-blue text-white"
                          : "bg-muted"
                      }`}
                    >
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content.split(/(\[.*?\]\(https?:\/\/[^\s)]+\))/g).map((part, i) => {
                          const linkMatch = part.match(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/);
                          if (linkMatch) {
                            return (
                              <Button
                                key={i}
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(linkMatch[2], '_blank', 'noopener,noreferrer')}
                                className="text-xs border-electric-blue/50 hover:bg-electric-blue/20 text-electric-blue my-1 mr-2 h-8"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                {linkMatch[1]}
                              </Button>
                            );
                          }
                          return <span key={i}>{part}</span>;
                        })}
                      </div>
                      {msg.role === "assistant" && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-gold/10">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => playingMessageIndex === idx ? stopAudio() : playAudio(msg.content, idx)}
                            className="text-xs hover:text-electric-blue h-7"
                          >
                            {playingMessageIndex === idx ? (
                              <>
                                <VolumeX className="w-3 h-3 mr-1" />
                                Stop
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3 mr-1" />
                                Listen
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(msg.content)}
                            className="text-xs hover:text-electric-blue h-7"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-electric-blue rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-electric-blue rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-electric-blue rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions (above input) */}
            {messages.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-2">Suggested topics:</p>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.slice(0, 2).map((question, idx) => (
                    <Button
                      key={idx}
                      size="sm"
                      variant="outline"
                      onClick={() => setInput(question)}
                      className="text-xs border-electric-blue/30 hover:bg-electric-blue/10 h-7"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area - Fixed at bottom */}
            <div className="border-t border-gold/20 pt-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Ask about freelancing, LCT lessons, or quick tips — 1–2 sentence question"
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-electric-blue hover:bg-electric-blue/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Responses include sources from Hisham's videos and posts
              </p>
            </div>
          </Card>


          {/* Topic Selection */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-3">Browse by topic:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {Object.keys(topicCategories).map((topic) => (
                <Button
                  key={topic}
                  size="sm"
                  variant={selectedTopic === topic ? "default" : "outline"}
                  onClick={() => setSelectedTopic(topic)}
                  className={selectedTopic === topic ? "bg-gold text-navy-dark" : "border-gold/30"}
                >
                  {topic.charAt(0).toUpperCase() + topic.slice(1)}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {suggestedQuestions.map((item, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  variant="ghost"
                  onClick={() => handleSuggestedQuestion(item.q)}
                  className="text-xs text-electric-blue hover:bg-electric-blue/10"
                >
                  {item.q}
                </Button>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MentorMind;
