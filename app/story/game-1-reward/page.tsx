'use client';

import { Play, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [characterPosition, setCharacterPosition] = useState('-100%');
  const [turtlePosition, setTurtlePosition] = useState('100%');
  const [showChatBubble, setShowChatBubble] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<'ecohero' | 'tiko'>('ecohero');
  const [currentMessage, setCurrentMessage] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  const messages: { speaker: 'ecohero' | 'tiko'; text: string }[] = [
    { speaker: 'ecohero', text: "You did it! Look! It's all clean now!" },
    { speaker: 'tiko', text: "Well done… nature is smiling." },
    { speaker: 'ecohero', text: "And You've earned my first reward a shiny green cape!" },
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.loop = true;
      audioRef.current.play().catch(error => {
        console.log("Auto-play prevented:", error);
      });
    }

    // Animate character entrance
    const characterTimer = setTimeout(() => {
      setCharacterPosition('0%');
    }, 1000);

    // Animate turtle entrance after a delay
    const turtleTimer = setTimeout(() => {
      setTurtlePosition('0%');
    }, 2000);

    return () => {
      clearTimeout(characterTimer);
      clearTimeout(turtleTimer);
    };
  }, []);

  // Handle mute/unmute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = !soundEnabled;
    }
  }, [soundEnabled]);

  // After characters enter, show chat bubble and start typing messages
  useEffect(() => {
    if (characterPosition === '0%' && turtlePosition === '0%') {
      const bubbleTimer = setTimeout(() => {
        setShowChatBubble(true);
        typeMessage(0); // start typing first message
      }, 1000);
      return () => clearTimeout(bubbleTimer);
    }
  }, [characterPosition, turtlePosition]);

  // Typing function
  const typeMessage = (index: number) => {
    if (index >= messages.length) {
      // When all messages are done, show buttons
      setTimeout(() => setShowButtons(true), 1000);
      return;
    }

    const currentMsg = messages[index];
    setCurrentSpeaker(currentMsg.speaker);
    let i = 0;
    setCurrentMessage(''); // reset for new message

    const typingInterval = setInterval(() => {
      setCurrentMessage(currentMsg.text.substring(0, i + 1));
      i++;

      if (i === currentMsg.text.length) {
        clearInterval(typingInterval);

        // Wait before typing next message
        setTimeout(() => {
          typeMessage(index + 1);
        }, 1500);
      }
    }, 50);
  };

  const onStartAdventure = () => {
    console.log('Adventure started! Navigating to the first adventure screen...');
    router.push('/story/3'); // Navigate to the first adventure screen
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

      <div className="relative z-10 text-center max-w-6xl mx-auto w-full flex flex-col items-center">
        {/* Characters Container */}
        <div className="flex justify-between items-end w-full mb-8 relative h-96">
          {/* EcoHero on the left */}
          <div
            className="transform transition-all duration-1000 ease-out translate-y-30 mr-10"
            style={{ transform: `translateX(${characterPosition})` }}
          >
            <Image
              src="/assets/ecohero-character-right-look.png"
              alt="EcoHero - Your environmental superhero guide"
              width={300}
              height={300}
              className="shadow-glow"
            />
          </div>

          {/* Tiko the Turtle on the right */}
          <div
            className="transform transition-all duration-1000 ease-out translate-y-50"
            style={{ transform: `translateX(${turtlePosition})` }}
          >
            <Image
              src="/assets/tiko-turtle-left-look.png" // Make sure this image exists
              alt="Tiko the Turtle"
              width={400}
              height={400}
              className="shadow-glow"
            />
          </div>
        </div>

        {/* Chat bubble */}
        {showChatBubble && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`relative bg-white rounded-3xl p-4 max-w-md shadow-lg mb-8 ${
            currentSpeaker === 'ecohero' ? 'self-center -translate-y-100 mr-40' : 'self-center'
          }`}
        >
          <div className="text-left text-black">
            {currentMessage}
            <span className="inline-block w-2 h-4 bg-black ml-1 animate-pulse"></span>
          </div>
          <div className={`absolute w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent ${
            currentSpeaker === 'ecohero' 
              ? 'border-r-8 border-r-white left-0 -translate-x-2/3 -translate-y-4' 
              : 'border-l-8 border-l-white right-0 translate-x-2/3 -translate-y-4'
          }`}></div>
        </motion.div>
      )}

        {/* Buttons */}
        {showButtons && (
          <motion.div
            className="flex flex-wrap gap-4 justify-center items-center z-50 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <button
              onClick={onStartAdventure}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-green-400 to-green-700 font-semibold shadow-lg hover:scale-105 transition-transform flex items-center"
            >
              <Play className="mr-2" size={20} />
              Let's Go to Next Adventure!
            </button>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        .shadow-glow {
          box-shadow: 0 0 15px rgba(72, 187, 120, 0.6);
        }
      `}</style>
    </div>
  );
}