import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Video } from "lucide-react";

const CohortTrainings = () => {
  const cohorts = [
    {
      title: "LCT - Life Changing",
      description: "Life-changing training program covering essential skills for personal and professional growth, including freelancing, digital marketing, business development, and practical implementation strategies.",
      icon: GraduationCap,
      topics: ["Freelancing & Digital Marketing", "Business Growth Strategies", "Personal Development", "Practical Skills Implementation"],
      videoCount: "Multiple Sessions",
      link: "https://www.youtube.com/playlist?list=PLHi_NUJDIGWK3J_3xoL8yXqWbingAizhG",
      additionalLink: { text: "LCT Session 2 (YouTube)", url: "https://www.youtube.com/watch?v=96botdJst_A" }
    },
    {
      title: "Learn Freelancing with Hisham Sarwar",
      description: "Step-by-step freelancing training covering skill selection, winning first projects, proposal writing, and client retention strategies.",
      icon: BookOpen,
      topics: ["How to Start Freelancing", "Skill Selection", "Winning First Project", "Proposal Writing", "Client Retention"],
      videoCount: "50+ Videos",
      link: "https://www.youtube.com/playlist?list=PLHi_NUJDIGWIU1-pPxaiVLNFwtX2Z2wwJ",
      additionalLink: { text: "Complete Training Playlist", url: "https://www.youtube.com/playlist?list=PLmbRatAZDpQPZVsl3y9WEDvgVLreYKSJm" }
    },
    {
      title: "Digital Marketing Using AI",
      description: "Learn how to leverage AI tools for digital marketing, content creation, and business growth in the modern era.",
      icon: Video,
      topics: ["AI for Marketing", "Content Generation", "Automation Tools", "AI-Powered Campaigns"],
      videoCount: "New Playlist",
      link: "https://www.youtube.com/watch?v=PeHQTSvO67M",
      additionalLink: { text: "LinkedIn Announcement", url: "https://www.linkedin.com/posts/hishamsarwar_digital-marketing-using-ai-a-complete-brand-activity-7304100065344692225-gx75" }
    },
    {
      title: "Complete Digital Marketing Training",
      description: "Full digital marketing training available on Learnonline.pk covering business growth, affiliate marketing, and job-ready skills.",
      icon: GraduationCap,
      topics: ["Business Growth Online", "Affiliate Marketing", "Digital Marketing Jobs", "Practical Implementation"],
      videoCount: "2441+ Enrollments",
      link: "https://learnonline.pk/courses/learn-complete-digital-marketing-with-hisham-sarwar/",
      additionalLink: { text: "Training Details", url: "https://learnonline.pk/courses/learn-complete-digital-marketing-with-hisham-sarwar/" }
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-navy-light to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gold rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="mb-4 bg-electric-blue/20 text-electric-blue border-electric-blue">
            <GraduationCap className="w-4 h-4 mr-2" />
            Training Programs
          </Badge>
          <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">
            Live <span className="text-electric-blue">Training Programs</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Free YouTube playlists covering freelancing, digital marketing, SEO, and YouTube growth.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {cohorts.map((training, index) => {
            const Icon = training.icon;
            return (
              <Card
                key={index}
                className="bg-gradient-card border-electric-blue/20 p-8 hover:shadow-glow transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 rounded-full bg-electric-blue/20 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-electric-blue" />
                  </div>
                  <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue">
                    {training.videoCount}
                  </Badge>
                </div>
                <h3 className="font-heading text-2xl font-bold mb-3">{training.title}</h3>
                <p className="text-muted-foreground mb-4">{training.description}</p>

                <div className="space-y-2 mb-6">
                  <p className="text-sm font-semibold text-gold">Topics Covered:</p>
                  <ul className="space-y-2">
                    {training.topics.map((topic, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-electric-blue rounded-full"></span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <Button
                    asChild
                    className="w-full bg-gradient-glow text-navy-dark hover:shadow-glow"
                  >
                    <a href={training.link} target="_blank" rel="noopener noreferrer">
                      Watch Playlist
                    </a>
                  </Button>
                  {training.additionalLink && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-gold/30 text-gold hover:bg-gold/10"
                      size="sm"
                    >
                      <a href={training.additionalLink.url} target="_blank" rel="noopener noreferrer">
                        {training.additionalLink.text}
                      </a>
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CohortTrainings;
