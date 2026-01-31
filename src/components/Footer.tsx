import { Button } from "@/components/ui/button";
import { Youtube, Instagram, Linkedin, Facebook, BookOpen, Mail, GraduationCap } from "lucide-react";
import asaniLogo from "@/assets/asani-logo.webp";

const Footer = () => {
  const socialLinks = [
    {
      name: "YouTube",
      icon: Youtube,
      url: "https://youtube.com/@hishamsarwar?si=Xfw-kiHIbbQ0fUtB",
      color: "hover:text-red-500",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/hishamsarwar?igsh=c2N4ZXcybGNneTIw",
      color: "hover:text-pink-500",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/in/hishamsarwar/",
      color: "hover:text-blue-500",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://www.facebook.com/HishamSarwarBeingGuru/",
      color: "hover:text-blue-600",
    },
  ];

  return (
    <footer id="footer" className="bg-navy-dark border-t border-gold/20 py-12">
      <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Branding */}
          <div>
            <h3 className="font-heading text-2xl font-bold mb-2">
              <span className="text-gold">HishamSarwar</span>Nexus
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Where Growth Partnership Becomes Immortal. A digital tribute to Hisham Sarwar's 
              vision, teachings, and lasting impact on thousands of lives worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <a href="#about" className="block text-muted-foreground hover:text-electric-blue transition-colors text-sm">
                About Hisham Sarwar
              </a>
              <a href="#chat" className="block text-muted-foreground hover:text-electric-blue transition-colors text-sm">
                YouTube Guidance Hub
              </a>
              <a href="https://lctonline.pk" target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-electric-blue transition-colors text-sm">
                Life Changing (LCT)
              </a>
              <a href="https://asani.pk" target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-electric-blue transition-colors text-sm">
                Asani.pk Platform
              </a>
            </div>
          </div>

          {/* Books & Resources */}
          <div>
            <h4 className="font-semibold text-gold mb-4">Books & Resources</h4>
            <div className="space-y-2">
              <a href="https://books.google.com/books/about/Mastering_the_Art_of_Freelancing.html?id=XcRKEQAAQBAJ" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-electric-blue transition-colors text-sm">
                <BookOpen className="w-3 h-3" />
                Mastering the Art of Freelancing
              </a>
              <a href="https://www.beingguru.com/seekhna-seekho-free-ebook/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-electric-blue transition-colors text-sm">
                <BookOpen className="w-3 h-3" />
                Seekhna Seekho (Free)
              </a>
              <a href="https://www.linkedin.com/in/hishamsarwar/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-electric-blue transition-colors text-sm">
                <Mail className="w-3 h-3" />
                LinkedIn Newsletter
              </a>
              <a href="https://youtube.com/@hishamsarwar" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-electric-blue transition-colors text-sm">
                <GraduationCap className="w-3 h-3" />
                YouTube (1.1M+ Subs)
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-gold mb-4">Follow & Connect</h4>
            <div className="flex flex-wrap gap-3 mb-3">
              {socialLinks.map((link) => (
                <Button
                  key={link.name}
                  variant="outline"
                  size="icon"
                  className={`border-gold/20 ${link.color} transition-colors`}
                  asChild
                  title={link.name}
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                    <link.icon className="w-5 h-5" />
                  </a>
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                className="border-gold/20 hover:border-electric-blue transition-colors p-1.5"
                asChild
                title="Asani.pk"
              >
                <a href="https://asani.pk" target="_blank" rel="noopener noreferrer" aria-label="Asani.pk">
                  <img 
                    src={asaniLogo} 
                    alt="Asani.pk" 
                    className="w-full h-full object-contain rounded"
                  />
                </a>
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">
              Daily inspirations & updates
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gold/20 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 HishamSarwarNexus. A tribute to a legacy. Built with inspiration and AI to honor Hisham Sarwar's teachings.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            All content sourced from verified public channels and teachings.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
