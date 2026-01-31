import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw } from "lucide-react";

const QuoteGenerator = () => {
  const quotes = [
    {
      text: "Be yourself, the world will adjust.",
      context: "On authenticity and personal branding",
      source: "LinkedIn Post",
      url: "https://www.linkedin.com/posts/hishamsarwar_be-yourself-the-world-will-adjust-activity-7298675564737953792-lhtM"
    },
    {
      text: "Little by little, one travels far.",
      context: "On consistency and patience in building success",
      source: "LinkedIn Post",
      url: "https://www.linkedin.com/posts/hishamsarwar_little-by-little-one-travels-far-activity-7267777408945045506-Cz8N"
    },
    {
      text: "No reward without risk. Can't take risk without the ability to make decisions. Can't make a decision without overcoming fear. Can't overcome fear if you lack mental strength.",
      context: "On building mental strength and entrepreneurship",
      source: "LinkedIn Post",
      url: "https://www.linkedin.com/posts/hishamsarwar_no-reward-without-risk-cant-take-risk-without-activity-7252733762390609920-9TGX"
    },
    {
      text: "You want to become successful in life but you can't wake up early. Success starts with discipline.",
      context: "On discipline and daily habits",
      source: "LinkedIn Post",
      url: "https://www.linkedin.com/posts/hishamsarwar_so-you-want-to-become-successful-in-life-activity-7259007811018219520-3-7E"
    },
    {
      text: "Learn the art of transitioning from selling one-to-one to one-to-many. Instead of cold calling 50 people in a day, focus on digital ads that reach 50,000 in a day.",
      context: "On scaling with digital marketing",
      source: "LinkedIn Post",
      url: "https://www.linkedin.com/posts/hishamsarwar_learn-the-art-of-transitioning-from-selling-activity-7268713667599233024-kPd-"
    },
    {
      text: "Play scale, master salesmanship. Get digital. Learn digital marketing!",
      context: "On embracing digital transformation",
      source: "LinkedIn Post",
      url: "https://www.linkedin.com/posts/hishamsarwar_learn-the-art-of-transitioning-from-selling-activity-7268713667599233024-kPd-"
    },
    {
      text: "Loyalty is a consequence of leadership, and leadership is a touchstone of competence.",
      context: "On leadership and team building",
      source: "YouTube - Leadership Video",
      url: "https://www.youtube.com/watch?v=I1QBhL92PpI"
    },
    {
      text: "Tech entrepreneur and proud builder of Asani.pk, WorkChest.com, and BeingGuru.com.",
      context: "On his entrepreneurial journey and platforms",
      source: "Asani.pk Profile",
      url: "https://asani.pk/profile/hisham"
    },
    {
      text: "Seekhna Seekho (#seekhnaseekho) is all about me. Perhaps you can take a leaf out of my book for your life learning.",
      context: "On his book and learning philosophy",
      source: "Asani.pk Profile Bio",
      url: "https://asani.pk/profile/hisham"
    },
    {
      text: "Communication is the bridge between confusion and clarity.",
      context: "On importance of clear communication in freelancing",
      source: "Book: Mastering Communication For Freelancers",
      url: "https://asani.pk/profile/hisham"
    },
    {
      text: "Digital marketing consultant & founder of WorkChest.com — I help brands grow, scale revenue, and connect with top freelance talent across Pakistan.",
      context: "On his mission and work",
      source: "LinkedIn Bio",
      url: "https://www.linkedin.com/in/hishamsarwar/"
    },
    {
      text: "The formula of success includes: Discipline, Productivity, Communication, Business Development, Networking, Financial Management, and Paying Back to Community.",
      context: "On the seven pillars of success",
      source: "YouTube - Leadership Video",
      url: "https://www.youtube.com/watch?v=I1QBhL92PpI"
    },
    {
      text: "Stop waiting for the perfect moment. Start where you are with what you have.",
      context: "On taking action immediately",
      source: "YouTube - How to start freelancing",
      url: "https://www.youtube.com/watch?v=0lFLu1uapx4"
    },
    {
      text: "Don't lose 2025 as your go-to year for life. Make it count with discipline and focused action.",
      context: "On seizing opportunities and planning",
      source: "YouTube Video",
      url: "https://www.youtube.com/watch?v=I1QBhL92PpI"
    },
    {
      text: "Grow your business online from scratch. Make money as an affiliate marketer. Get a job as a digital marketer.",
      context: "On digital marketing outcomes",
      source: "LCT Description",
      url: "https://learnonline.pk/courses/learn-complete-digital-marketing-with-hisham-sarwar/"
    },
    {
      text: "Flip your words, change your life.",
      context: "On the power of communication and mindset",
      source: "LCT Session 2 Day 17 YouTube Playlist",
      url: "https://www.youtube.com/playlist?list=PLYKy2x1MP_f7fy4t3kGfNdqpbBqZHSG7t"
    },
    {
      text: "Tech entrepreneur and proud builder of asani.pk, WorkChest.com, and BeingGuru.com. Passionate about empowering others through education.",
      context: "On his entrepreneurial mission",
      source: "Asani.pk Profile",
      url: "https://asani.pk/profile/hisham"
    },
    {
      text: "CEO of Innovista, building tech-savvy Pakistan through innovative IT solutions and digital transformation.",
      context: "On his leadership at Innovista",
      source: "Innovista About",
      url: "https://innovista.pk/about-us/"
    },
    {
      text: "Your mindset determines your success. Change your thoughts, change your reality.",
      context: "On mental transformation",
      source: "YouTube - Motivational Talk",
      url: "https://www.youtube.com/c/HishamSarwar"
    },
    {
      text: "Don't wait for opportunity. Create it through consistent action and learning.",
      context: "On proactive entrepreneurship",
      source: "LinkedIn Post",
      url: "https://www.linkedin.com/in/hishamsarwar/"
    },
  ];

  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateNewQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setCurrentQuote(randomQuote);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-navy-light to-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-glow rounded-full blur-3xl animate-glow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-gold/20 text-gold border-gold font-bold text-base">
            <Sparkles className="w-4 h-4 mr-2" />
            Daily Inspiration
          </Badge>

          <Card className="bg-gradient-card border-gold/20 p-12 md:p-16 shadow-elegant">
            <div
              className={`transition-all duration-300 ${
                isAnimating ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"
              }`}
            >
              <div className="mb-8">
                <svg
                  className="w-16 h-16 text-gold opacity-30 mx-auto mb-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              <p className="font-heading text-2xl md:text-4xl font-bold leading-tight mb-6 text-gold">
                "{currentQuote.text}"
              </p>

              <div className="flex flex-col items-center gap-2">
                <Badge variant="outline" className="border-electric-blue text-electric-blue">
                  {currentQuote.context}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  — Hisham Sarwar ({currentQuote.source})
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-electric-blue hover:text-gold mt-2"
                >
                  <a href={currentQuote.url} target="_blank" rel="noopener noreferrer">
                    View Source
                  </a>
                </Button>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gold/20">
              <Button
                size="lg"
                onClick={generateNewQuote}
                className="bg-gradient-glow text-navy-dark font-semibold hover:shadow-glow transition-all"
                disabled={isAnimating}
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${isAnimating ? "animate-spin" : ""}`} />
                Inspire Me
              </Button>
            </div>
          </Card>

          <p className="text-muted-foreground mt-8 text-sm">
            Each quote is drawn from Hisham Sarwar's verified public teachings, LinkedIn posts, and YouTube content
          </p>
        </div>
      </div>
    </section>
  );
};

export default QuoteGenerator;
