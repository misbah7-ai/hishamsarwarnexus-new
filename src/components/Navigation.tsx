import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface NavigationProps {
  onNavigate: (section: string) => void;
}

const Navigation = ({ onNavigate }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Home", id: "home" },
    { label: "A Journey of Inspiration", id: "about" },
    { label: "HishamSarwarNexus", id: "chat" },
    { label: "Explore His Books", id: "book-rag" },
    { label: "YouTube Guidance Hub", id: "videos" },
    { label: "Daily Inspiration", id: "quotes" },
    { label: "Welcome to Asani.pk", id: "asani" },
    { label: "Community Stories", id: "community" },
    { label: "Contact", id: "footer" },
  ];

  const handleClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-dark/95 backdrop-blur-md border-b border-gold/20 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => handleClick("home")}
            className="font-heading text-2xl md:text-3xl font-extrabold text-gold hover:text-electric-blue transition-colors tracking-tight"
          >
            HishamSarwarNexus
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => handleClick(item.id)}
                className="text-foreground hover:text-gold hover:bg-gold/10 transition-all font-semibold text-base"
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-gold"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gold/20 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => handleClick(item.id)}
                  className="justify-start text-foreground hover:text-gold hover:bg-gold/10 font-bold text-lg py-6"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
