'use client';

import { getStoryByTitle, updateProgress } from '@/app/api/story-api';
import { Story } from '@/app/types/story';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface FarmItem {
  id: number;
  type: 'hazardous' | 'recyclable' | 'compost' | 'trash';
  name: string;
  image: string;
  description: string;
  isHazardous: boolean;
}

interface Bin {
  type: 'hazardous' | 'recyclable' | 'compost' | 'trash';
  label: string;
  color: string;
  icon: string;
  accepts: string[];
  description: string;
}

const FarmyardFixGame = () => {
  // Game state
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [itemsSorted, setItemsSorted] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentItem, setCurrentItem] = useState<FarmItem | null>(null);
  const [cropHealth, setCropHealth] = useState(100); // Percentage of crop health
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

  // Farm items data with realistic images
  const [farmItems] = useState<FarmItem[]>([
    { id: 1, type: 'hazardous', name: 'Old Battery', image: '/images/trash/battery.png', description: 'Contains toxic chemicals', isHazardous: true },
    { id: 2, type: 'recyclable', name: 'Plastic Container', image: '/images/trash/plastic-container.png', description: 'Clean plastic #2', isHazardous: false },
    { id: 3, type: 'hazardous', name: 'Pesticide Bottle', image: '/images/trash/pesticide.png', description: 'Chemical container', isHazardous: true },
    { id: 4, type: 'compost', name: 'Vegetable Scraps', image: '/images/trash/vegetable-scraps.png', description: 'Food waste', isHazardous: false },
    { id: 5, type: 'hazardous', name: 'Electronic Waste', image: '/images/trash/e-waste.png', description: 'Old phone with toxic components', isHazardous: true },
    { id: 6, type: 'recyclable', name: 'Glass Jar', image: '/images/trash/glass-jar.png', description: 'Clean glass container', isHazardous: false },
    { id: 7, type: 'trash', name: 'Chip Bag', image: '/images/trash/chip-bag.png', description: 'Mixed material packaging', isHazardous: false },
    { id: 8, type: 'hazardous', name: 'Fluorescent Bulb', image: '/images/trash/lightbulb.png', description: 'Contains mercury', isHazardous: true },
  ]);

  // Bin data
  const [bins] = useState<Bin[]>([
    { type: 'hazardous', label: 'Hazardous Waste', color: 'bg-red-600', icon: '⚠️', accepts: ['hazardous'], description: 'Batteries, chemicals, electronics' },
    { type: 'recyclable', label: 'Recycling', color: 'bg-blue-500', icon: '♻️', accepts: ['recyclable'], description: 'Clean plastics, glass, paper' },
    { type: 'compost', label: 'Compost', color: 'bg-amber-700', icon: '🍃', accepts: ['compost'], description: 'Food scraps, yard waste' },
    { type: 'trash', label: 'Landfill', color: 'bg-gray-500', icon: '🗑️', accepts: ['trash'], description: 'Non-recyclable materials' },
  ]);

  // Items that have been sorted
  const [sortedItems, setSortedItems] = useState<number[]>([]);
  const [unsortedItems, setUnsortedItems] = useState<FarmItem[]>([]);

  // Initialize game
  useEffect(() => {
    if (gameActive) {
      setTimeLeft(60);
      setScore(0);
      setItemsSorted(0);
      setSortedItems([]);
      setUnsortedItems([...farmItems]);
      setGameOver(false);
      setShowReward(false);
      setCurrentItem(null);
      setCropHealth(100);
    }
  }, [gameActive, farmItems]);

  // Game timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);

        // Decrease crop health over time to create urgency
        if (timeLeft % 5 === 0) {
          setCropHealth(prev => Math.max(0, prev - 5));
        }
      }, 1000);
    } else if (timeLeft <= 0 && gameActive) {
      setGameActive(false);
      setGameOver(true);
    }
    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  // Check if all items are sorted
  useEffect(() => {
    if (itemsSorted === farmItems.length && gameActive) {
      setGameActive(false);
      setShowReward(true);
      // Bonus points for time left and crop health
      setScore(prev => prev + timeLeft * 5 + cropHealth);
    }
  }, [itemsSorted, gameActive, timeLeft, farmItems.length, cropHealth]);

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

  // Handle item selection
  const handleItemSelect = (item: FarmItem) => {
    setCurrentItem(item);
  };

  // Handle item drop
  const handleDrop = (e: React.DragEvent, binType: string) => {
    e.preventDefault();
    if (!currentItem) return;

    if (currentItem.type === binType) {
      // Correct bin - add to score
      setScore(prev => prev + 10);
      setItemsSorted(prev => prev + 1);
      setSortedItems(prev => [...prev, currentItem.id]);
      setUnsortedItems(prev => prev.filter(item => item.id !== currentItem.id));
      setCurrentItem(null);

      // Improve crop health for correct sorting
      setCropHealth(prev => Math.min(100, prev + 10));
    } else {
      // Wrong bin - penalize and harm crops
      setShowHint(true);
      setScore(prev => Math.max(0, prev - 5));
      setCropHealth(prev => Math.max(0, prev - 15));
      setTimeout(() => setShowHint(false), 2000);
    }
  };

  // Allow drop
  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, item: FarmItem) => {
    e.dataTransfer.setData('text/plain', item.id.toString());
    setCurrentItem(item);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-amber-100 p-4 md:p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-5 text-4xl opacity-20">🌾</div>
        <div className="absolute top-20 right-10 text-4xl opacity-20">🚜</div>
        <div className="absolute bottom-20 left-20 text-4xl opacity-20">🐄</div>
        <div className="absolute bottom-10 right-20 text-4xl opacity-20">🐓</div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">Farmyard Fix</h1>
          <p className="text-sm md:text-lg text-green-600">
            Protect the farm from hazardous waste!
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
              <span className="text-lg mr-1">🌱</span>
              <span className="font-bold text-purple-700">
                Crop Health: {cropHealth}%
              </span>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
          {/* Game instructions */}
          <div className="flex items-center mb-4 md:mb-6">
            <div className="bg-green-100 rounded-full p-2 md:p-3 mr-3 md:mr-4">
              <span className="text-2xl md:text-3xl">🚜</span>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-green-800">Farm Cleanup</h2>
              <p className="text-sm md:text-base text-green-600">
                "Hmm… is this old battery safe for the farm? What should we do?"
              </p>
            </div>
          </div>

          {showHint && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 md:p-4 mb-4 md:mb-6 animate-pulse rounded">
              <p className="font-bold text-sm md:text-base">⚠️ That's not the right bin for this item! Try again.</p>
            </div>
          )}

          {/* Game content */}
          {!gameActive && !gameOver && !showReward && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🚜</div>
              <h3 className="text-2xl font-bold text-green-700 mb-2">Farmyard Fix!</h3>
              <p className="text-green-600 mb-4">
                Help identify hazardous waste and protect the farm crops!
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
                The farm is still contaminated. Try again to protect the crops!
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
              <h3 className="text-2xl font-bold text-green-700 mb-2">Farm Protected!</h3>
              <p className="text-green-600 mb-2">
                You've cleaned up the hazardous waste and saved the crops!
              </p>
              <p className="text-green-600 mb-4">
                Final Score: {score} | Crop Health: {cropHealth}%
              </p>

              <div className="my-6">
                <div className="inline-block bg-green-100 rounded-full p-4 shadow-lg">
                  <span className="text-4xl">🧤</span>
                </div>
                <p className="text-green-700 font-bold mt-2">Eco-Gloves Unlocked!</p>
              </div>

              <div className="farm-celebration flex justify-center gap-4 text-3xl my-4">
                <span className="animate-bounce">🌾</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🐄</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🐓</span>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={resetGame}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md mt-4"
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
                    router.push("/story/animation/8");
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md mt-4"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {gameActive && (
            <>
              {/* Farm Scene */}
              <div
                className="relative rounded-lg p-4 mb-6 md:mb-8 h-64 border-2 border-green-300 overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: "url('/images/farm-background.jpg')" }}
              >

                {/* Crop health indicator */}
                {/* <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded-lg">
                  <div className="w-32 h-4 bg-gray-300 rounded-full">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${cropHealth}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-1 text-black">Crop Health</p>
                </div> */}

                {/* Hazardous waste items */}
                <div className="absolute top-4 left-0 right-0 flex justify-center gap-4">
                  {unsortedItems.map(item => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onClick={() => handleItemSelect(item)}
                      className={`cursor-move z-10 transition-transform duration-200 hover:scale-110 bg-white p-2 rounded-lg shadow-lg ${currentItem?.id === item.id ? 'ring-4 ring-red-500' : ''} ${item.isHazardous ? 'border-2 border-red-500' : ''}`}
                    >
                      <div className="w-12 h-12 flex items-center justify-center text-2xl">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        ) : (
                          item.isHazardous ? '⚠️' : '♻️'
                        )}
                      </div>
                      <div className="text-xs text-center mt-1 bg-black bg-opacity-70 text-white px-1 rounded">
                        {item.name}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Current item indicator */}
                {currentItem && (
                  <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-lg">
                    <p className="text-sm font-bold text-center">Currently selected:</p>
                    <p className="text-lg font-bold text-center">{currentItem.name}</p>
                    <p className="text-xs text-center text-gray-600">{currentItem.description}</p>
                    {currentItem.isHazardous && (
                      <p className="text-xs text-center text-red-600 font-bold">⚠️ Hazardous Material</p>
                    )}
                  </div>
                )}
              </div>

              {/* Instruction */}
              <div className="text-center text-green-700 font-bold mb-4">
                <p>Drag items to the correct bin or click to select then click on a bin</p>
              </div>

              {/* Bins */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
                {bins.map(bin => (
                  <div
                    key={bin.type}
                    onClick={() => currentItem && handleDrop({ preventDefault: () => { } } as React.DragEvent, bin.type)}
                    onDrop={(e) => handleDrop(e, bin.type)}
                    onDragOver={allowDrop}
                    className={`${bin.color} rounded-lg p-3 text-center min-h-40 flex flex-col items-center justify-end transition-all hover:opacity-90 border-2 border-gray-700 shadow-md relative cursor-pointer`}
                  >
                    <div className="w-12 h-16 md:w-14 md:h-20 bg-gray-800 mb-2 rounded-t-lg flex items-center justify-center text-white text-xl md:text-2xl">
                      {bin.icon}
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1">{bin.label}</h3>
                    <p className="text-white text-xs opacity-80 mb-2">{bin.description}</p>

                    {/* Items in Bin */}
                    <div className="flex flex-wrap justify-center gap-1 mt-2">
                      {sortedItems.map(itemId => {
                        const item = farmItems.find(i => i.id === itemId);
                        return item && item.type === bin.type ? (
                          <div key={itemId} className="w-4 h-4 md:w-5 md:h-5 rounded flex items-center justify-center bg-white shadow-sm text-xs">
                            {item.isHazardous ? '⚠️' : '♻️'}
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
        <div className="bg-red-50 rounded-xl p-4 md:p-6 border border-red-200 mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-bold text-red-800 mb-2 flex items-center">
            <span className="mr-2">⚠️</span> Hazardous Waste Facts
          </h3>
          <p className="text-red-700 text-sm md:text-base">
            Electronic waste contains toxic substances like lead, mercury, and cadmium that can
            contaminate soil and water, harming crops and animals. Proper disposal protects our
            food supply and environment!
          </p>
        </div>

        {/* Recycling Tips */}
        <div className="bg-green-50 rounded-xl p-4 md:p-6 border border-green-200">
          <h3 className="text-base md:text-lg font-bold text-green-800 mb-2 flex items-center">
            <span className="mr-2">💡</span> Farm Waste Management Tips
          </h3>
          <ul className="list-disc pl-5 text-green-700 text-sm md:text-base">
            <li>Many communities have special collection days for hazardous waste</li>
            <li>Electronic stores often take back old electronics for recycling</li>
            <li>Battery recycling stations are available at many retailers</li>
            <li>Never burn hazardous waste as it releases toxic fumes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FarmyardFixGame;