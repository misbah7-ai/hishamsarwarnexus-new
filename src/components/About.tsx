import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Video } from "lucide-react";
import hishamSpeaking from "@/assets/hisham-speaking.jpg";
import hishamProfessional from "@/assets/hisham-professional-1.jpg";

const About = () => {
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);

  const milestones = [
    {
      year: "2001-2010",
      title: "Digital Foundations & Early Freelancing Phase",
      description: "Transitioned from a design background to full-time freelancing, becoming one of Pakistan's earliest recognized online freelancers during the rise of digital platforms.",
      achievements: [
        "Shifted from traditional design work to online freelancing platforms",
        "Mastered digital marketing, SEO, and business development skills",
        "Established reputation as a reliable professional in global marketplaces",
        "Built foundation for future success through consistent learning and execution",
      ],
    },
    {
      year: "2010-2016",
      title: "Breakthrough & Recognition Phase",
      description: "Achieved significant financial success in freelancing, surpassing $1M+ in earnings, and began sharing knowledge through workshops, events, and digital education initiatives.",
      achievements: [
        "Earned $1M+ in freelancing (ProPakistani feature, 2016)",
        "Gained recognition as one of Pakistan's top freelancers",
        "Started conducting workshops and training sessions nationwide",
        "Built expertise in digital marketing and business consulting",
        "Initiated knowledge-sharing efforts to empower emerging freelancers",
      ],
      resourceLinks: [
        { text: "ProPakistani Article (2016)", url: "https://propakistani.pk/2016/01/05/meet-hisham-sarwar-a-freelancer-with-over-1-million-in-earnings/" }
      ]
    },
    {
      year: "2016-2020",
      title: "Education Expansion & Community Growth",
      description: "Founded BeingGuru.com, launched YouTube channel, authored influential books, and built a growing digital community through consistent, valuable content creation.",
      achievements: [
        "Founded BeingGuru.com as an educational resource hub",
        "Launched YouTube channel with strategic content on freelancing and digital skills",
        "Published 'Seekhna Seekho' — autobiography and learning guide",
        "Published 'Business Development Foundation' book",
        "Grew YouTube audience significantly through educational content",
        "Established strong LinkedIn presence with valuable insights",
      ],
      resourceLinks: [
        { text: "Download Seekhna Seekho (PDF)", url: "https://drive.google.com/uc?export=download&id=13Hu0VYML6iC7RdiRpfvOREB9cI_Huyq_" },
        { text: "Download Business Development Foundation", url: "https://drive.google.com/uc?export=download&id=120DZ_a1pfvZmr0eCxvkghZdGYq_9YiLN" },
        { text: "Visit BeingGuru.com", url: "https://www.beingguru.com" }
      ]
    },
    {
      year: "2020-2023",
      title: "Innovation & Platform Development",
      description: "Launched Asani.pk — Pakistan's first creators social network, co-founded WorkChest.com, introduced Life-Changing Training (LCT) programs, and published specialized AI-focused books.",
      achievements: [
        "Founded Asani.pk — Pakistan's first social platform for creators",
        "Co-founded WorkChest.com — freelance talent marketplace",
        "Launched Life-Changing Training (LCT) programs",
        "Published 'Mastering Communication For Freelancers & Entrepreneurs'",
        "Published 'Mastering Online Sales & Marketing Using AI'",
        "Created comprehensive YouTube playlists for structured learning",
        "Reached 1M+ YouTube subscribers milestone",
      ],
      videoLink: "https://www.youtube.com/@HishamSarwar",
      resourceLinks: [
        { text: "Visit Asani.pk", url: "https://asani.pk" },
        { text: "Hisham's Asani Profile", url: "https://asani.pk/profile/hisham" },
        { text: "LCT Playlist", url: "https://www.youtube.com/playlist?list=PLHi_NUJDIGWK3J_3xoL8yXqWbingAizhG" },
        { text: "Learn Freelancing Playlist", url: "https://www.youtube.com/playlist?list=PLHi_NUJDIGWIU1-pPxaiVLNFwtX2Z2wwJ" }
      ]
    },
    {
      year: "2023-Present",
      title: "Continued Innovation & Digital Empowerment",
      description: "Strengthening Asani.pk ecosystem, advancing digital education initiatives, and leading projects empowering freelancers and content creators across Pakistan.",
      achievements: [
        "Expanding Asani.pk with new features and community engagement",
        "Growing YouTube presence to 1.1M+ subscribers",
        "Building LinkedIn audience to 330K+ followers",
        "Publishing 'Mastering the Art of Freelancing' (latest book)",
        "Continuing LCT programs with updated digital marketing curriculum",
        "Providing digital consulting and strategic guidance to businesses",
        "Developing tools and resources for the creator economy in Pakistan",
      ],
      videoLink: "https://www.youtube.com/@HishamSarwar",
      resourceLinks: [
        { text: "Mastering the Art of Freelancing (Google Books)", url: "https://books.google.com/books/about/Mastering_the_Art_of_Freelancing.html?id=XcRKEQAAQBAJ" },
        { text: "Seekhna Seekho (Free eBook)", url: "https://www.beingguru.com/seekhna-seekho-free-ebook/" },
        { text: "YouTube Channel", url: "https://www.youtube.com/@HishamSarwar" },
        { text: "LinkedIn Profile", url: "https://www.linkedin.com/in/hishamsarwar/" }
      ]
    },
  ];

  return (
    <section id="about" className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-electric-blue/5 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="mb-4 bg-gold/20 text-gold border-gold font-bold text-base">About Hisham Sarwar</Badge>
          <h2 className="font-heading text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            A Journey of <span className="text-gold">Inspiration</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From humble beginnings to becoming one of Pakistan's most influential digital marketing experts and freelancing pioneers, 
            Hisham Sarwar has transformed thousands of lives through his teachings, 
            guidance, and unwavering belief in human potential.
          </p>
        </div>

        {/* Bio Section */}
        <div className="mb-20">
          <Card className="bg-gradient-card border-gold/20 p-8 md:p-12 shadow-elegant">
            {/* The Guide Section */}
            <div className="grid md:grid-cols-[2fr,1fr] gap-8 mb-12">
              <div>
                <h3 className="font-heading text-3xl font-bold text-gold mb-6">The Guide</h3>
                <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                  With over 20 years of experience in digital marketing, Hisham Sarwar is a digital marketing consultant, 
                  tech entrepreneur, and passionate advocate for digital empowerment. He is the CEO of <strong>Innovista</strong> 
                  (a leading IT company building tech-savvy Pakistan), founder of <strong>Asani.pk</strong> 
                  (Pakistan's first creators social network), co-founder of <strong>WorkChest.com</strong> (a freelancing marketplace 
                  connecting local and global talent), and founder of <strong>BeingGuru.com</strong> (an educational resource hub).
                </p>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Hisham has authored multiple influential books including "Seekhna Seekho," "Mastering the Art of Freelancing," 
                  and "Mastering Online Sales & Marketing Using AI." Through his <strong>Life Changing (LCT)</strong> programs, 
                  YouTube channel (1.1M+ subscribers), and LinkedIn presence (330K+ followers), he provides practical, actionable 
                  guidance to help individuals build digital careers and achieve financial independence.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <img 
                  src={hishamSpeaking} 
                  alt="Hisham Sarwar Speaking at Event" 
                  className="rounded-lg shadow-elegant w-full max-w-sm h-auto object-cover"
                />
              </div>
            </div>

            {/* The Impact Section */}
            <div className="grid md:grid-cols-[1fr,2fr] gap-8">
              <div className="flex items-center justify-center">
                <img 
                  src={hishamProfessional} 
                  alt="Hisham Sarwar - Professional Portrait" 
                  className="rounded-lg shadow-elegant w-full max-w-sm h-auto object-cover"
                />
              </div>
              <div>
                <h3 className="font-heading text-3xl font-bold text-electric-blue mb-6">The Impact</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
                      <span className="font-heading text-2xl font-bold text-gold">1.1M+</span>
                    </div>
                    <p className="text-muted-foreground text-lg">YouTube Subscribers worldwide</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-electric-blue/20 flex items-center justify-center">
                      <span className="font-heading text-2xl font-bold text-electric-blue">330K+</span>
                    </div>
                    <p className="text-muted-foreground text-lg">LinkedIn Followers & counting</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
                      <span className="font-heading text-2xl font-bold text-gold">$1M+</span>
                    </div>
                    <p className="text-muted-foreground text-lg">Earned in freelancing career</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-electric-blue/20 flex items-center justify-center">
                      <span className="font-heading text-2xl font-bold text-electric-blue">20+</span>
                    </div>
                    <p className="text-muted-foreground text-lg">Years of industry experience</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
                      <span className="font-heading text-2xl font-bold text-gold">4</span>
                    </div>
                    <p className="text-muted-foreground text-lg">Major platforms founded & led (Innovista, Asani, WorkChest, BeingGuru)</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Platforms & Contributions */}
        <div className="mb-20">
          <Card className="bg-gradient-card border-electric-blue/20 p-8">
            <h3 className="font-heading text-2xl font-bold mb-6 text-electric-blue">Platforms & Contributions</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              <a href="https://innovista.pk" target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline">Innovista.pk — Building Tech-Savvy Pakistan</a>
              <a href="https://asani.pk" target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline">Asani.pk — Pakistan's creators network</a>
              <a href="https://asani.pk/profile/hisham" target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline">Hisham's Asani Profile</a>
              <a href="https://www.youtube.com/@HishamSarwar" target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline">Official YouTube Channel</a>
              <a href="https://www.linkedin.com/in/hishamsarwar/" target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline">LinkedIn Newsletter</a>
              <a href="https://books.google.com/books/about/Mastering_the_Art_of_Freelancing.html?id=XcRKEQAAQBAJ" target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline">Mastering the Art of Freelancing (Book)</a>
              <a href="https://www.beingguru.com/seekhna-seekho-free-ebook/" target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline">Seekhna Seekho (Free eBook)</a>
            </div>
          </Card>
        </div>

        {/* Timeline Section */}
        <div>
          <h3 className="font-heading text-4xl md:text-5xl font-extrabold text-center mb-12 tracking-tight">
            Journey <span className="text-electric-blue">Timeline</span>
          </h3>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-gold via-electric-blue to-gold"></div>
            
            {/* Milestones */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div 
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "justify-start" : "justify-end"
                  }`}
                >
                  <Card 
                    className={`w-full md:w-5/12 bg-gradient-card border-gold/20 p-6 cursor-pointer transition-all hover:shadow-glow ${
                      selectedMilestone === index ? "shadow-glow scale-105" : ""
                    }`}
                    onClick={() => setSelectedMilestone(selectedMilestone === index ? null : index)}
                  >
                    <Badge className="mb-3 bg-gold/20 text-gold">{milestone.year}</Badge>
                    <h4 className="font-heading text-xl font-bold mb-2">{milestone.title}</h4>
                    <p className="text-muted-foreground mb-4">{milestone.description}</p>
                    
                    {selectedMilestone === index && (
                      <div className="mt-4 pt-4 border-t border-gold/20 animate-fade-in">
                        <p className="text-sm text-electric-blue font-semibold mb-2">Key Achievements:</p>
                        <ul className="space-y-2">
                          {milestone.achievements.map((achievement, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                        {milestone.resourceLinks && milestone.resourceLinks.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm font-semibold text-electric-blue">Resources:</p>
                            <div className="flex flex-wrap gap-2">
                              {milestone.resourceLinks.map((link, idx) => (
                                <Button
                                  key={idx}
                                  asChild
                                  size="sm"
                                  variant="outline"
                                  className="border-gold/30 text-gold hover:bg-gold/10 text-xs"
                                >
                                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                                    {link.text}
                                  </a>
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                        {milestone.videoLink && (
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="mt-4 border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white"
                          >
                            <a href={milestone.videoLink} target="_blank" rel="noopener noreferrer">
                              Watch Related Content
                            </a>
                          </Button>
                        )}
                      </div>
                    )}
                  </Card>
                  
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gold rounded-full border-4 border-background shadow-gold"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
