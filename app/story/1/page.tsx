'use client';

import { Play, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect, useRef, use } from 'react';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { motion } from 'framer-motion';

export default function Page() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [characterPosition, setCharacterPosition] = useState('-100%');
  const [showChatBubble, setShowChatBubble] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const messages = [
    "Welcome to our imaginary world!",
    "I'm EcoHero, guardian of our planet!",
    "Our beautiful Earth needs your help to fight pollution and climate change.",
    "Are you ready to join me on this important adventure?"
  ];

  useEffect(() => {
    // Auto-play nature sounds when component mounts
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.loop = true;
      audioRef.current.play().catch(error => {
        console.log("Auto-play was prevented:", error);
      });
    }

    // Animate character entrance after a short delay
    const characterTimer = setTimeout(() => {
      setCharacterPosition('0%');
    }, 1000);

    return () => {
      clearTimeout(characterTimer);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowButtons(true);
    }, 2000); // Show buttons after 2 seconds
  }, []);

  useEffect(() => {
    // Handle sound toggle
    if (audioRef.current) {
      audioRef.current.muted = !soundEnabled;
    }
  }, [soundEnabled]);

  useEffect(() => {
  if (showChatBubble && messageIndex < messages.length) {
    startTyping();
  }
}, [messageIndex, showChatBubble]);

  useEffect(() => {
    if (messageIndex === messages.length) {
      const buttonsTimer = setTimeout(() => {
        setShowButtons(true);
      }, 1500);
      return () => clearTimeout(buttonsTimer);
    }
  }, []);

  const startTyping = () => {
    if (messageIndex < messages.length) {
      let i = 0;
      const currentMsg = messages[messageIndex];
      const typingInterval = setInterval(() => {
        setCurrentMessage(currentMsg.substring(0, i));
        i++;
        if (i > currentMsg.length) {
          clearInterval(typingInterval);
          setMessageIndex(prev => prev + 1);
        }
      }, 50);
    }
  };

  const playWelcomeSound = () => {
    if (soundEnabled) console.log('🎵 Playing welcome sound!');
  };

  const onStartAdventure = () => {
    console.log('Adventure started! Navigating to the first adventure screen...');
  };

  return (
    <div
  className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center relative overflow-hidden"
  style={{ backgroundImage: `url('/assets/hero-background.jpg')` }}
>
  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/70 z-0"></div>

      {/* Hidden audio element for nature sounds */}
      <audio ref={audioRef} src="/assets/sounds/nature-sounds.mp3" />

      {/* Sound toggle button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="bg-card/80 hover:bg-card rounded-full"
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1 className="font-adventure font-bold text-5xl md:text-7xl mb-20 text-primary animate-bounce-soft">
          EcoHero Adventure Quest
        </h1>

        {/* Animated character */}
        <div className="mb-8 relative h-64">
          <div
            className="absolute transform -translate-x-[100px] transition-all duration-1000 ease-out"
            style={{ left: characterPosition }}
          >
            <Image
              src="/assets/ecohero-character-right-look.png"
              alt="EcoHero - Your environmental superhero guide"
              width={512}
              height={512}
              className="shadow-glow"
            />
          </div>


          {/* Chat bubble */}
          {showChatBubble && (
            <div className="absolute left-72 top-4 bg-white rounded-3xl p-4 max-w-md shadow-lg animate-fade-in">
              <div className="text-left text-black">
                {currentMessage}
                {messageIndex < messages.length && (
                  <span className="inline-block w-2 h-4 bg-black ml-1 animate-pulse"></span>
                )}
              </div>
              <div className="absolute w-0 h-0 border-top-8 border-top-transparent border-right-8 border-right-white border-bottom-8 border-bottom-transparent left-0 top-6 -translate-x-2/3"></div>
            </div>
          )}
        </div>
        <div>

          {/* Buttons */}
          {showButtons && (
            <motion.div
              className="absolute inset-0 flex flex-wrap gap-4 mt-100 justify-center items-center z-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <button
                onClick={onStartAdventure}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-green-400 to-green-700 font-semibold shadow-lg hover:scale-105 transition-transform flex items-center"
              >
                <Play className="mr-2" size={20} />
                Start Adventure!
              </button>
              <button className="px-6 py-3 rounded-full border-2 border-white/40 bg-white/10 backdrop-blur-md font-semibold shadow-md hover:scale-105 transition-transform flex items-center">
                <span className="mr-2">🎵</span> Meet the Characters
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .btn-hero {
          background: linear-gradient(135deg, #4ade80, #22d3ee);
        }
        .btn-hero:hover {
          background: linear-gradient(135deg, #22d3ee, #4ade80);
        }
        .shadow-glow {
          box-shadow: 0 0 15px rgba(72, 187, 120, 0.6);
        }
      `}</style>
    </div>
  );
}