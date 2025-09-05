'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface MarketItem {
  id: number;
  type: 'organic' | 'recyclable';
  name: string;
  image: string;
  description: string;
}

interface Bin {
  type: 'organic' | 'recyclable';
  label: string;
  color: string;
  icon: string;
  accepts: string[];
}

const MarketMysteryGame = () => {
  // Game state
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [itemsSorted, setItemsSorted] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentItem, setCurrentItem] = useState<MarketItem | null>(null);
  const router = useRouter();

  // Market items data with realistic images
  const [marketItems] = useState<MarketItem[]>([
    { id: 1, type: 'organic', name: 'Banana Peel', image: '/images/trash/fruit-peel.png', description: 'Fruit waste' },
    { id: 2, type: 'recyclable', name: 'Plastic Bottle', image: '/images/trash/plastic-bottle.png', description: 'PET plastic' },
    { id: 3, type: 'organic', name: 'Apple Core', image: '/images/trash/apple-core.png', description: 'Fruit waste' },
    { id: 4, type: 'recyclable', name: 'Glass Jar', image: '/images/trash/glass-jar.png', description: 'Clear glass' },
    { id: 5, type: 'organic', name: 'Vegetable Scraps', image: '/images/trash/vegetable-scraps.png', description: 'Food waste' },
    { id: 6, type: 'recyclable', name: 'Cardboard Box', image: '/images/trash/cardboard.png', description: 'Corrugated cardboard' },
    { id: 7, type: 'organic', name: 'Egg Shells', image: '/images/trash/egg-shells.png', description: 'Food waste' },
    { id: 8, type: 'recyclable', name: 'Aluminum Can', image: '/images/trash/soda-can.png', description: 'Metal container' },
  ]);

  // Bin data
  const [bins] = useState<Bin[]>([
    { type: 'organic', label: 'Compost', color: 'bg-amber-700', icon: '🍃', accepts: ['organic'] },
    { type: 'recyclable', label: 'Recycling', color: 'bg-blue-500', icon: '♻️', accepts: ['recyclable'] },
  ]);

  // Items that have been sorted
  const [sortedItems, setSortedItems] = useState<number[]>([]);
  const [unsortedItems, setUnsortedItems] = useState<MarketItem[]>([]);

  // Initialize game
  useEffect(() => {
    if (gameActive) {
      setTimeLeft(60);
      setScore(0);
      setItemsSorted(0);
      setSortedItems([]);
      setUnsortedItems([...marketItems]);
      setGameOver(false);
      setShowReward(false);
      setCurrentItem(null);
    }
  }, [gameActive, marketItems]);

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
    if (itemsSorted === marketItems.length && gameActive) {
      setGameActive(false);
      setShowReward(true);
      // Bonus points for time left
      setScore(prev => prev + timeLeft * 5);
    }
  }, [itemsSorted, gameActive, timeLeft, marketItems.length]);

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
  const handleItemSelect = (item: MarketItem) => {
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
  const handleDragStart = (e: React.DragEvent, item: MarketItem) => {
    e.dataTransfer.setData('text/plain', item.id.toString());
    setCurrentItem(item);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 to-orange-100 p-4 md:p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-5 text-4xl opacity-20">🛒</div>
        <div className="absolute top-20 right-10 text-4xl opacity-20">🥦</div>
        <div className="absolute bottom-20 left-20 text-4xl opacity-20">🍎</div>
        <div className="absolute bottom-10 right-20 text-4xl opacity-20">🥕</div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-orange-800 mb-2">Market Mystery</h1>
          <p className="text-sm md:text-lg text-orange-600">
            Help vendors separate organic waste from recyclables!
          </p>
          
          <div className="flex justify-center items-center mt-4 gap-4 md:gap-6">
            <div className="bg-white rounded-full px-3 py-1 md:px-4 md:py-2 shadow-md flex items-center">
              <span className="text-lg mr-1">⭐</span>
              <span className="font-bold text-orange-700">Score: {score}</span>
            </div>
            <div className="bg-white rounded-full px-3 py-1 md:px-4 md:py-2 shadow-md flex items-center">
              <span className="text-lg mr-1">⏱️</span>
              <span className="font-bold text-blue-700">Time: {timeLeft}s</span>
            </div>
            <div className="bg-white rounded-full px-3 py-1 md:px-4 md:py-2 shadow-md flex items-center">
              <span className="text-lg mr-1">✅</span>
              <span className="font-bold text-purple-700">
                Sorted: {itemsSorted}/{marketItems.length}
              </span>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
          {/* Game instructions */}
          <div className="flex items-center mb-4 md:mb-6">
            <div className="bg-orange-100 rounded-full p-2 md:p-3 mr-3 md:mr-4">
              <span className="text-2xl md:text-3xl">🛒</span>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-orange-800">Market Cleanup</h2>
              <p className="text-sm md:text-base text-orange-600">
                "Where should we put this banana peel? Compost or recycling bin?"
              </p>
            </div>
          </div>

          {showHint && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 md:p-4 mb-4 md:mb-6 animate-pulse rounded">
              <p className="font-bold text-sm md:text-base">⚠️ Oops! That doesn't go there. Try the other bin.</p>
            </div>
          )}

          {/* Game content */}
          {!gameActive && !gameOver && !showReward && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🛒</div>
              <h3 className="text-2xl font-bold text-orange-700 mb-2">Market Mystery!</h3>
              <p className="text-orange-600 mb-4">
                Help the vendors sort their waste correctly to keep the market clean!
              </p>
              <button
                onClick={startGame}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md"
              >
                Start Sorting
              </button>
            </div>
          )}

          {gameOver && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">😢</div>
              <h3 className="text-2xl font-bold text-red-700 mb-2">Time's Up!</h3>
              <p className="text-red-600 mb-4">
                The market is still messy. Try again to help the vendors!
              </p>
              <button
                onClick={resetGame}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md"
              >
                Try Again
              </button>
            </div>
          )}

          {showReward && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-orange-700 mb-2">Market Cleaned!</h3>
              <p className="text-orange-600 mb-2">
                You've helped the vendors sort their waste correctly!
              </p>
              <p className="text-orange-600 mb-4">
                Final Score: {score} | Time Bonus: {timeLeft * 5}
              </p>
              
              <div className="my-6">
                <div className="inline-block bg-orange-100 rounded-full p-4 shadow-lg">
                  <span className="text-4xl">🛍️</span>
                </div>
                <p className="text-orange-700 font-bold mt-2">Eco-Basket Unlocked!</p>
              </div>
              
              <div className="market-celebration flex justify-center gap-4 text-3xl my-4">
                <span className="animate-bounce">✨</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>✨</span>
              </div>
              
              <div className="flex justify-center gap-4">
              <button
                onClick={resetGame}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md mt-4"
              >
                Play Again
              </button>
              <button
                onClick={() => router.push('/story/animation/7')}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md mt-4"
              >
                Continue
              </button>
              </div>
            </div>
          )}

          {gameActive && (
            <>
              {/* Market Scene */}
              <div 
                className="relative rounded-lg p-4 mb-6 md:mb-8 h-64 border-2 border-orange-300 overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: "url('/images/market-background.jpg')" }}
              >                
                {/* Mixed waste items */}
                <div className="absolute top-4 left-0 right-0 flex justify-center gap-4">
                  {unsortedItems.map(item => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onClick={() => handleItemSelect(item)}
                      className={`cursor-move z-10 transition-transform duration-200 hover:scale-110 bg-white p-2 rounded-lg shadow-lg ${currentItem?.id === item.id ? 'ring-4 ring-orange-500' : ''}`}
                    >
                      <div className="w-12 h-12 flex items-center justify-center text-2xl">
                        {/* Display appropriate emoji based on item type */}
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        ) : (
                          item.type === 'organic' ? '🍌' : '♻️'
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
              <div className="text-center text-orange-700 font-bold mb-4">
                <p>Drag items to the correct bin or click to select then click on a bin</p>
              </div>

              {/* Bins */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-4 md:mb-6">
                {bins.map(bin => (
                  <div
                    key={bin.type}
                    onClick={() => currentItem && handleDrop({ preventDefault: () => {} } as React.DragEvent, bin.type)}
                    onDrop={(e) => handleDrop(e, bin.type)}
                    onDragOver={allowDrop}
                    className={`${bin.color} rounded-lg p-4 md:p-6 text-center min-h-40 flex flex-col items-center justify-end transition-all hover:opacity-90 border-2 border-gray-700 shadow-md relative cursor-pointer`}
                  >
                    <div className="w-16 h-20 md:w-20 md:h-24 bg-gray-800 mb-2 rounded-t-lg flex items-center justify-center text-white text-2xl md:text-3xl">
                      {bin.icon}
                    </div>
                    <h3 className="text-white font-bold text-lg md:text-xl mb-2">{bin.label}</h3>
                    
                    {/* Items in Bin */}
                    <div className="flex flex-wrap justify-center gap-1 mt-2">
                      {sortedItems.map(itemId => {
                        const item = marketItems.find(i => i.id === itemId);
                        return item && item.type === bin.type ? (
                          <div key={itemId} className="w-6 h-6 rounded flex items-center justify-center bg-white shadow-sm text-xs">
                            {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        ) : (
                          item.type === 'organic' ? '🍌' : '♻️'
                        )}
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
            </>
          )}
        </div>

        {/* Educational Content */}
        <div className="bg-amber-50 rounded-xl p-4 md:p-6 border border-amber-200 mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-bold text-amber-800 mb-2 flex items-center">
            <span className="mr-2">🌱</span> Composting Facts
          </h3>
          <p className="text-amber-700 text-sm md:text-base">
            Organic waste in landfills produces methane, a potent greenhouse gas. 
            Composting instead reduces emissions and creates nutrient-rich soil for gardens!
          </p>
        </div>

        {/* Recycling Tips */}
        <div className="bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-200">
          <h3 className="text-base md:text-lg font-bold text-blue-800 mb-2 flex items-center">
            <span className="mr-2">💡</span> Market Waste Tips
          </h3>
          <ul className="list-disc pl-5 text-blue-700 text-sm md:text-base">
            <li>Many markets now offer composting options for food waste</li>
            <li>Cardboard boxes from produce can often be recycled</li>
            <li>Clean plastic containers before recycling them</li>
            <li>Ask vendors about their waste management practices</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MarketMysteryGame;