'use client';

import { getStoryByTitle, updateProgress } from '@/app/api/story-api';
import { Story } from '@/app/types/story';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

interface RiverItem {
  id: number;
  type: 'plastic' | 'paper' | 'glass' | 'organic' | 'metal';
  name: string;
  icon: string;
  position: { x: number; y: number };
}

interface Bin {
  type: 'plastic' | 'paper' | 'glass' | 'organic' | 'metal';
  label: string;
  color: string;
  icon: string;
  accepts: string[];
}

const RiverRescueGame = () => {
  // Game state
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [itemsSorted, setItemsSorted] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [showHint, setShowHint] = useState(false);

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

  // Refs for DOM elements
  const riverRef = useRef<HTMLDivElement>(null);

  // River items data
  const [riverItems, setRiverItems] = useState<RiverItem[]>([
    { id: 1, type: 'plastic', name: 'Plastic Bottle', icon: '🥤', position: { x: 5, y: 20 } },
    { id: 2, type: 'paper', name: 'Newspaper', icon: '📰', position: { x: 15, y: 40 } },
    { id: 3, type: 'glass', name: 'Glass Jar', icon: '🥃', position: { x: 25, y: 60 } },
    { id: 4, type: 'metal', name: 'Soda Can', icon: '🥫', position: { x: 35, y: 30 } },
    { id: 5, type: 'organic', name: 'Apple Core', icon: '🍎', position: { x: 45, y: 50 } },
  ]);

  // Bin data
  const [bins] = useState<Bin[]>([
    { type: 'plastic', label: 'Plastic', color: 'bg-blue-500', icon: '♳', accepts: ['plastic'] },
    { type: 'paper', label: 'Paper', color: 'bg-green-500', icon: '📄', accepts: ['paper'] },
    { type: 'glass', label: 'Glass', color: 'bg-yellow-500', icon: '🥃', accepts: ['glass'] },
    { type: 'organic', label: 'Food Waste', color: 'bg-amber-700', icon: '🍂', accepts: ['organic'] },
    { type: 'metal', label: 'Metal', color: 'bg-gray-500', icon: '🥫', accepts: ['metal'] },
  ]);

  // Items that have been sorted
  const [sortedItems, setSortedItems] = useState<number[]>([]);

  // Initialize game
  useEffect(() => {
    if (gameActive) {
      setTimeLeft(60);
      setScore(0);
      setItemsSorted(0);
      setSortedItems([]);
      setGameOver(false);
      setShowReward(false);
    }
  }, [gameActive]);

  // Game timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0 && gameActive) {
      setGameActive(false);
      setGameOver(true);
    }
    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  // Check if all items are sorted
  useEffect(() => {
    if (itemsSorted === riverItems.length && gameActive) {
      setGameActive(false);
      setShowReward(true);
      // Bonus points for time left
      setScore(prev => prev + timeLeft * 5);
    }
  }, [itemsSorted, gameActive, timeLeft, riverItems.length]);

  // Start the game
  const startGame = () => {
    setGameActive(true);
  };

  // Reset the game
  const resetGame = () => {
    setGameActive(false);
    setGameOver(false);
    setShowReward(false);
    setRiverItems([
      { id: 1, type: 'plastic', name: 'Plastic Bottle', icon: '🥤', position: { x: 5, y: 20 } },
      { id: 2, type: 'paper', name: 'Newspaper', icon: '📰', position: { x: 15, y: 40 } },
      { id: 3, type: 'glass', name: 'Glass Jar', icon: '🥃', position: { x: 25, y: 60 } },
      { id: 4, type: 'metal', name: 'Soda Can', icon: '🥫', position: { x: 35, y: 30 } },
      { id: 5, type: 'organic', name: 'Apple Core', icon: '🍎', position: { x: 45, y: 50 } },
    ]);
  };

  // Handle item drop
  const handleDrop = (e: React.DragEvent, binType: string) => {
    e.preventDefault();
    const itemId = parseInt(e.dataTransfer.getData('text/plain'));
    const item = riverItems.find(item => item.id === itemId);

    if (item && item.type === binType) {
      // Correct bin - add to score and remove from river
      setScore(prev => prev + 10);
      setItemsSorted(prev => prev + 1);
      setSortedItems(prev => [...prev, itemId]);
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
  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData('text/plain', id.toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 p-4 md:p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-5 text-4xl opacity-20">🌳</div>
        <div className="absolute top-20 right-10 text-4xl opacity-20">🌲</div>
        <div className="absolute bottom-20 left-20 text-4xl opacity-20">🌻</div>
        <div className="absolute bottom-10 right-20 text-4xl opacity-20">🦋</div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">River Rescue</h1>
          <p className="text-sm md:text-lg text-green-600">
            Help clean the river before the trash harms the marine life!
          </p>

          <div className="flex justify-center items-center mt-4 gap-4 md:gap-6">
            <div className="bg-white rounded-full px-3 py-1 md:px-4 md:py-2 shadow-md flex items-center">
              <span className="text-lg mr-1">⭐</span>
              <span className="font-bold text-green-700">Score: {score}</span>
            </div>
            <div className="bg-white rounded-full px-3 py-1 md:px-4 md:py-2 shadow-md flex items-center">
              <span className="text-lg mr-1">⏱️</span>
              <span className="font-bold text-blue-700">Time: {timeLeft}s</span>
            </div>
            <div className="bg-white rounded-full px-3 py-1 md:px-4 md:py-2 shadow-md flex items-center">
              <span className="text-lg mr-1">✅</span>
              <span className="font-bold text-purple-700">
                Sorted: {itemsSorted}/{riverItems.length}
              </span>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
          {/* Game instructions */}
          <div className="flex items-center mb-4 md:mb-6">
            <div className="bg-green-100 rounded-full p-2 md:p-3 mr-3 md:mr-4">
              <span className="text-2xl md:text-3xl">🌊</span>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-green-800">The Polluted River</h2>
              <p className="text-sm md:text-base text-green-600">
                Drag each item to the correct recycling bin to clean the river!
              </p>
            </div>
          </div>

          {showHint && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 md:p-4 mb-4 md:mb-6 animate-pulse rounded">
              <p className="font-bold text-sm md:text-base">⚠️ Oops! That doesn't go there. Try a different bin.</p>
            </div>
          )}

          {/* Game content */}
          {!gameActive && !gameOver && !showReward && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🐟</div>
              <h3 className="text-2xl font-bold text-green-700 mb-2">Save the River!</h3>
              <p className="text-green-600 mb-4">
                "Oh no! The fish can't swim with this trash. Can you put the items in the right bins?"
              </p>
              <button
                onClick={startGame}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md"
              >
                Start Cleaning
              </button>
            </div>
          )}

          {gameOver && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">😢</div>
              <h3 className="text-2xl font-bold text-red-700 mb-2">Time's Up!</h3>
              <p className="text-red-600 mb-4">
                The river is still polluted. Try again to save the marine life!
              </p>
              <button
                onClick={resetGame}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md"
              >
                Try Again
              </button>
            </div>
          )}

          {showReward && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-green-700 mb-2">River Cleaned!</h3>
              <p className="text-green-600 mb-2">
                You've saved the river and helped the environment!
              </p>
              <p className="text-green-600 mb-4">
                Final Score: {score} | Time Bonus: {timeLeft * 5}
              </p>

              <div className="my-6">
                <div className="inline-block bg-yellow-100 rounded-full p-4 shadow-lg">
                  <span className="text-4xl">🏅</span>
                </div>
                <p className="text-amber-700 font-bold mt-2">EcoHero Badge Unlocked!</p>
              </div>

              <div className="fish-dance flex justify-center gap-4 text-3xl my-4">
                <span className="animate-bounce">🐟</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🐠</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🐡</span>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={resetGame}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105"
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
                    router.push("/story/animation/3");
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {gameActive && (
            <>
              {/* River Scene with Ocean Background */}
              <div
                ref={riverRef}
                className="relative rounded-lg p-4 mb-6 md:mb-8 h-64 border-2 border-blue-300 overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: "url('/images/ocean-bg.jpg')" }}
              >
                {/* Dam structure */}
                <div className="absolute right-0 top-0 h-full w-8 bg-gray-600 flex flex-col items-center justify-between py-2">
                  <div className="w-6 h-2 bg-gray-800"></div>
                  <div className="w-6 h-2 bg-gray-800"></div>
                  <div className="w-6 h-2 bg-gray-800"></div>
                </div>

                {/* Ducks */}
                <div className="absolute bottom-4 left-1/4 text-3xl">🦆</div>

                {/* Fish */}
                <div className="absolute bottom-10 left-1/2 text-2xl">🐟</div>
                <div className="absolute top-16 left-1/3 text-2xl">🐠</div>

                {/* Floating trash items - now static */}
                {riverItems.map(item => (
                  !sortedItems.includes(item.id) && (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      className="absolute cursor-move z-10 transition-transform duration-200 hover:scale-110"
                      style={{
                        left: `${item.position.x}%`,
                        top: `${item.position.y}%`,
                      }}
                    >
                      <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center shadow-lg text-2xl">
                        {item.icon}
                      </div>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white text-xs px-1 rounded whitespace-nowrap">
                        {item.name}
                      </div>
                    </div>
                  )
                ))}
              </div>

              {/* Recycling Bins */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 mb-4 md:mb-6">
                {bins.map(bin => (
                  <div
                    key={bin.type}
                    onDrop={(e) => handleDrop(e, bin.type)}
                    onDragOver={allowDrop}
                    className={`${bin.color} rounded-lg p-2 md:p-4 text-center min-h-32 flex flex-col items-center justify-end transition-all hover:opacity-90 border-2 border-gray-700 shadow-md relative`}
                  >
                    <div className="w-12 h-16 md:w-16 md:h-20 bg-gray-800 mb-2 rounded-t-lg flex items-center justify-center text-white text-xl md:text-2xl">
                      {bin.icon}
                    </div>
                    <h3 className="text-white font-bold text-sm md:text-lg mb-2">{bin.label}</h3>

                    {/* Items in Bin */}
                    <div className="flex flex-wrap justify-center gap-1 mt-2">
                      {sortedItems.map(itemId => {
                        const item = riverItems.find(i => i.id === itemId);
                        return item && item.type === bin.type ? (
                          <div key={itemId} className="w-6 h-6 rounded flex items-center justify-center bg-white shadow-sm text-xs">
                            {item.icon}
                          </div>
                        ) : null;
                      })}
                    </div>

                    {/* Drop hint */}
                    <div className="absolute inset-0 bg-green-500 bg-opacity-50 flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="text-white font-bold text-lg">Drop here</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center text-gray-600 text-sm md:text-base">
                <p>Drag the items to the correct bins to clean the river</p>
              </div>
            </>
          )}
        </div>

        {/* Educational Content */}
        <div className="bg-yellow-50 rounded-xl p-4 md:p-6 border border-yellow-200 mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-bold text-yellow-800 mb-2 flex items-center">
            <span className="mr-2">🌍</span> Did You Know?
          </h3>
          <p className="text-yellow-700 text-sm md:text-base">
            Plastic pollution in rivers and oceans harms over 600 marine species. By properly sorting trash,
            you're helping to protect aquatic life and keep our waterways clean
          </p>
        </div>

        {/* Game Tips */}
        <div className="bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-200">
          <h3 className="text-base md:text-lg font-bold text-blue-800 mb-2 flex items-center">
            <span className="mr-2">💡</span> Recycling Tips
          </h3>
          <ul className="list-disc pl-5 text-blue-700 text-sm md:text-base">
            <li>Rinse containers before recycling to avoid contamination</li>
            <li>Check local recycling guidelines as rules vary by location</li>
            <li>When in doubt, find out! Don't wishcycle</li>
            <li>Flatten cardboard boxes to save space in recycling bins</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RiverRescueGame;