import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Star, Quote } from "lucide-react";
import speakingEvent from "@/assets/speaking-event.jpg";
import asaniLogo from "@/assets/asani-logo.webp";

const Community = () => {
  const testimonials = [
    {
      name: "Ahmed Khan",
      role: "Freelance Digital Marketer",
      country: "Pakistan",
      flag: "🇵🇰",
      story: "Started from zero, now earning $3000/month. Hisham's LCT program changed my entire perspective on freelancing and gave me practical skills that work.",
      transformation: "From unemployed to successful freelancer in 6 months",
      rating: 5,
    },
    {
      name: "Fatima Ali",
      role: "Content Creator & Strategist",
      country: "UAE",
      flag: "🇦🇪",
      story: "His teachings on personal branding and LinkedIn helped me build a following of 50K+. The AI marketing strategies are game-changing!",
      transformation: "Built a thriving online business from scratch",
      rating: 5,
    },
    {
      name: "Hassan Raza",
      role: "E-commerce Entrepreneur",
      country: "UK",
      flag: "🇬🇧",
      story: "Learned to use AI tools for digital marketing through his videos. My business revenue increased by 300% in just 4 months using his strategies.",
      transformation: "Scaled business using AI and digital marketing",
      rating: 5,
    },
    {
      name: "Ayesha Malik",
      role: "Social Media Manager",
      country: "Canada",
      flag: "🇨🇦",
      story: "The proposal writing and client retention techniques from his channel helped me land my first $5000 contract. Forever grateful!",
      transformation: "From beginner to landing high-value contracts",
      rating: 5,
    },
    {
      name: "Bilal Ahmed",
      role: "Web Developer & Freelancer",
      country: "Pakistan",
      flag: "🇵🇰",
      story: "His mindset videos gave me the courage to quit my 9-5 and start freelancing full-time. Best decision of my life!",
      transformation: "Achieved financial freedom through freelancing",
      rating: 5,
    },
    {
      name: "Zainab Hussain",
      role: "Virtual Assistant",
      country: "UAE",
      flag: "🇦🇪",
      story: "Started with his 'How to start freelancing' video. Now I manage multiple clients and have a team of 3. His teachings are pure gold!",
      transformation: "Built a remote team and scaled operations",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-navy-light relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="mb-4 bg-gold/20 text-gold border-gold font-bold text-base">
            <Star className="w-4 h-4 mr-2" />
            Inspiring Lives & Transformations
          </Badge>
          <h2 className="font-heading text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Inspiring Thousands — <span className="text-gold">Stories of Change</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Thousands have transformed their careers through Hisham Sarwar's teachings — from freelancers finding their first client to entrepreneurs scaling their digital presence.
          </p>
        </div>

        {/* Featured Image */}
        <div className="mb-16 max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-elegant">
            <img
              src={speakingEvent}
              alt="Hisham Sarwar speaking to thousands at a packed auditorium"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
              <p className="font-heading text-2xl md:text-4xl text-gold font-bold drop-shadow-lg">
                Inspiring Thousands Through Knowledge & Guidance
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-gradient-card border-gold/20 p-6 hover:shadow-elegant transition-all animate-fade-in relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Quote className="w-10 h-10 text-electric-blue/20 absolute top-4 right-4" />
              
              <div className="mb-4">
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{testimonial.flag}</span>
                  <div>
                    <h3 className="font-heading text-xl font-bold">{testimonial.name}</h3>
                    <p className="text-sm text-electric-blue">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.country}</p>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground mb-4 leading-relaxed italic">
                "{testimonial.story}"
              </p>

              <div className="pt-4 border-t border-gold/20">
                <Badge variant="outline" className="text-xs border-gold/40 text-gold">
                  {testimonial.transformation}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Share Your Story CTA */}
        <Card className="bg-gradient-glow p-8 md:p-12 text-center max-w-3xl mx-auto">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-navy-dark" />
          <h3 className="font-heading text-3xl md:text-4xl font-extrabold text-navy-dark mb-4 tracking-tight">
            Share Your Inspiration Story
          </h3>
          <p className="text-navy-dark/80 mb-6 max-w-xl mx-auto">
            Has Hisham Sarwar inspired your journey? Share your story and become part of this living legacy.
          </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-navy-dark text-gold hover:bg-navy-dark/90 transition-all hover:scale-105 hover:shadow-lg"
              >
                <a 
                  href="https://asani.pk/profile/hisham" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View Hisham's Asani Profile
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-navy-dark text-navy-dark hover:bg-navy-dark hover:text-gold transition-all hover:scale-105 hover:shadow-lg"
              >
                <a 
                  href="https://asani.pk" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <img src={asaniLogo} alt="Asani.pk logo" className="w-4 h-4 mr-2 rounded" />
                  Join Asani.pk & Share Your Story
                </a>
              </Button>
            </div>
        </Card>
      </div>
    </section>
  );
};

export default Community;
