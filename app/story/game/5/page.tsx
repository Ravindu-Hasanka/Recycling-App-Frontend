'use client';

import { getStoryByTitle, updateProgress } from '@/app/api/story-api';
import { Story } from '@/app/types/story';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface TrashItem {
  id: number;
  type: 'plastic' | 'paper' | 'glass' | 'organic' | 'metal';
  name: string;
  icon: string;
  image: string;
}

interface Bin {
  type: 'plastic' | 'paper' | 'glass' | 'organic' | 'metal';
  label: string;
  color: string;
  icon: string;
  accepts: string[];
}

const OceanAdventureGame = () => {
  // Game state
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [itemsSorted, setItemsSorted] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [turtleState, setTurtleState] = useState('trapped');
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

  // Trash items data with realistic images
  const [trashItems] = useState<TrashItem[]>([
    { id: 1, type: 'plastic', name: 'Plastic Bag', icon: '🛍️', image: '/images/trash/plastic-bag.png' },
    { id: 2, type: 'paper', name: 'Paper Cup', icon: '🥤', image: '/images/trash/paper-cup.png' },
    { id: 3, type: 'glass', name: 'Glass Bottle', icon: '🍾', image: '/images/trash/glass-bottle.png' },
    { id: 4, type: 'metal', name: 'Soda Can', icon: '🥫', image: '/images/trash/soda-can.png' },
    { id: 5, type: 'plastic', name: 'Water Bottle', icon: '💧', image: '/images/trash/water-bottle.png' },
    { id: 6, type: 'organic', name: 'Fruit Peel', icon: '🍌', image: '/images/trash/fruit-peel.png' },
  ]);

  // Bin data
  const [bins] = useState<Bin[]>([
    { type: 'plastic', label: 'Plastic', color: 'bg-blue-500', icon: '♳', accepts: ['plastic'] },
    { type: 'paper', label: 'Paper', color: 'bg-green-500', icon: '📄', accepts: ['paper'] },
    { type: 'glass', label: 'Glass', color: 'bg-yellow-500', icon: '🥃', accepts: ['glass'] },
    { type: 'organic', label: 'Compost', color: 'bg-amber-700', icon: '🍂', accepts: ['organic'] },
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
      setTurtleState('trapped');
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
      setTurtleState('trapped');
    }
    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  // Check if all items are sorted
  useEffect(() => {
    if (itemsSorted === trashItems.length && gameActive) {
      setGameActive(false);
      setShowReward(true);
      setTurtleState('free');
      // Bonus points for time left
      setScore(prev => prev + timeLeft * 5);

      // After a delay, show the turtle swimming free
      setTimeout(() => {
        setTurtleState('swimming');
      }, 2000);
    }
  }, [itemsSorted, gameActive, timeLeft, trashItems.length]);

  // Start the game
  const startGame = () => {
    setGameActive(true);
  };

  // Reset the game
  const resetGame = () => {
    setGameActive(false);
    setGameOver(false);
    setShowReward(false);
    setTurtleState('trapped');
  };

  // Handle item drop
  const handleDrop = (e: React.DragEvent, binType: string) => {
    e.preventDefault();
    const itemId = parseInt(e.dataTransfer.getData('text/plain'));
    const item = trashItems.find(item => item.id === itemId);

    if (item && item.type === binType) {
      // Correct bin - add to score and remove from available items
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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-4 md:p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-5 text-4xl opacity-20">🌴</div>
        <div className="absolute top-20 right-10 text-4xl opacity-20">🐚</div>
        <div className="absolute bottom-20 left-20 text-4xl opacity-20">🌊</div>
        <div className="absolute bottom-10 right-20 text-4xl opacity-20">🐠</div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">Ocean Adventure</h1>
          <p className="text-sm md:text-lg text-blue-600">
            Help free the sea animals by sorting the trash!
          </p>

          <div className="flex justify-center items-center mt-4 gap-4 md:gap-6">
            <div className="bg-white rounded-full px-3 py-1 md:px-4 md:py-2 shadow-md flex items-center">
              <span className="text-lg mr-1">⭐</span>
              <span className="font-bold text-blue-700">Score: {score}</span>
            </div>
            <div className="bg-white rounded-full px-3 py-1 md:px-4 md:py-2 shadow-md flex items-center">
              <span className="text-lg mr-1">⏱️</span>
              <span className="font-bold text-blue-700">Time: {timeLeft}s</span>
            </div>
            <div className="bg-white rounded-full px-3 py-1 md:px-4 md:py-2 shadow-md flex items-center">
              <span className="text-lg mr-1">✅</span>
              <span className="font-bold text-purple-700">
                Sorted: {itemsSorted}/{trashItems.length}
              </span>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
          {/* Game instructions */}
          <div className="flex items-center mb-4 md:mb-6">
            <div className="bg-blue-100 rounded-full p-2 md:p-3 mr-3 md:mr-4">
              <span className="text-2xl md:text-3xl">🌊</span>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-blue-800">Save the Turtles!</h2>
              <p className="text-sm md:text-base text-blue-600">
                "Quick! The turtle is stuck! Which bin does the plastic bag go in?"
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
              <div className="text-5xl mb-4">🐢</div>
              <h3 className="text-2xl font-bold text-blue-700 mb-2">Save the Ocean!</h3>
              <p className="text-blue-600 mb-4">
                Help free the turtles by sorting trash into the correct bins.
              </p>
              <button
                onClick={startGame}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md"
              >
                Start Rescue
              </button>
            </div>
          )}

          {gameOver && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">😢</div>
              <h3 className="text-2xl font-bold text-red-700 mb-2">Time's Up!</h3>
              <p className="text-red-600 mb-4">
                The turtle is still trapped. Try again to help the ocean animals!
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
              <h3 className="text-2xl font-bold text-blue-700 mb-2">Turtle Saved!</h3>
              <p className="text-blue-600 mb-2">
                You've freed the turtle and helped the ocean environment!
              </p>
              <p className="text-blue-600 mb-4">
                Final Score: {score} | Time Bonus: {timeLeft * 5}
              </p>

              <div className="my-6">
                <div className="inline-block bg-blue-100 rounded-full p-4 shadow-lg">
                  <span className="text-4xl">🔱</span>
                </div>
                <p className="text-blue-700 font-bold mt-2">Ocean Amulet Unlocked!</p>
              </div>

              <div className="turtle-swim flex justify-center gap-4 text-3xl my-4">
                <span className="animate-bounce">🐢</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🐢</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🐢</span>
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
                    router.push("/story/animation/6");
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
              {/* Ocean Scene with Turtle */}
              <div
                className="relative rounded-lg p-4 mb-6 md:mb-8 h-64 border-2 border-blue-300 overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: "url('/images/ocean-background.jpg')" }}
              >
                {/* Trapped turtle */}
                <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 text-5xl transition-all duration-1000 ${turtleState === 'trapped' ? 'animate-pulse' : ''}`}>
                  {turtleState === 'trapped' ? '🐢' : turtleState === 'free' ? '🐢' : '🐢'}
                </div>

                {/* Trash net */}
                {turtleState === 'trapped' && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-4xl text-red-500">
                    🕸️
                  </div>
                )}

                {/* Floating trash items */}
                <div className="absolute top-4 left-4 w-full h-48 flex flex-wrap justify-start items-start gap-4">
                  {trashItems.map(item => (
                    !sortedItems.includes(item.id) && (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        className="cursor-move z-10 transition-transform duration-200 hover:scale-110 bg-white p-2 rounded-lg shadow-lg"
                      >
                        <div className="w-12 h-12 flex items-center justify-center text-2xl">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                          ) : (
                            item.icon
                          )}
                        </div>
                        <div className="text-xs text-center mt-1 bg-black bg-opacity-70 text-white px-1 rounded">
                          {item.name}
                        </div>
                      </div>
                    )
                  ))}
                </div>
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
                        const item = trashItems.find(i => i.id === itemId);
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
                <p>Drag the trash items to the correct bins to free the turtle!</p>
              </div>
            </>
          )}
        </div>

        {/* Educational Content */}
        <div className="bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-200 mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-bold text-blue-800 mb-2 flex items-center">
            <span className="mr-2">🌊</span> Ocean Facts
          </h3>
          <p className="text-blue-700 text-sm md:text-base">
            Over 1 million marine animals die each year due to plastic debris in the ocean.
            By properly recycling, you're helping to protect sea turtles and other marine life!
          </p>
        </div>

        {/* Recycling Tips */}
        <div className="bg-green-50 rounded-xl p-4 md:p-6 border border-green-200">
          <h3 className="text-base md:text-lg font-bold text-green-800 mb-2 flex items-center">
            <span className="mr-2">💡</span> Recycling Tips for Ocean Health
          </h3>
          <ul className="list-disc pl-5 text-green-700 text-sm md:text-base">
            <li>Avoid single-use plastics whenever possible</li>
            <li>Participate in beach clean-up events</li>
            <li>Choose products with minimal packaging</li>
            <li>Properly dispose of fishing lines and nets to prevent "ghost fishing"</li>
          </ul>
        </div>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes swim {
          0% { transform: translateX(0) translateY(0) rotate(0deg); }
          25% { transform: translateX(10px) translateY(-5px) rotate(5deg); }
          50% { transform: translateX(0) translateY(0) rotate(0deg); }
          75% { transform: translateX(-10px) translateY(-5px) rotate(-5deg); }
          100% { transform: translateX(0) translateY(0) rotate(0deg); }
        }
        .turtle-swim span {
          animation: swim 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default OceanAdventureGame;