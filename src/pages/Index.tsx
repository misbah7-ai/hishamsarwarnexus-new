import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";

import MentorMind from "@/components/MentorMind";
import { BookRAG } from "@/components/BookRAG";
import { BookGallery } from "@/components/BookGallery";
import VideoLibrary from "@/components/VideoLibrary";
import QuoteGenerator from "@/components/QuoteGenerator";
import Community from "@/components/Community";
import AsaniPlatform from "@/components/AsaniPlatform";
import { ResearchTool } from "@/components/ResearchTool";
import Footer from "@/components/Footer";

const Index = () => {
  const handleNavigate = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onNavigate={handleNavigate} />
      <div id="home">
        <Hero />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="chat">
        <MentorMind />
      </div>
      <BookGallery />
      <div id="book-rag">
        <BookRAG />
      </div>
      <div id="videos">
        <VideoLibrary />
      </div>
      <div id="quotes">
        <QuoteGenerator />
      </div>
      <div id="research">
        <ResearchTool />
      </div>
      <div id="asani">
        <AsaniPlatform />
      </div>
      <div id="community">
        <Community />
      </div>
      <div id="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
