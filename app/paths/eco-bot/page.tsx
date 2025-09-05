'use client';

import { Play, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import Vapi from '@vapi-ai/web';
import { cn } from '@/app/lib/utils';
import { FiPhoneCall, FiPhoneOff, FiRefreshCw } from 'react-icons/fi';
import { tr } from 'framer-motion/client';

export default function Page() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [characterPosition, setCharacterPosition] = useState('-100%');
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showStartButton, setShowStartButton] = useState(false);
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [transcript, setTranscript] = useState<Array<{ role: string; text: string }>>([]);
  const [journeySteps, setJourneySteps] = useState<string[] | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '');
    setVapi(vapiInstance);

    vapiInstance.on('call-start', () => {
      setIsConnected(true);
      setShowStartButton(false);
      setTranscript([
        { role: 'system', text: '🌍 EcoHero is ready to chat with you!' },
      ]);
    });

    vapiInstance.on('call-end', () => {
      setIsConnected(false);
      setIsSpeaking(false);
    });

    vapiInstance.on('speech-start', () => setIsSpeaking(true));
    vapiInstance.on('speech-end', () => setIsSpeaking(false));

    vapiInstance.on('message', (message: any) => {
      if (message.type === 'transcript' && message.transcript) {
        setTranscript((prev) => [...prev, { role: message.role, text: message.transcript }]);
      }

      if (message.type === 'function-call' && message.functionCall?.name === 'suggest_journey') {
        setJourneySteps(message.functionCall.parameters.journey);
      }
    });

    return () => {
      vapiInstance.stop();
    };
  }, []);

  const startCall = () => {
    if (vapi) {
      vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || '', {
        model: {
          provider: 'openai',
          model: 'gpt-4-turbo',
          temperature: 0.8,
          messages: [
            {
              role: 'system',
              content: `
                You are EcoHero 🌱, a fun superhero teaching kids (ages 6–10) 
                about protecting nature, recycling, and fighting pollution.
                - Speak in short, simple, playful sentences.
                - Ask the child fun, interactive questions.
                - Give eco-friendly tips and encouragement.
                - At the end, call the function "suggest_journey" with a 3-step plan 
                  for the child to start their eco journey.
              `,
            },
          ],
        },
      });
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.loop = true;
      audioRef.current.play().catch((error) => {
        console.log('Auto-play prevented:', error);
        setShowStartButton(true);
      });
    }

    const characterTimer = setTimeout(() => {
      setCharacterPosition('0%');
    }, 1000);

    setShowStartButton(true)

    return () => {
      clearTimeout(characterTimer);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = !soundEnabled;
    }
  }, [soundEnabled]);

  const endCall = () => {
    alert('Thank you for chatting with EcoHero! Remember to take care of our planet! 🌍💚');
    if (vapi) {
      vapi.stop();
    }
  };

  const restartConversation = () => {
    setTranscript([]);
    setJourneySteps(null);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url('/assets/hero-background.jpg')` }}
    >
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      <audio ref={audioRef} src="/assets/sounds/nature-sounds.mp3" loop />

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

      <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
        <div className="relative w-full flex flex-col items-center">
          {/* Character */}
          <motion.div
            className="relative w-64 md:w-96 mx-auto mb-8"
            initial={{ left: '-100%' }}
            animate={{ left: characterPosition }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <Image
              src="/assets/ecohero-character-right-look.png"
              alt="EcoHero"
              width={512}
              height={512}
              className="shadow-glow w-full h-auto"
            />
          </motion.div>

          {/* Buttons and transcript */}
          <div className="w-full max-w-md mx-auto flex flex-col items-center gap-4 z-20">
            {showStartButton && (
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <Button
                  onClick={startCall}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-green-400 to-green-700 font-semibold shadow-lg hover:scale-105 transition-transform flex items-center"
                >
                  <Play className="mr-2" size={20} />
                  Talk with EcoHero!
                </Button>
              </motion.div>
            )}

            {/* {isConnected && (
              <div className="w-full text-left max-h-40 overflow-y-auto bg-black/40 rounded-lg p-3">
                {transcript.map((msg, index) => (
                  <p
                    key={index}
                    className={cn('mb-2', msg.role === 'user' ? 'text-yellow-200' : 'text-green-200')}
                  >
                    <strong>{msg.role === 'user' ? 'You: ' : 'EcoHero: '}</strong>
                    {msg.text}
                  </p>
                ))}
              </div>
            )}
             */}
            <div className="flex justify-center gap-4 mt-4">
              {isConnected && (
                <Button
                  onClick={endCall}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full flex items-center gap-2"
                >
                  <FiPhoneOff /> End Chat
                </Button>
              )}
              {journeySteps && (
                <Button
                  onClick={restartConversation}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full flex items-center gap-2"
                >
                  <FiRefreshCw /> Restart
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes bounce-soft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-soft {
          animation: bounce-soft 2s ease-in-out infinite;
        }
        .shadow-glow {
          box-shadow: 0 0 15px rgba(72, 187, 120, 0.6);
        }
      `}</style>
    </div>
  );
}