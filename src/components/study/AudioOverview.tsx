import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Play, Pause, Volume2, RefreshCw } from "lucide-react";

interface AudioData {
  script: string;
}

interface AudioPlayer {
  pause: () => void;
  play: () => Promise<void>;
  paused?: boolean;
  currentTime?: number;
}

export const AudioOverview = ({ bookId, bookTitle, chapterName }: { bookId: string; bookTitle: string; chapterName?: string }) => {
  const [loading, setLoading] = useState(false);
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState<AudioPlayer | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAudioScript();
    
    // Load voices - this is critical for voice selection to work
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
        console.log("Voices loaded:", voices.map(v => `${v.name} (${v.lang})`));
      }
    };
    
    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      if (utterance) {
        speechSynthesis.cancel();
      }
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [bookId, chapterName]);

  const loadAudioScript = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-study-material", {
        body: { bookId, materialType: "audio_script", chapterName },
      });

      if (error) throw error;

      if (data?.material?.content) {
        setAudioData(data.material.content);
      }
    } catch (error) {
      console.error("Error loading audio script:", error);
      toast({
        title: "Error",
        description: "Failed to load audio overview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const playBrowserSpeech = () => {
    if (!audioData?.script) {
      console.error("No audio script available");
      return;
    }
    
    if (!voicesLoaded) {
      console.warn("Voices not loaded yet, waiting...");
      setTimeout(() => playBrowserSpeech(), 500);
      return;
    }
    
    console.log("Starting browser speech synthesis");
    speechSynthesis.cancel();
    
    const speech = new SpeechSynthesisUtterance(audioData.script);
    const voices = speechSynthesis.getVoices();
    
    // Priority order for realistic male voices
    const maleVoiceNames = [
      'Google UK English Male',
      'Microsoft David',
      'Microsoft Mark',
      'Alex',
      'Daniel',
      'James',
      'Google US English',
    ];
    
    let selectedVoice = voices.find(voice => 
      maleVoiceNames.some(name => voice.name.includes(name))
    );
    
    // Fallback: any English voice that doesn't explicitly say "Female"
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        !voice.name.toLowerCase().includes('female') &&
        !voice.name.toLowerCase().includes('samantha')
      );
    }
    
    if (selectedVoice) {
      speech.voice = selectedVoice;
      console.log("Selected voice:", selectedVoice.name, selectedVoice.lang);
    } else {
      console.warn("No male voice found, using default");
    }
    
    speech.rate = 0.95;
    speech.pitch = 0.85;
    speech.volume = 1;
    
    speech.onstart = () => {
      console.log("Speech started");
      setIsPlaying(true);
      setLoading(false);
    };
    
    speech.onend = () => {
      console.log("Speech ended");
      setIsPlaying(false);
      setUtterance(null);
    };
    
    speech.onerror = (event) => {
      console.error("Speech error:", event);
      toast({
        title: "Audio Error",
        description: "Browser speech failed. Please try again.",
        variant: "destructive",
      });
      setIsPlaying(false);
      setUtterance(null);
      setLoading(false);
    };

    setUtterance(speech as any);
    speechSynthesis.speak(speech);
  };

  const playAudio = async () => {
    if (!audioData?.script) {
      console.error("No audio script available");
      return;
    }
    
    setLoading(true);
    console.log("Attempting to play audio");
    
    // Just use browser speech directly since ElevenLabs is blocked
    playBrowserSpeech();
  };

  const togglePlayPause = () => {
    if (!audioData) return;

    if (isPlaying && utterance) {
      if ('pause' in utterance && typeof utterance.pause === 'function') {
        utterance.pause();
      } else {
        speechSynthesis.pause();
      }
      setIsPlaying(false);
    } else if (utterance) {
      if ('paused' in utterance && utterance.paused) {
        if ('play' in utterance) {
          utterance.play();
        } else {
          speechSynthesis.resume();
        }
        setIsPlaying(true);
      } else {
        playAudio();
      }
    } else {
      playAudio();
    }
  };

  const stopAudio = () => {
    if (utterance) {
      if ('pause' in utterance && typeof utterance.pause === 'function') {
        utterance.pause();
        if (utterance.currentTime !== undefined) {
          utterance.currentTime = 0;
        }
      } else {
        speechSynthesis.cancel();
      }
    }
    setIsPlaying(false);
    setUtterance(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin mb-4" />
        <p className="text-muted-foreground">Generating audio overview script...</p>
      </div>
    );
  }

  if (!audioData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No audio overview available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-primary to-primary/60 rounded-full mb-6">
          <Volume2 className="h-16 w-16 text-primary-foreground" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Audio Overview</h3>
        <p className="text-muted-foreground">{bookTitle}</p>
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={togglePlayPause} size="lg" className="gap-2">
          {isPlaying ? (
            <>
              <Pause className="h-5 w-5" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              Play Overview
            </>
          )}
        </Button>
        {isPlaying && (
          <Button onClick={stopAudio} variant="outline" size="lg">
            Stop
          </Button>
        )}
      </div>

      <div className="p-6 bg-muted rounded-lg">
        <h4 className="font-semibold mb-3">Audio Script:</h4>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {audioData.script}
        </p>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>🎧 AI-powered audio overview</p>
      </div>
    </div>
  );
};
