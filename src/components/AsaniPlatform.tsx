import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Building2, Megaphone, Share2 } from "lucide-react";
import asaniLogo from "@/assets/asani-logo.webp";

const AsaniPlatform = () => {
  const features = [
    {
      title: "Social Connectivity",
      description: "Stay connected, make new friends, and build strong communities without the fear of being silenced. Express yourself freely.",
      icon: Users,
    },
    {
      title: "Find Services Nearby",
      description: "Connect with trusted service providers near you. Find car mechanics, home cleaners, electricians, tutors, and more with just a few clicks.",
      icon: Building2,
    },
    {
      title: "Advertise Your Business",
      description: "Grow your business on Pakistan's own platform. Reach thousands of active users and bring real traffic, leads, and sales.",
      icon: Megaphone,
    },
  ];

  return (
    <section id="asani" className="py-24 bg-gradient-to-b from-background to-navy-light relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="mb-4 bg-gold/20 text-gold border-gold font-bold text-base">
            <Share2 className="w-4 h-4 mr-2" />
            Pakistan's Own Platform
          </Badge>
          <h2 className="font-heading text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Welcome to <span className="text-gold">Asani.pk</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            آسانی میں خوش آمدید - Pakistan's creators network and social platform where you can connect, share content, and grow your business. Founded by Hisham Sarwar.
          </p>
        </div>

        {/* Platform Logo */}
        <div className="flex justify-center mb-16">
          <Card className="bg-gradient-card border-gold/20 p-8 inline-block">
            <img 
              src={asaniLogo} 
              alt="Asani.pk - Pakistan's creators network" 
              className="h-24 md:h-32 object-contain"
            />
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="bg-gradient-card border-gold/20 p-8 hover:shadow-glow transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-card border-electric-blue/20 p-12 text-center">
          <h3 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            Join Pakistan's Social Media Platform
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Share your stories, connect with others, promote your business, and be part of a growing Pakistani community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-glow text-navy-dark hover:shadow-glow"
            >
              <a href="https://asani.pk/profile/hisham" target="_blank" rel="noopener noreferrer">
                <Share2 className="w-5 h-5 mr-2" />
                Visit Hisham's Profile
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-navy-dark"
            >
              <a href="https://asani.pk" target="_blank" rel="noopener noreferrer">
                Join Asani.pk
              </a>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AsaniPlatform;
