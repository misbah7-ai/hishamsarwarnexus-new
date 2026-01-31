import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Youtube, ExternalLink, PlayCircle, GraduationCap } from "lucide-react";

const VideoLibrary = () => {
  const videoCategories = [
    {
      category: "Freelancing Fundamentals",
      color: "gold",
      videos: [
        { title: "How to start freelancing | Freelancing for beginners", duration: "18:45", url: "https://www.youtube.com/watch?v=0lFLu1uapx4" },
        { title: "How to choose your skill for freelancing?", duration: "15:32", url: "https://www.youtube.com/watch?v=YF72Rri8k_0" },
        { title: "How to win the First freelance project?", duration: "12:20", url: "https://www.youtube.com/watch?v=lqEJAjiLO_8" },
        { title: "How To Start Freelancing - Step by Step Roadmap", duration: "22:15", url: "https://www.youtube.com/watch?v=S-kQqCPUc3Y" },
        { title: "How to write proposals for freelance projects", duration: "12:45", url: "https://www.youtube.com/watch?v=oQGNegadjcQ" },
        { title: "Client Retention & Growing Your Profile", duration: "18:20", url: "https://www.youtube.com/watch?v=6PcaHcjl7dQ" },
      ],
    },
    {
      category: "Digital Marketing & Personal Branding",
      color: "electric-blue",
      videos: [
        { title: "Digital Marketing Using AI", duration: "20:00", url: "https://www.youtube.com/watch?v=PeHQTSvO67M" },
        { title: "Learning LinkedIn for Digital Marketing", duration: "25:15", url: "https://www.youtube.com/watch?v=f9323TOT7rY" },
        { title: "How to Start Freelancing from Scratch | Beginners Guide", duration: "25:10", url: "https://www.youtube.com/watch?v=aoQT7k6oC2Y" },
        { title: "Building Your Personal Brand & Digital Presence", duration: "14:30", url: "https://www.youtube.com/@HishamSarwar/videos" },
      ],
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="mb-4 bg-gold/20 text-gold border-gold font-bold text-base">
            <Youtube className="w-4 h-4 mr-2" />
            Video Library
          </Badge>
          <h2 className="font-heading text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            YouTube <span className="text-gold">Guidance Hub</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore wisdom from Hisham Sarwar's YouTube channel with 1.1M+ subscribers. 
            Each video is a stepping stone to your freelancing success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {videoCategories.map((category, index) => (
            <Card
              key={index}
              className="bg-gradient-card border-gold/20 p-6 hover:shadow-glow transition-all animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-2xl font-bold">{category.category}</h3>
                <Badge
                  className={`${
                    category.color === "gold"
                      ? "bg-gold/20 text-gold border-gold"
                      : "bg-electric-blue/20 text-electric-blue border-electric-blue"
                  }`}
                >
                  {category.videos.length} Videos
                </Badge>
              </div>

              <div className="space-y-3">
                {category.videos.map((video, videoIndex) => (
                  <div
                    key={videoIndex}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <p className="font-medium group-hover:text-electric-blue transition-colors truncate">
                          {video.title}
                        </p>
                        <p className="text-sm text-muted-foreground">{video.duration}</p>
                      </a>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-background/60"
                        aria-label="Open video"
                      >
                        <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-electric-blue transition-colors" />
                      </a>
                      <button
                        onClick={() => navigator.clipboard.writeText(video.url)}
                        className="text-xs px-2 py-1 rounded-md border border-gold/30 text-muted-foreground hover:bg-gold/10"
                        aria-label="Copy video link"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                asChild
                className="w-full mt-6 bg-gradient-glow text-navy-dark hover:shadow-glow"
              >
                <a href="https://youtube.com/@hishamsarwar?si=Xfw-kiHIbbQ0fUtB" target="_blank" rel="noopener noreferrer">
                  <Youtube className="w-4 h-4 mr-2" />
                  View Videos
                </a>
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-gold text-gold hover:bg-gold hover:text-navy-dark"
          >
            <a href="https://youtube.com/@hishamsarwar?si=Xfw-kiHIbbQ0fUtB" target="_blank" rel="noopener noreferrer">
              <Youtube className="w-5 h-5 mr-2" />
              Visit YouTube Channel
            </a>
          </Button>
        </div>

        {/* LCT Section */}
        <Card className="bg-gradient-card border-gold/20 p-8 max-w-3xl mx-auto mt-12">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-gold" />
            </div>
            <h3 className="font-heading text-4xl font-extrabold mb-3 tracking-tight">LCT - Life Changing Training</h3>
            <p className="text-muted-foreground mb-6">
              Complete life-changing training program covering freelancing, digital marketing, business growth, and personal development.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <Badge variant="outline" className="border-gold/40">Freelancing</Badge>
              <Badge variant="outline" className="border-gold/40">Digital Marketing</Badge>
              <Badge variant="outline" className="border-gold/40">Business Growth</Badge>
              <Badge variant="outline" className="border-gold/40">Personal Development</Badge>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-gradient-glow text-navy-dark hover:shadow-glow"
            >
              <a href="https://www.youtube.com/playlist?list=PLHi_NUJDIGWK3J_3xoL8yXqWbingAizhG" target="_blank" rel="noopener noreferrer">
                <PlayCircle className="w-5 h-5 mr-2" />
                Watch LCT Playlist
              </a>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default VideoLibrary;
