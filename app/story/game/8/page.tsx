'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface StreetItem {
  id: number;
  type: 'plastic' | 'paper' | 'glass' | 'organic' | 'general';
  name: string;
  image: string;
  description: string;
}

interface Bin {
  type: 'plastic' | 'paper' | 'glass' | 'organic' | 'general';
  label: string;
  color: string;
  icon: string;
  accepts: string[];
  description: string;
}

const CityStreetsGame = () => {
  // Game state
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [itemsSorted, setItemsSorted] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentItem, setCurrentItem] = useState<StreetItem | null>(null);
  const [streetCleanliness, setStreetCleanliness] = useState(0); // Percentage of cleanliness
  const router = useRouter();

  // Street items data with realistic images
  const [streetItems] = useState<StreetItem[]>([
    { id: 1, type: 'plastic', name: 'Water Bottle', image: '/images/trash/water-bottle.png', description: 'PET plastic container' },
    { id: 2, type: 'paper', name: 'Coffee Cup', image: '/images/trash/paper-cup.png', description: 'Paper cup with sleeve' },
    { id: 3, type: 'glass', name: 'Glass Bottle', image: '/images/trash/glass-bottle.png', description: 'Clear glass container' },
    { id: 4, type: 'organic', name: 'Food Wrapper', image: '/images/trash/food-wrapper.png', description: 'Compostable packaging' },
    { id: 5, type: 'general', name: 'Chip Bag', image: '/images/trash/chip-bag.png', description: 'Mixed material packaging' },
    { id: 6, type: 'plastic', name: 'Soda Bottle', image: '/images/trash/soda-can.png', description: 'PET plastic container' },
    { id: 7, type: 'paper', name: 'Newspaper', image: '/images/trash/newspaper.png', description: 'Newsprint paper' },
    { id: 8, type: 'glass', name: 'Jam Jar', image: '/images/trash/glass-jar.png', description: 'Glass food container' },
  ]);

  // Bin data
  const [bins] = useState<Bin[]>([
    { type: 'plastic', label: 'Plastic', color: 'bg-blue-500', icon: '♳', accepts: ['plastic'], description: 'Bottles, containers' },
    { type: 'paper', label: 'Paper', color: 'bg-green-500', icon: '📄', accepts: ['paper'], description: 'Cups, paper, cardboard' },
    { type: 'glass', label: 'Glass', color: 'bg-yellow-500', icon: '🥃', accepts: ['glass'], description: 'Bottles, jars' },
    { type: 'organic', label: 'Compost', color: 'bg-amber-700', icon: '🍃', accepts: ['organic'], description: 'Food waste' },
    { type: 'general', label: 'General Waste', color: 'bg-gray-500', icon: '🗑️', accepts: ['general'], description: 'Non-recyclables' },
  ]);

  // Items that have been sorted
  const [sortedItems, setSortedItems] = useState<number[]>([]);
  const [unsortedItems, setUnsortedItems] = useState<StreetItem[]>([]);
  const [vehicles, setVehicles] = useState<{ type: string, position: number }[]>([
    { type: '🚗', position: 10 },
    { type: '🚌', position: 40 },
    { type: '🚲', position: 70 },
  ]);

  // Initialize game
  useEffect(() => {
    if (gameActive) {
      setTimeLeft(60);
      setScore(0);
      setItemsSorted(0);
      setSortedItems([]);
      setUnsortedItems([...streetItems]);
      setGameOver(false);
      setShowReward(false);
      setCurrentItem(null);
      setStreetCleanliness(0);
    }
  }, [gameActive, streetItems]);

  // Game timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let vehicleTimer: NodeJS.Timeout;

    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      // Move vehicles
      vehicleTimer = setInterval(() => {
        setVehicles(prev => prev.map(v => ({
          ...v,
          position: (v.position + 5) % 100
        })));
      }, 500);
    } else if (timeLeft <= 0 && gameActive) {
      setGameActive(false);
      setGameOver(true);
    }

    return () => {
      clearInterval(timer);
      clearInterval(vehicleTimer);
    };
  }, [gameActive, timeLeft]);

  // Check if all items are sorted
  useEffect(() => {
    if (itemsSorted === streetItems.length && gameActive) {
      setGameActive(false);
      setShowReward(true);
      // Bonus points for time left
      setScore(prev => prev + timeLeft * 5);
    }
  }, [itemsSorted, gameActive, timeLeft, streetItems.length]);

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
  const handleItemSelect = (item: StreetItem) => {
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

      // Improve street cleanliness for correct sorting
      setStreetCleanliness(prev => Math.min(100, prev + (100 / streetItems.length)));
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
  const handleDragStart = (e: React.DragEvent, item: StreetItem) => {
    e.dataTransfer.setData('text/plain', item.id.toString());
    setCurrentItem(item);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-100 p-4 md:p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-5 text-4xl opacity-20">🏢</div>
        <div className="absolute top-20 right-10 text-4xl opacity-20">🏪</div>
        <div className="absolute bottom-20 left-20 text-4xl opacity-20">🏬</div>
        <div className="absolute bottom-10 right-20 text-4xl opacity-20">🏨</div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">City Streets Cleanup</h1>
          <p className="text-sm md:text-lg text-blue-600">
            Clean up the overflowing bins on the busy city streets!
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
              <span className="text-lg mr-1">✨</span>
              <span className="font-bold text-purple-700">
                Cleanliness: {Math.round(streetCleanliness)}%
              </span>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
          {/* Game instructions */}
          <div className="flex items-center mb-4 md:mb-6">
            <div className="bg-blue-100 rounded-full p-2 md:p-3 mr-3 md:mr-4">
              <span className="text-2xl md:text-3xl">🏙️</span>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-blue-800">Urban Cleanup</h2>
              <p className="text-sm md:text-base text-blue-600">
                "Should we leave trash on the road, or find the right bin?"
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
              <div className="text-5xl mb-4">🏙️</div>
              <h3 className="text-2xl font-bold text-blue-700 mb-2">City Streets Challenge!</h3>
              <p className="text-blue-600 mb-4">
                Help clean up the overflowing bins on the busy city streets!
              </p>
              <button
                onClick={startGame}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md"
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
                The streets are still messy. Try again to clean up the city!
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
              <h3 className="text-2xl font-bold text-blue-700 mb-2">City Cleaned!</h3>
              <p className="text-blue-600 mb-2">
                You've cleaned up the streets and made the city beautiful!
              </p>
              <p className="text-blue-600 mb-4">
                Final Score: {score} | Time Bonus: {timeLeft * 5}
              </p>

              <div className="my-6">
                <div className="inline-block bg-blue-100 rounded-full p-4 shadow-lg">
                  <span className="text-4xl">🧥</span>
                </div>
                <p className="text-blue-700 font-bold mt-2">Reflective Jacket Unlocked!</p>
              </div>

              <div className="city-celebration flex justify-center gap-4 text-3xl my-4">
                <span className="animate-bounce">✨</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>✨</span>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={resetGame}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md mt-4"
                >
                  Play Again
                </button>
                <button
                  onClick={() => router.push('/story/animation/9')}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md mt-4"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {gameActive && (
            <>
              {/* City Street Scene */}
              <div
                className="relative rounded-lg p-4 mb-6 md:mb-8 h-64 border-2 border-gray-300 overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: "url('/images/city-background.jpg')" }}
              >
                {/* Trash items on the street */}
                <div className="absolute top-12 left-0 right-0 flex justify-center gap-4">
                  {unsortedItems.map(item => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onClick={() => handleItemSelect(item)}
                      className={`cursor-move z-10 transition-transform duration-200 hover:scale-110 bg-white p-2 rounded-lg shadow-lg ${currentItem?.id === item.id ? 'ring-4 ring-blue-500' : ''}`}
                    >
                      <div className="w-12 h-12 flex items-center justify-center text-2xl">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        ) : (
                          '♻️'
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
                  </div>
                )}
              </div>

              {/* Instruction */}
              <div className="text-center text-blue-700 font-bold mb-4">
                <p>Drag items to the correct bin or click to select then click on a bin</p>
                <p className="text-sm text-red-600">Hurry! Time is running out!</p>
              </div>

              {/* Bins */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 mb-4 md:mb-6">
                {bins.map(bin => (
                  <div
                    key={bin.type}
                    onClick={() => currentItem && handleDrop({ preventDefault: () => { } } as React.DragEvent, bin.type)}
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
                        const item = streetItems.find(i => i.id === itemId);
                        return item && item.type === bin.type ? (
                          <div key={itemId} className="w-4 h-4 rounded flex items-center justify-center bg-white shadow-sm text-xs">
                            {item.type === 'plastic' ? '🥤' :
                              item.type === 'paper' ? '📄' :
                                item.type === 'glass' ? '🥃' :
                                  item.type === 'organic' ? '🍌' : '🗑️'}
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
            <span className="mr-2">🏙️</span> Urban Waste Facts
          </h3>
          <p className="text-blue-700 text-sm md:text-base">
            Cities generate massive amounts of waste daily. Proper sorting reduces landfill use,
            conserves resources, and keeps public spaces clean and safe for everyone!
          </p>
        </div>

        {/* Recycling Tips */}
        <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200">
          <h3 className="text-base md:text-lg font-bold text-gray-800 mb-2 flex items-center">
            <span className="mr-2">💡</span> City Recycling Tips
          </h3>
          <ul className="list-disc pl-5 text-gray-700 text-sm md:text-base">
            <li>Many cities have public recycling bins - use them correctly</li>
            <li>Carry a reusable water bottle to reduce plastic waste</li>
            <li>Participate in community clean-up events</li>
            <li>Report overflowing bins to your local city services</li>
          </ul>
        </div>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes move-vehicle {
          0% { transform: translateX(0); }
          100% { transform: translateX(100px); }
        }
        .animate-move-vehicle {
          animation: move-vehicle 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default CityStreetsGame;