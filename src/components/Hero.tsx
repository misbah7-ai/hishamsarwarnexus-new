import { Button } from "@/components/ui/button";
import heroPortrait from "@/assets/hisham-real-photo.png";

const Hero = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-16">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-electric-blue rounded-full opacity-10 blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gold rounded-full opacity-10 blur-3xl animate-float" style={{ animationDelay: "3s" }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-block">
              <span className="text-electric-blue text-sm font-semibold tracking-widest uppercase mb-4 block">
                HishamSarwarNexus • Powered by AI
              </span>
            </div>
            
            <h1 className="font-heading font-extrabold leading-tight tracking-tight">
              <span className="block text-foreground text-5xl md:text-6xl lg:text-7xl">Hisham Sarwar:</span>
              <span className="block bg-gradient-glow bg-clip-text text-transparent animate-glow text-5xl md:text-6xl lg:text-7xl">
                The Living Legacy
              </span>
            </h1>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-6 tracking-tight">
              Experience the evolution of Empowerment with Hisham Sarwar
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Where knowledge meets innovation and communities thrive on real growth.
              Guided by real experience, powered by technology, and driven by purpose — this is the Nexus of Creative Empowerment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button 
                size="lg" 
                className="bg-gradient-glow text-navy-dark font-semibold hover:shadow-glow transition-all"
                onClick={() => scrollToSection("chat")}
              >
                Talk to HishamSarwarNexus
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-navy-dark transition-all"
                onClick={() => scrollToSection("about")}
              >
                Explore His Journey
              </Button>
            </div>
          </div>

          {/* Right side - Portrait */}
          <div className="relative animate-slide-up">
            <div className="relative">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-glow opacity-20 blur-3xl rounded-full"></div>
              
              {/* Portrait image */}
              <div className="relative rounded-3xl overflow-hidden shadow-elegant border-2 border-gold/20">
                <img 
                  src={heroPortrait} 
                  alt="Sir Hisham Sarwar" 
                  className="w-full h-auto object-cover"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-transparent"></div>
                
                {/* Quote overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                <p className="font-heading text-2xl md:text-3xl text-gold font-bold italic">
                  "You are as big as you challenge yourself"
                </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-electric-blue rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-electric-blue rounded-full animate-glow"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
