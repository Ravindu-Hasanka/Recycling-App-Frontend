'use client';

import { Play, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showChatBubble, setShowChatBubble] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  const messages = [
    "Hi there! I'm Litterbug",
    "I love to litter and make a mess",
    "But I can change! With your help, I can learn to recycle and keep our planet clean."
  ];

  // Autoplay background sound
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.loop = true;
      audioRef.current.play().catch(error => {
        console.log("Auto-play prevented:", error);
      });
    }
  }, []);

  // Handle mute/unmute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = !soundEnabled;
    }
  }, [soundEnabled]);

  // Start chat bubble typing after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChatBubble(true);
      typeMessage(0);
    }, 2000); // wait until character enters
    return () => clearTimeout(timer);
  }, []);

  // Typing function
  const typeMessage = (index: number) => {
    if (index >= messages.length) {
      setTimeout(() => setShowButtons(true), 1000);
      return;
    }

    const currentMsg = messages[index];
    let i = 0;
    setCurrentMessage('');

    const typingInterval = setInterval(() => {
      setCurrentMessage(currentMsg.substring(0, i + 1));
      i++;

      if (i === currentMsg.length) {
        clearInterval(typingInterval);
        setTimeout(() => {
          typeMessage(index + 1);
        }, 1200);
      }
    }, 50);
  };

  const onStartAdventure = () => {
    console.log('Adventure started! Navigating to the first adventure screen...');
    router.push('/story/2');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url('/assets/city-park.jpg')` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      {/* Background audio */}
      <audio ref={audioRef} src="/assets/sounds/nature-sounds.mp3" autoPlay loop />

      {/* Sound toggle */}
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

      {/* Title */}
      <h1 className="font-adventure font-bold text-5xl md:text-7xl mb-20 text-primary animate-bounce-soft relative z-10">
        {/* EcoHero Adventure Quest  */}
      </h1>

      {/* Character & Objects */}
      <div className="relative z-10 text-center w-full max-w-4xl mx-auto">
        <div className="mb-8 relative h-96 flex justify-center items-end">
          {/* Bottle (bottom-right, rotated 30deg) */}
          <motion.div
            initial={{ x: 300, y: 100, opacity: 0, rotate: 30 }}
            animate={{ x: 0, y: 0, opacity: 1, rotate: 30 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute bottom-0 right-1/4 z-0 mt-10 translate-y-[100px]"
          >
            <Image
              src="/assets/plastic-bottle.png"
              alt="bottle"
              width={80}
              height={80}
              className="shadow-glow"
            />
          </motion.div>

          {/* Wrappers (bottom-right) */}
          <motion.div
            initial={{ x: 300, y: 100, opacity: 0, rotate: 0 }}
            animate={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0. }}
            className="absolute bottom-0 right-2/5 z-20 translate-x-[300px] translate-y-[100px]"
          >
            <Image
              src="/assets/wrappers.png"
              alt="wrappers"
              width={100}
              height={100}
              className="shadow-glow"
            />
          </motion.div>

          {/* Character (comes from right side) */}
          <motion.div
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-0 z-30 translate-x-[400px] translate-y-[100px] bottom-0 mt-10"
          >
            <Image
              src="/assets/litterbug-left-look.png"
              alt="litterbug"
              width={300}
              height={300}
              className="shadow-glow"
            />
          </motion.div>

          {/* Chat bubble (centered) */}
          {showChatBubble && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 2 }}
              className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-3xl p-6 max-w-xl shadow-lg animate-fade-in z-40"
            >
              <div className="text-center text-black text-lg">
                {currentMessage}
                <span className="inline-block w-2 h-5 bg-black ml-1 animate-pulse"></span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Buttons */}
        {showButtons && (
          <motion.div
            className="flex flex-wrap gap-4 mt-8 justify-center items-center z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <button
              onClick={onStartAdventure}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-green-400 to-green-700 font-semibold shadow-lg hover:scale-105 transition-transform flex items-center"
            >
              <Play className="mr-2" size={20} />
              Continue
            </button>
          </motion.div>
        )}
      </div>

      {/* Extra Animations */}
      <style jsx>{`
        @keyframes bounce-soft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-soft {
          animation: bounce-soft 2s infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .shadow-glow {
          box-shadow: 0 0 15px rgba(72, 187, 120, 0.6);
        }
      `}</style>
    </div>
  );
}