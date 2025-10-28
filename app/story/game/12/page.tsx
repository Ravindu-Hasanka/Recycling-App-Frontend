'use client';

import { getStoryByTitle, updateProgress } from '@/app/api/story-api';
import { Story } from '@/app/types/story';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface FestivalItem {
  id: number;
  type: 'plastic' | 'paper' | 'glass' | 'organic' | 'metal' | 'electronic';
  name: string;
  image: string;
  description: string;
  points: number;
}

interface Bin {
  type: 'plastic' | 'paper' | 'glass' | 'organic' | 'metal' | 'electronic';
  label: string;
  color: string;
  icon: string;
  accepts: string[];
  description: string;
}

const GrandCelebrationGame = () => {
  // Game state
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [itemsSorted, setItemsSorted] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentItem, setCurrentItem] = useState<FestivalItem | null>(null);
  const [litterbugActive, setLitterbugActive] = useState(false);
  const [celebrationMode, setCelebrationMode] = useState(false);

  // Festival items data
  const [festivalItems] = useState<FestivalItem[]>([
    { id: 1, type: 'plastic', name: 'Water Bottle', image: '/images/trash/water-bottle.png', description: 'PET plastic container', points: 10 },
    { id: 2, type: 'paper', name: 'Food Container', image: '/images/trash/plastic-container.png', description: 'Paper food tray', points: 10 },
    { id: 3, type: 'glass', name: 'Glass Bottle', image: '/images/trash/glass-bottle.png', description: 'Glass beverage container', points: 15 },
    { id: 4, type: 'organic', name: 'Fruit Scraps', image: '/images/trash/fruit-peel.png', description: 'Leftover fruit waste', points: 8 },
    { id: 5, type: 'metal', name: 'Soda Can', image: '/images/trash/soda-can.png', description: 'Aluminum beverage can', points: 12 },
    { id: 6, type: 'electronic', name: 'Batteries', image: '/images/trash/battery.png', description: 'Used batteries', points: 20 },
    { id: 7, type: 'plastic', name: 'Chip Bag', image: '/images/trash/chip-bag.png', description: 'Plastic snack packaging', points: 10 },
    { id: 8, type: 'paper', name: 'Cardboard', image: '/images/trash/cardboard.png', description: 'Corrugated cardboard', points: 10 },
    { id: 9, type: 'glass', name: 'Jam Jar', image: '/images/trash/glass-jar.png', description: 'Glass food jar', points: 15 },
    { id: 10, type: 'organic', name: 'Compostable Plate', image: '/images/trash/compostable-plate.png', description: 'Plant-based plate', points: 8 },
    { id: 11, type: 'metal', name: 'Foil Wrap', image: '/images/trash/aluminum-foil.png', description: 'Aluminum foil', points: 12 },
    { id: 12, type: 'electronic', name: 'Old Phone', image: '/images/trash/old-phone.png', description: 'Broken electronic device', points: 20 },
  ]);

  // Bin data
  const [bins] = useState<Bin[]>([
    { type: 'plastic', label: 'Plastic', color: 'bg-blue-600', icon: '♳', accepts: ['plastic'], description: 'Bottles, containers, packaging' },
    { type: 'paper', label: 'Paper', color: 'bg-green-600', icon: '📄', accepts: ['paper'], description: 'Cardboard, paper, trays' },
    { type: 'glass', label: 'Glass', color: 'bg-yellow-600', icon: '🥃', accepts: ['glass'], description: 'Bottles, jars' },
    { type: 'organic', label: 'Food Waste', color: 'bg-amber-700', icon: '🍃', accepts: ['organic'], description: 'Food waste, compostables' },
    { type: 'metal', label: 'Metal', color: 'bg-gray-600', icon: '🥫', accepts: ['metal'], description: 'Cans, foil, metal items' },
    { type: 'electronic', label: 'E-Waste', color: 'bg-purple-600', icon: '📱', accepts: ['electronic'], description: 'Electronics, batteries' },
  ]);

  // Items that have been sorted
  const [sortedItems, setSortedItems] = useState<number[]>([]);
  const [unsortedItems, setUnsortedItems] = useState<FestivalItem[]>([]);
  const [litterbugItems, setLitterbugItems] = useState<FestivalItem[]>([]);

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

  // Initialize game
  useEffect(() => {
    if (gameActive) {
      setTimeLeft(120);
      setScore(0);
      setItemsSorted(0);
      setSortedItems([]);
      setUnsortedItems([...festivalItems]);
      setLitterbugItems([]);
      setGameOver(false);
      setShowReward(false);
      setCurrentItem(null);
      setLitterbugActive(false);
      setCelebrationMode(false);
    }
  }, [gameActive, festivalItems]);

  // Game timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let litterbugTimer: NodeJS.Timeout;

    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);

        // Activate Litterbug at certain intervals
        if (timeLeft % 30 === 0 && !litterbugActive) {
          setLitterbugActive(true);
          // Add extra items from Litterbug
          const extraItems = [...festivalItems]
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(item => ({ ...item, id: item.id + 100 })); // Make unique IDs

          setLitterbugItems(extraItems);
          setUnsortedItems(prev => [...prev, ...extraItems]);

          // Deactivate Litterbug after a while
          setTimeout(() => {
            setLitterbugActive(false);
            setLitterbugItems([]);
          }, 10000);
        }
      }, 1000);
    } else if (timeLeft <= 0 && gameActive) {
      setGameActive(false);
      setGameOver(true);
    }

    return () => {
      clearInterval(timer);
    };
  }, [gameActive, timeLeft, litterbugActive, festivalItems]);

  // Check if all items are sorted
  useEffect(() => {
    if (itemsSorted === festivalItems.length + litterbugItems.length && gameActive) {
      setGameActive(false);
      setShowReward(true);
      setCelebrationMode(true);
      // Bonus points for time left
      setScore(prev => prev + timeLeft * 5);
    }
  }, [itemsSorted, gameActive, timeLeft, festivalItems.length, litterbugItems.length]);

  // Start the game
  const startGame = () => {
    setGameActive(true);
  };

  // Reset the game
  const resetGame = () => {
    setGameActive(false);
    setGameOver(false);
    setShowReward(false);
    setCelebrationMode(false);
  };

  // Handle item selection
  const handleItemSelect = (item: FestivalItem) => {
    setCurrentItem(item);
  };

  // Handle item drop
  const handleDrop = (e: React.DragEvent, binType: string) => {
    e.preventDefault();
    if (!currentItem) return;

    if (currentItem.type === binType) {
      // Correct bin - add to score
      setScore(prev => prev + currentItem.points);
      setItemsSorted(prev => prev + 1);
      setSortedItems(prev => [...prev, currentItem.id]);
      setUnsortedItems(prev => prev.filter(item => item.id !== currentItem.id));
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
  const handleDragStart = (e: React.DragEvent, item: FestivalItem) => {
    e.dataTransfer.setData('text/plain', item.id.toString());
    setCurrentItem(item);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-4 md:p-6 relative overflow-hidden">
      {/* Celebration elements - only show during celebration */}
      {celebrationMode && (
        <>
          {/* Confetti */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute text-2xl animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                  color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 6)]
                }}
              >
                {['🎉', '🎊', '✨', '🌟', '⭐', '🎈'][Math.floor(Math.random() * 6)]}
              </div>
            ))}
          </div>

          {/* Fireworks */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 rounded-full animate-firework"
                style={{
                  left: `${10 + (i * 10)}%`,
                  animationDelay: `${i * 0.5}s`,
                  backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 6)]
                }}
              ></div>
            ))}
          </div>
        </>
      )}

      {/* Background elements - festival theme */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-5 text-4xl opacity-20">🎪</div>
        <div className="absolute top-20 right-10 text-4xl opacity-20">🎡</div>
        <div className="absolute bottom-20 left-20 text-4xl opacity-20">🎢</div>
        <div className="absolute bottom-10 right-20 text-4xl opacity-20">🎠</div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-800 mb-2">Grand EcoFestival</h1>
          <p className="text-sm md:text-lg text-purple-600">
            The final challenge to become a Super EcoHero!
          </p>

          <div className="flex justify-center items-center mt-4 gap-4 md:gap-6">
            <div className="bg-white rounded-full px-3 py-1 md:px-4 md:py-2 shadow-md flex items-center">
              <span className="text-lg mr-1">⭐</span>
              <span className="font-bold text-purple-700">Score: {score}</span>
            </div>
            <div className="bg-white rounded-full px-3 py-1 md:px-4 md:py-2 shadow-md flex items-center">
              <span className="text-lg mr-1">⏱️</span>
              <span className="font-bold text-red-700">Time: {timeLeft}s</span>
            </div>
            <div className="bg-white rounded-full px-3 py-1 md:px-4 md:py-2 shadow-md flex items-center">
              <span className="text-lg mr-1">✅</span>
              <span className="font-bold text-purple-700">
                Sorted: {itemsSorted}/{festivalItems.length + litterbugItems.length}
              </span>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
          {/* Game instructions */}
          <div className="flex items-center mb-4 md:mb-6">
            <div className="bg-purple-100 rounded-full p-2 md:p-3 mr-3 md:mr-4">
              <span className="text-2xl md:text-3xl">🎪</span>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-purple-800">Final Challenge</h2>
              <p className="text-sm md:text-base text-purple-600">
                "Oh no! Litterbug is back! Can you help me sort all this trash to stop him?"
              </p>
            </div>
          </div>

          {showHint && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 md:p-4 mb-4 md:mb-6 animate-pulse rounded">
              <p className="font-bold text-sm md:text-base">⚠️ That's not the right bin! Try again.</p>
            </div>
          )}

          {/* Litterbug warning */}
          {litterbugActive && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 md:p-4 mb-4 md:mb-6 animate-pulse rounded">
              <p className="font-bold text-sm md:text-base">🚨 Litterbug is here! He's adding more trash to sort!</p>
            </div>
          )}

          {/* Game content */}
          {!gameActive && !gameOver && !showReward && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎪</div>
              <h3 className="text-2xl font-bold text-purple-700 mb-2">Final Showdown!</h3>
              <p className="text-purple-600 mb-4">
                Stop Litterbug one last time by sorting all the festival trash correctly!
              </p>
              <button
                onClick={startGame}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md"
              >
                Start Challenge
              </button>
            </div>
          )}

          {gameOver && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">😢</div>
              <h3 className="text-2xl font-bold text-red-700 mb-2">Time's Up!</h3>
              <p className="text-red-600 mb-4">
                Litterbug got away! Try again to become a Super EcoHero!
              </p>
              <button
                onClick={resetGame}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md"
              >
                Try Again
              </button>
            </div>
          )}

          {showReward && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-purple-700 mb-2">You Did It!</h3>
              <p className="text-purple-600 mb-2">
                You've defeated Litterbug and saved the EcoFestival!
              </p>
              <p className="text-purple-600 mb-4">
                Final Score: {score} | Time Bonus: {timeLeft * 5}
              </p>

              <div className="my-6">
                <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 shadow-lg">
                  <span className="text-4xl">🦸</span>
                </div>
                <p className="text-purple-700 font-bold mt-2">Super EcoHero Achieved!</p>
              </div>

              <div className="celebration-animals flex justify-center gap-4 text-3xl my-4">
                <span className="animate-bounce">🐢</span>
                <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🐟</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🐇</span>
                <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>🐦</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🦊</span>
              </div>

              <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
                <p className="text-amber-700 font-bold">
                  Congratulations! You've completed all recycling challenges!
                </p>
                <p className="text-amber-700">You're now a certified Super EcoHero!</p>
              </div>

              {/* Go Home Button */}
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
                  router.push("/");
                }}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md"
              >
                Go Home
              </button>
            </div>
          )}


          {gameActive && (
            <>
              {/* Festival Scene */}
              <div
                className="relative rounded-lg p-4 mb-6 md:mb-8 h-64 border-2 border-purple-300 overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: "url('/images/carnival-bg.jpg')" }}
              >
                {/* Trash items */}
                <div className="absolute top-10 left-0 right-0 flex flex-wrap justify-center gap-4">
                  {unsortedItems.map(item => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onClick={() => handleItemSelect(item)}
                      className={`cursor-move z-10 transition-transform duration-200 hover:scale-110 bg-white p-2 rounded-lg shadow-lg ${currentItem?.id === item.id ? 'ring-4 ring-purple-500' : ''} ${litterbugItems.some(li => li.id === item.id) ? 'border-2 border-red-500 animate-pulse' : ''}`}
                    >
                      <div className="w-12 h-12 flex items-center justify-center text-2xl">
                        {item.image ? (<img src={item.image} alt={item.name} className="max-w-full max-h-full" />) : (
                          item.type === 'plastic' ? '🥤' :
                            item.type === 'paper' ? '📦' :
                              item.type === 'glass' ? '🥃' :
                                item.type === 'organic' ? '🍌' :
                                  item.type === 'metal' ? '🥫' : '📱'
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
                    <p className="text-sm font-bold text-center">Selected:</p>
                    <p className="text-lg font-bold text-center">{currentItem.name}</p>
                    <p className="text-xs text-center text-gray-600">{currentItem.description}</p>
                    <p className="text-xs text-center mt-2">Drag to the correct bin</p>
                  </div>
                )}
              </div>

              {/* Instruction */}
              <div className="text-center text-purple-700 font-bold mb-4">
                <p>Drag items to the correct bins before time runs out!</p>
                {litterbugActive && (
                  <p className="text-red-600 text-sm">Watch out for Litterbug's trash!</p>
                )}
              </div>

              {/* Bins */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-4 mb-4 md:mb-6">
                {bins.map(bin => (
                  <div
                    key={bin.type}
                    onDrop={(e) => handleDrop(e, bin.type)}
                    onDragOver={allowDrop}
                    className={`${bin.color} rounded-lg p-2 text-center min-h-32 flex flex-col items-center justify-end transition-all hover:opacity-90 border-2 border-gray-700 shadow-md relative cursor-pointer`}
                  >
                    <div className="w-10 h-14 md:w-12 md:h-16 bg-gray-800 mb-2 rounded-t-lg flex items-center justify-center text-white text-xl md:text-2xl">
                      {bin.icon}
                    </div>
                    <h3 className="text-white font-bold text-xs mb-1">{bin.label}</h3>

                    {/* Items in Bin */}
                    <div className="flex flex-wrap justify-center gap-1 mt-2">
                      {sortedItems.map(itemId => {
                        const item = [...festivalItems, ...litterbugItems].find(i => i.id === itemId);
                        return item && item.type === bin.type ? (
                          <div key={itemId} className="w-4 h-4 rounded flex items-center justify-center bg-white shadow-sm text-xs">
                            {item.type === 'plastic' ? '🥤' :
                              item.type === 'paper' ? '📦' :
                                item.type === 'glass' ? '🥃' :
                                  item.type === 'organic' ? '🍌' :
                                    item.type === 'metal' ? '🥫' : '📱'}
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
        <div className="bg-green-50 rounded-xl p-4 md:p-6 border border-green-200 mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-bold text-green-800 mb-2 flex items-center">
            <span className="mr-2">🌍</span> Festival Waste Facts
          </h3>
          <p className="text-green-700 text-sm md:text-base">
            Large events like festivals can generate massive amounts of waste. Proper sorting and recycling
            at events helps reduce landfill waste and sets a great example for sustainable event management!
          </p>
        </div>

        {/* Celebration Tips */}
        <div className="bg-purple-50 rounded-xl p-4 md:p-6 border border-purple-200">
          <h3 className="text-base md:text-lg font-bold text-purple-800 mb-2 flex items-center">
            <span className="mr-2">💡</span> Eco-Friendly Event Tips
          </h3>
          <ul className="list-disc pl-5 text-purple-700 text-sm md:text-base">
            <li>Use reusable plates, cups, and utensils at events</li>
            <li>Set up clearly labeled recycling stations</li>
            <li>Choose products with minimal packaging</li>
            <li>Educate attendees about proper waste sorting</li>
            <li>Partner with local recycling organizations</li>
          </ul>
        </div>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes confetti {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
        
        @keyframes firework {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(20); opacity: 0.5; }
          100% { transform: scale(40); opacity: 0; }
        }
        .animate-firework {
          animation: firework 2s ease-out forwards;
        }
        
        .bg-festival-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 L100,0 L100,100 L0,100 Z' fill='none'/%3E%3Ccircle cx='20' cy='20' r='2' fill='%23ff0000'/%3E%3Ccircle cx='40' cy='30' r='2' fill='%2300ff00'/%3E%3Ccircle cx='60' cy='40' r='2' fill='%230000ff'/%3E%3Ccircle cx='80' cy='50' r='2' fill='%23ffff00'/%3E%3Ccircle cx='30' cy='70' r='2' fill='%23ff00ff'/%3E%3Ccircle cx='50' cy='80' r='2' fill='%2300ffff'/%3E%3Ccircle cx='70' cy='20' r='2' fill='%23ff6600'/%3E%3Ccircle cx='90' cy='90' r='2' fill='%236600ff'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }
      `}</style>
    </div>
  );
};

export default GrandCelebrationGame;