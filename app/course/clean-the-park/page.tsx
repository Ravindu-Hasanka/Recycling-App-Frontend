'use client';

import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Image from "next/image";

type TrashItem = {
  id: number;
  type: 'bottle' | 'can' | 'wrapper' | 'bag' | 'paper';
  top: string;
  left: string;
  rotation: number;
  scale: number;
};

const trashTypes: Array<'bottle' | 'can' | 'wrapper' | 'bag' | 'paper'> = [
  'bottle', 'can', 'wrapper', 'bag', 'paper'
];

const trashImages = {
  bottle: '/images/games/clean-the-park/trash-bottle.png',
  can: '/images/games/clean-the-park/trash-can.png',
  wrapper: '/images/games/clean-the-park/trash-wrapper.png',
  bag: '/images/games/clean-the-park/trash-bag.png',
  paper: '/images/games/clean-the-park/trash-paper.png',
};

const generateRandomPosition = () => {
  // Ensure items don't appear too close to edges
  return {
    top: `${Math.random() * 70 + 10}%`,  // 10-80%
    left: `${Math.random() * 70 + 10}%`, // 10-80%
    rotation: Math.random() * 60 - 30,   // -30 to 30 degrees
    scale: 0.7 + Math.random() * 0.6    // 0.7-1.3 scale
  };
};

const generateRandomTrashItems = (count: number): TrashItem[] => {
  return Array.from({ length: count }, (_, i) => {
    const { top, left, rotation, scale } = generateRandomPosition();
    return {
      id: i + 1,
      type: trashTypes[Math.floor(Math.random() * trashTypes.length)],
      top,
      left,
      rotation,
      scale
    };
  });
};

export default function CleanPark() {
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
  const [collected, setCollected] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [shake, setShake] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);

  // Initialize or reset game
  const setupGame = useCallback(() => {
    setTrashItems(generateRandomTrashItems(10)); // Generate 10 random trash items
    setCollected([]);
    setScore(0);
    setShowCelebration(false);
    setTimer(0);
  }, []);

  // Initialize game on first render
  useEffect(() => {
    setupGame();
  }, [setupGame]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (collected.length < trashItems.length) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [collected, trashItems.length]);

  const handleCollect = (id: number) => {
    setShake(id);
    setTimeout(() => {
      setCollected([...collected, id]);
      setScore(score + 10);
      setShake(null);
    }, 300);
  };

  useEffect(() => {
    if (collected.length === trashItems.length && trashItems.length > 0) {
      setShowCelebration(true);
    }
  }, [collected, trashItems]);

  const resetGame = () => {
    setupGame();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <>
      <Head>
        <title>Clean the Park Game</title>
      </Head>
      
      <div className="relative w-full max-w-3xl h-[600px] mx-auto bg-[url('/images/games/clean-the-park/park-background.jpg')] bg-cover bg-center rounded-xl overflow-hidden shadow-lg border-4 border-green-700 text-black">
        <div className="absolute inset-0 bg-black bg-opacity-30">
          <div className="absolute inset-0 bg-[url('/images/games/clean-the-park/park.jpg')] bg-cover opacity-50"></div>
        </div>
        
        <div className="relative z-10 h-full flex flex-col">
          <header className="bg-green-800 bg-opacity-90 text-white p-4 text-center">
            <h1 className="text-3xl font-bold">Clean the Park!</h1>
            <div className="flex justify-between items-center mt-2 px-4">
              <div className="bg-white text-green-800 px-3 py-1 rounded-full font-bold">
                Score: {score}
              </div>
              <div className="text-yellow-300">
                Time: {formatTime(timer)}
              </div>
              <div className="text-yellow-300">
                {trashItems.length - collected.length} left
              </div>
            </div>
          </header>
          
          <div className="flex-grow relative">
            {trashItems.map((item) =>
              collected.includes(item.id) ? null : (
                <div
                  key={item.id}
                  onClick={() => handleCollect(item.id)}
                  className={`absolute w-16 h-16 cursor-pointer transition-transform duration-300 hover:scale-110 ${shake === item.id ? 'animate-bounce' : ''}`}
                  style={{
                    top: item.top,
                    left: item.left,
                    transform: `rotate(${item.rotation}deg) scale(${item.scale})`
                  }}
                  title="Click to clean up!"
                >
                  <Image
                    src={trashImages[item.type]}
                    alt={item.type}
                    width={64}
                    height={64}
                    className="object-contain w-full h-full"
                  />
                </div>
              )
            )}
          </div>
        </div>
        
        {/* Celebration */}
        {showCelebration && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="bg-white p-8 rounded-xl text-center animate-pulse">
              <h2 className="text-4xl font-bold text-green-600 mb-4">Congratulations!</h2>
              <p className="text-xl mb-4">You cleaned the park in {formatTime(timer)}! 🎉</p>
              <p className="text-2xl font-bold mb-6">Final Score: {score}</p>
              <button
                onClick={resetGame}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full text-lg transition-all"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="max-w-3xl mx-auto mt-4 p-4 bg-green-50 rounded-lg">
        <h3 className="text-xl font-bold text-green-800 mb-2">How to Play:</h3>
        <ul className="list-disc pl-5 text-green-900">
          <li>Click on trash items to clean them up</li>
          <li>Earn 10 points for each piece of trash</li>
          <li>Try to find all the hidden trash items</li>
          <li>Complete the game as fast as possible!</li>
        </ul>
      </div>
    </>
  );
}