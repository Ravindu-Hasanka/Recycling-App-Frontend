'use client';

import { getStoryByTitle, updateProgress } from '@/app/api/story-api';
import { Story } from '@/app/types/story';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface MountainItem {
  id: number;
  type: 'plastic' | 'paper' | 'glass' | 'metal' | 'general';
  name: string;
  image: string;
  description: string;
  position: { x: number; y: number };
}

interface Bin {
  type: 'plastic' | 'paper' | 'glass' | 'metal' | 'general';
  label: string;
  color: string;
  icon: string;
  accepts: string[];
  description: string;
}

const MountainCleanupGame = () => {
  // Game state
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [itemsCollected, setItemsCollected] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [climbProgress, setClimbProgress] = useState(0);
  const [currentItem, setCurrentItem] = useState<MountainItem | null>(null);

  const [story, setStory] = useState<Story | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const storyData = await getStoryByTitle("The Messy Park");
        setStory(storyData);
      } catch (error: any) {
        if (error.message === "Unauthorized") {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userid");
          router.push("/login");
        } else {
          console.error(error);
        }
      }
    };

    fetchStory();
  }, []);

  // Mountain items data
  const [mountainItems] = useState<MountainItem[]>([
    { id: 1, type: 'plastic', name: 'Water Bottle', image: '/images/trash/water-bottle.png', description: 'PET plastic container', position: { x: 15, y: 30 } },
    { id: 2, type: 'metal', name: 'Soda Can', image: '/images/trash/soda-can.png', description: 'Aluminum beverage can', position: { x: 25, y: 45 } },
    { id: 3, type: 'paper', name: 'Energy Bar Wrapper', image: '/images/trash/food-wrapper.png', description: 'Foil-lined wrapper', position: { x: 35, y: 60 } },
    { id: 4, type: 'glass', name: 'Glass Jar', image: '/images/trash/glass-jar.png', description: 'Glass food container', position: { x: 45, y: 25 } },
    { id: 5, type: 'general', name: 'Chip Bag', image: '/images/trash/chip-bag.png', description: 'Mixed material packaging', position: { x: 55, y: 40 } },
    { id: 6, type: 'plastic', name: 'Sport Drink Bottle', image: '/images/trash/sport-bottle.png', description: 'Plastic #1 container', position: { x: 65, y: 55 } },
    { id: 7, type: 'metal', name: 'Tuna Can', image: '/images/trash/tuna-can.png', description: 'Steel food can', position: { x: 75, y: 35 } },
    { id: 8, type: 'paper', name: 'Paper Cup', image: '/images/trash/paper-cup.png', description: 'Waxed paper cup', position: { x: 85, y: 50 } },
  ]);

  // Bin data
  const [bins] = useState<Bin[]>([
    { type: 'plastic', label: 'Plastic', color: 'bg-blue-500', icon: '♳', accepts: ['plastic'], description: 'Bottles, containers' },
    { type: 'paper', label: 'Paper', color: 'bg-green-500', icon: '📄', accepts: ['paper'], description: 'Cups, wrappers, paper' },
    { type: 'glass', label: 'Glass', color: 'bg-yellow-500', icon: '🥃', accepts: ['glass'], description: 'Jars, bottles' },
    { type: 'metal', label: 'Metal', color: 'bg-gray-500', icon: '🥫', accepts: ['metal'], description: 'Cans, foil' },
    { type: 'general', label: 'General Waste', color: 'bg-red-500', icon: '🗑️', accepts: ['general'], description: 'Non-recyclables' },
  ]);

  // Items that have been collected and sorted
  const [collectedItems, setCollectedItems] = useState<number[]>([]);
  const [sortedItems, setSortedItems] = useState<number[]>([]);

  // Initialize game
  useEffect(() => {
    if (gameActive) {
      setTimeLeft(90);
      setScore(0);
      setItemsCollected(0);
      setCollectedItems([]);
      setSortedItems([]);
      setGameOver(false);
      setShowReward(false);
      setClimbProgress(0);
      setCurrentItem(null);
    }
  }, [gameActive]);

  // Game timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        // Increase climb progress over time
        setClimbProgress(prev => Math.min(100, prev + 0.5));
      }, 1000);
    } else if (timeLeft <= 0 && gameActive) {
      setGameActive(false);
      setGameOver(true);
    }
    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  // Check if all items are collected and sorted
  useEffect(() => {
    if (itemsCollected === mountainItems.length && gameActive) {
      setGameActive(false);
      setShowReward(true);
      // Bonus points for time left
      setScore(prev => prev + timeLeft * 5);
    }
  }, [itemsCollected, gameActive, timeLeft, mountainItems.length]);

  // Start the game
  const startGame = () => {
    setGameActive(true);
  };

  // Reset the game
  const resetGame = () => {
    setGameActive(false);
    setGameOver(false);
    setShowReward(false);
  };

  // Handle item collection
  const handleItemCollect = (item: MountainItem) => {
    if (!collectedItems.includes(item.id)) {
      setItemsCollected(prev => prev + 1);
      setCollectedItems(prev => [...prev, item.id]);
      setCurrentItem(item);
      setScore(prev => prev + 5); // Points for collecting
    }
  };

  // Handle item drop
  const handleDrop = (e: React.DragEvent, binType: string) => {
    e.preventDefault();
    if (!currentItem) return;

    if (currentItem.type === binType) {
      // Correct bin - add to score
      setScore(prev => prev + 10);
      setSortedItems(prev => [...prev, currentItem.id]);
      setCurrentItem(null);
    } else {
      // Wrong bin - penalize
      setShowHint(true);
      setScore(prev => Math.max(0, prev - 5));
      setTimeout(() => setShowHint(false), 2000);
    }
  };

  // Allow drop
  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, item: MountainItem) => {
    e.dataTransfer.setData('text/plain', item.id.toString());
    setCurrentItem(item);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-4 md:p-6 relative overflow-hidden">
      {/* Snowflakes animation */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white opacity-50 animate-snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
              fontSize: `${Math.random() * 10 + 10}px`
            }}
          >
            ❄
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">Mountain Cleanup</h1>
          <p className="text-sm md:text-lg text-blue-600">
            Clean up the mountain trail while climbing to the summit!
          </p>

          <div className="flex justify-center items-center mt-4 gap-4 md:gap-6">
            <div className="bg-white rounded-full px-3 py-1 md:px-4 md:py-2 shadow-md flex items-center">
              <span className="text-lg mr-1">⭐</span>
              <span className="font-bold text-blue-700">Score: {score}</span>
            </div>
            <div className="bg-white rounded-full px-3 py-1 md:px-4 md:py-2 shadow-md flex items-center">
              <span className="text-lg mr-1">⏱️</span>
              <span className="font-bold text-red-700">Time: {timeLeft}s</span>
            </div>
            <div className="bg-white rounded-full px-3 py-1 md:px-4 md:py-2 shadow-md flex items-center">
              <span className="text-lg mr-1">🗻</span>
              <span className="font-bold text-purple-700">
                Climb: {Math.round(climbProgress)}%
              </span>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
          {/* Game instructions */}
          <div className="flex items-center mb-4 md:mb-6">
            <div className="bg-blue-100 rounded-full p-2 md:p-3 mr-3 md:mr-4">
              <span className="text-2xl md:text-3xl">🏔️</span>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-blue-800">Mountain Trail</h2>
              <p className="text-sm md:text-base text-blue-600">
                "Brrr! It's cold! Let's keep the mountain clean. Can you pick the right bin for the tin can?"
              </p>
            </div>
          </div>

          {showHint && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 md:p-4 mb-4 md:mb-6 animate-pulse rounded">
              <p className="font-bold text-sm md:text-base">⚠️ That's not the right bin! Try again.</p>
            </div>
          )}

          {/* Game content */}
          {!gameActive && !gameOver && !showReward && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🏔️</div>
              <h3 className="text-2xl font-bold text-blue-700 mb-2">Mountain Cleanup Challenge!</h3>
              <p className="text-blue-600 mb-4">
                Help clean up the mountain trail while climbing to the summit!
              </p>
              <button
                onClick={startGame}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md"
              >
                Start Climbing
              </button>
            </div>
          )}

          {gameOver && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">😢</div>
              <h3 className="text-2xl font-bold text-red-700 mb-2">Time's Up!</h3>
              <p className="text-red-600 mb-4">
                You didn't reach the summit in time. Try again to clean the mountain!
              </p>
              <button
                onClick={resetGame}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md"
              >
                Try Again
              </button>
            </div>
          )}

          {showReward && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-blue-700 mb-2">Mountain Cleaned!</h3>
              <p className="text-blue-600 mb-2">
                You've reached the summit and cleaned the mountain trail!
              </p>
              <p className="text-blue-600 mb-4">
                Final Score: {score} | Time Bonus: {timeLeft * 5}
              </p>

              <div className="my-6">
                <div className="inline-block bg-blue-100 rounded-full p-4 shadow-lg">
                  <span className="text-4xl">🧣</span>
                </div>
                <p className="text-blue-700 font-bold mt-2">Warm Scarf Unlocked!</p>
              </div>

              <div className="mountain-celebration flex justify-center gap-4 text-3xl my-4">
                <span className="animate-bounce">🏔️</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>⛰️</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>❄️</span>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={resetGame}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md mt-4"
                >
                  Play Again
                </button>
                <button
                  onClick={async () => {
                    if (story) {
                      try {
                        await updateProgress({
                          storyId: story.id,
                          score: score,
                        });
                        console.log("Progress updated!");
                      } catch (err) {
                        console.error("Failed to update progress", err);
                      }
                    }
                    router.push("/story/animation/12");
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md mt-4"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {gameActive && (
            <>
              {/* Mountain Scene */}
              <div
                className="relative rounded-lg p-4 mb-6 md:mb-8 h-64 border-2 border-blue-300 overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: "url('/images/mountain-bg.jpg')" }}
              >


                {/* Trash items on the mountain */}
                {mountainItems.map(item => (
                  !collectedItems.includes(item.id) && (
                    <div
                      key={item.id}
                      onClick={() => handleItemCollect(item)}
                      className="absolute cursor-pointer z-10 transition-transform duration-200 hover:scale-110"
                      style={{
                        left: `${item.position.x}%`,
                        top: `${item.position.y}%`,
                      }}
                    >
                      <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center shadow-lg text-2xl">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} width={40} height={40} />
                        ) : (
                          <>
                            {item.type === 'plastic'
                              ? '🥤'
                              : item.type === 'paper'
                                ? '📄'
                                : item.type === 'glass'
                                  ? '🥃'
                                  : item.type === 'metal'
                                    ? '🥫'
                                    : '🗑️'}
                          </>
                        )}

                      </div>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white text-xs px-1 rounded whitespace-nowrap">
                        {item.name}
                      </div>
                    </div>
                  )
                ))}

                {/* Current item indicator */}
                {currentItem && (
                  <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-lg">
                    <p className="text-sm font-bold text-center">Collected:</p>
                    <p className="text-lg font-bold text-center">{currentItem.name}</p>
                    <p className="text-xs text-center text-gray-600">{currentItem.description}</p>
                    <p className="text-xs text-center mt-2">Drag to the correct bin below</p>
                  </div>
                )}
              </div>

              {/* Instruction */}
              <div className="text-center text-blue-700 font-bold mb-4">
                <p>Click on trash items to collect them, then drag to the correct bin</p>
              </div>

              {/* Bins */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 mb-4 md:mb-6">
                {bins.map(bin => (
                  <div
                    key={bin.type}
                    onDrop={(e) => handleDrop(e, bin.type)}
                    onDragOver={allowDrop}
                    className={`${bin.color} rounded-lg p-3 text-center min-h-32 flex flex-col items-center justify-end transition-all hover:opacity-90 border-2 border-gray-700 shadow-md relative cursor-pointer`}
                  >
                    <div className="w-12 h-16 bg-gray-800 mb-2 rounded-t-lg flex items-center justify-center text-white text-2xl">
                      {bin.icon}
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1">{bin.label}</h3>
                    <p className="text-white text-xs opacity-80">{bin.description}</p>

                    {/* Items in Bin */}
                    <div className="flex flex-wrap justify-center gap-1 mt-2">
                      {sortedItems.map(itemId => {
                        const item = mountainItems.find(i => i.id === itemId);
                        return item && item.type === bin.type ? (
                          <div key={itemId} className="w-4 h-4 rounded flex items-center justify-center bg-white shadow-sm text-xs">
                            {item.type === 'plastic' ? '🥤' :
                              item.type === 'paper' ? '📄' :
                                item.type === 'glass' ? '🥃' :
                                  item.type === 'metal' ? '🥫' : '🗑️'}
                          </div>
                        ) : null;
                      })}
                    </div>

                    {/* Drop hint */}
                    <div className="absolute inset-0 bg-green-500 bg-opacity-50 flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="text-white font-bold text-sm">Drop here</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Educational Content */}
        <div className="bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-200 mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-bold text-blue-800 mb-2 flex items-center">
            <span className="mr-2">🏔️</span> Mountain Conservation
          </h3>
          <p className="text-blue-700 text-sm md:text-base">
            Trash in mountain environments can harm wildlife and take decades to decompose in cold temperatures.
            Properly packing out waste helps preserve these beautiful natural spaces for future generations!
          </p>
        </div>

        {/* Hiking Tips */}
        <div className="bg-green-50 rounded-xl p-4 md:p-6 border border-green-200">
          <h3 className="text-base md:text-lg font-bold text-green-800 mb-2 flex items-center">
            <span className="mr-2">💡</span> Leave No Trace Tips
          </h3>
          <ul className="list-disc pl-5 text-green-700 text-sm md:text-base">
            <li>Pack out all trash, even biodegradable items like fruit peels</li>
            <li>Use reusable containers instead of single-use packaging</li>
            <li>Participate in organized trail clean-up events</li>
            <li>Carry a small bag for collecting trash you find on the trail</li>
          </ul>
        </div>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes snowflake {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .animate-snowflake {
          animation: snowflake linear infinite;
        }
        .bg-mountain-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 L100,0 L100,100 L0,100 Z' fill='none'/%3E%3Cpath d='M0,80 Q20,60 40,70 Q60,50 80,60 Q90,40 100,50 L100,100 L0,100 Z' fill='%23f0f9ff'/%3E%3C/svg%3E");
          background-size: 300px 200px;
        }
      `}</style>
    </div>
  );
};

export default MountainCleanupGame;