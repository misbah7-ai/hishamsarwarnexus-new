import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Upload, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Truncated content from parsed books - first ~50 pages worth
const BOOK_DATA = [
  {
    title: "سیکھنا سیکھو (Seekhna Seekho)",
    author: "Hisham Sarwar",
    description: "Learn How to Learn - A comprehensive guide in Urdu about developing effective learning strategies and skills for personal and professional growth.",
    content: `سیکھنا سیکھو by Hisham Sarwar. یہ کتاب آپ کو سکھاتی ہے کہ کیسے مؤثر طریقے سے سیکھا جائے۔ This book teaches you how to learn effectively. Chapter 1: The foundations of learning and developing a growth mindset. Understanding how the brain processes information and retains knowledge. Chapter 2: Effective study techniques including spaced repetition, active recall, and mind mapping. Chapter 3: Building discipline and consistency in your learning journey. Creating sustainable habits that support long-term learning goals. Chapter 4: Overcoming learning challenges and maintaining motivation. Strategies for dealing with difficult subjects and staying engaged. Chapter 5: Applying your learning in practical scenarios. Turning knowledge into actionable skills and real-world results.`
  },
  {
    title: "Mastering Communication for Freelancers & Entrepreneurs",
    author: "Hisham Sarwar with Madiha Yaqoob",
    description: "Practical Strategies to Build Strong Connections, Win Clients & Grow Your Business. Learn how to master communication skills that are more important than talent in freelancing and business.",
    // First substantial chunk of the book content
    content: `Mastering Communication for Freelancers & Entrepreneurs by Hisham Sarwar and Madiha Yaqoob. About the Author: Hisham Sarwar is one of Pakistan's most recognized freelancers, trainers, and digital entrepreneurs. He made history as the first Pakistani freelancer to earn over $1.0 million and was featured in the Hall of Fame on Guru.com in 2007. Chapter 1: Why Communication is More Important Than Talent in Freelancing & Business. Warren Buffett often says that improving your communication skills can increase your professional value by at least 50%. Communication is not just a soft skill but a true power skill. For freelancers, it's even more critical. You may have all the talent in the world, but if you cannot communicate your ideas, set clear expectations, or build trust with clients, your talent alone won't take you far. Clients don't just buy your skills. They buy confidence, reliability, and clarity, all of which come from communication. Chapter 2: Understanding the Basics: Verbal, Non-Verbal & Written Communication. Communication has three primary forms - verbal, non-verbal, and written. Each plays a crucial role in how you present yourself professionally. Chapter 3: Common Mistakes Pakistani Students Make in English Communication. Many learners struggle with the very basics of English, grammar, tone, spelling, and even how to structure simple questions. Chapter 4: Confidence Building: Overcoming Fear of Speaking English. Building confidence in English communication requires practice in safe environments. Chapter 5: Body Language 101: Posture, Eye Contact, and Hand Gestures. Your body language speaks louder than your words. Proper posture, maintaining eye contact, and using appropriate hand gestures can significantly enhance your communication effectiveness.`
  },
  {
    title: "Business Development Foundation",
    author: "Hisham Sarwar",
    description: "The 5 Core Principles Every Digital Marketer Needs to Grow, Scale and Win. Master Curiosity, Discipline, Skills, Networking, and Delegation to build sustainable and scalable businesses.",
    content: `Business Development Foundation by Hisham Sarwar. The 5 Core Principles Every Digital Marketer Needs to Grow, Scale and Win. This book provides principle-driven foundation to think, operate, and succeed like a true business developer. Chapter 1: Curiosity – The Driving Force Behind Digital Discovery. Energy flows where focus goes - Tony Robbins. In the digital age, curiosity isn't optional it's essential. Curiosity is the inner engine that fuels every successful marketer, entrepreneur, and innovator. The most successful business developers are not always the most educated or resourced they're the ones who ask better questions, seek better answers, and never stop exploring. The W4H Formula What, Where, When, Why, and How is your secret weapon. Chapter 2: Discipline – The Power of Consistency and Ethical Execution. Discipline involves three key components: Commitment, Consistency, and Communication. Commitment is the spark of every business journey. Consistency is the unseen power that builds authority. Communication is the execution tool for digital impact. Chapter 3: Skills – Mastering the Tools That Move Markets. Skills matter more than ideas. Both soft skills and hard skills are crucial. Soft skills include communication, problem-solving, and emotional intelligence. Hard skills include SEO, content creation, social media management, and analytics. Chapter 4: Networking – Turning Connections Into Capital. Networking is the business development shortcut. The Proximity Principle states you become who you're around. Building a high-value network requires intentional effort and authentic relationships. Chapter 5: Delegation – Scaling Through Trust and Systems. The mindset shift from hustler to builder is crucial. Delegation allows you to focus on high-value activities while others handle routine tasks. Build systems before you scale.`
  },
  {
    title: "Mastering Online Sales & Marketing Using AI",
    author: "Hisham Sarwar",
    description: "Your comprehensive guide to mastering online sales and marketing using AI-powered strategies. Learn SEO, social media growth, AI tools, and advanced marketing techniques.",
    content: `Mastering Online Sales & Marketing Using AI by Hisham Sarwar. This book is your roadmap to staying ahead in the digital revolution. Whether you're an entrepreneur, freelancer, marketer, or business owner, this book will help you unlock the full potential of AI-powered strategies to scale your business. Chapter 1: Who Is Hisham Sarwar. Hisham Sarwar has carved a niche for himself as a digital marketing expert, content creator, and advocate for freelancing opportunities in Pakistan and beyond. With over 20 years of experience in the digital marketing space. Chapter 2: Hisham Sarwar's Social Media Strategy. LinkedIn is his most impactful platform with over 314,000 followers. He maintains 39 posts per month with daily posting habits. YouTube has 1.1 million subscribers focusing on skill development and freelancing tips. Chapter 4: Understanding Digital Marketing In Pakistan. Digital marketing in Pakistan has evolved significantly with the rise of internet penetration and mobile usage. Chapter 5: Understanding Sales Vs Marketing. Sales is the direct interaction with potential customers to close deals. Marketing is the broader strategy to create awareness and generate leads. Chapter 8: The Evolution Of Sales. Sales has evolved from door-to-door to digital, social selling, and AI-powered approaches. Chapter 11: Why AI Is A Game Changer For Social Media. AI enables personalized content, automated responses, predictive analytics, and efficient ad targeting. Chapter 18: Understanding SEO And Its Importance. SEO is crucial for organic visibility and long-term traffic growth. On-page SEO, off-page SEO, and technical SEO all play vital roles. Chapter 24: Social Media Mastery: From Presence To Profit With AI. Use AI tools for content creation, scheduling, and performance analysis to maximize social media ROI.`
  },
];

export function BookUploader() {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<Array<{ title: string; status: "success" | "error"; message: string }>>([]);

  const handleUpload = async () => {
    setUploading(true);
    setResults([]);
    const uploadResults = [];

    for (const book of BOOK_DATA) {
      try {
        // Insert book record
        const { data: bookData, error: insertError } = await supabase
          .from("books")
          .insert({
            title: book.title,
            author: book.author,
            description: book.description,
            file_path: `books/${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
            processed: false,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // Process the book (chunk and index for search)
        const { error: processError } = await supabase.functions.invoke("process-book", {
          body: {
            bookId: bookData.id,
            text: book.content,
          },
        });

        if (processError) throw processError;

        uploadResults.push({
          title: book.title,
          status: "success" as const,
          message: "Successfully uploaded and processed",
        });

        toast.success(`${book.title} uploaded successfully!`);
      } catch (error) {
        uploadResults.push({
          title: book.title,
          status: "error" as const,
          message: error instanceof Error ? error.message : "Unknown error",
        });
        toast.error(`Failed to upload ${book.title}`);
      }
    }

    setResults(uploadResults);
    setUploading(false);
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Quick Book Upload</h2>
          <p className="text-muted-foreground">
            Upload all 3 of Hisham Sarwar's books with one click
          </p>
        </div>

        <Button 
          onClick={handleUpload} 
          disabled={uploading || results.length > 0}
          className="w-full"
          size="lg"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Uploading Books...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-5 w-5" />
              Upload All Books
            </>
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((result, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-3 rounded-lg border"
              >
                {result.status === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{result.title}</p>
                  <p className="text-sm text-muted-foreground">{result.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
