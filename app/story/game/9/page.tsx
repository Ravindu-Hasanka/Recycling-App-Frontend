'use client';

import { getStoryByTitle, updateProgress } from '@/app/api/story-api';
import { Story } from '@/app/types/story';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface FactoryItem {
  id: number;
  type: 'plastic' | 'paper' | 'glass' | 'metal' | 'electronic';
  name: string;
  image: string;
  description: string;
}

interface Bin {
  type: 'plastic' | 'paper' | 'glass' | 'metal' | 'electronic';
  label: string;
  color: string;
  icon: string;
  accepts: string[];
  description: string;
}

const RecyclingFactoryGame = () => {
  // Game state
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [itemsSorted, setItemsSorted] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [machineStatus, setMachineStatus] = useState('running'); // running, jammed, optimal
  const [conveyorSpeed, setConveyorSpeed] = useState(1);

  // Factory items data with realistic images
  const [factoryItems] = useState<FactoryItem[]>([
    { id: 1, type: 'plastic', name: 'Water Bottle', image: '/images/trash/water-bottle.png', description: 'PET plastic container' },
    { id: 2, type: 'paper', name: 'Cardboard Box', image: '/images/trash/cardboard.png', description: 'Corrugated cardboard' },
    { id: 3, type: 'glass', name: 'Glass Jar', image: '/images/trash/glass-jar.png', description: 'Clear glass container' },
    { id: 4, type: 'metal', name: 'Aluminum Can', image: '/images/trash/soda-can.png', description: 'Beverage container' },
    { id: 5, type: 'electronic', name: 'Old Phone', image: '/images/trash/old-phone.png', description: 'Electronic device' },
    { id: 6, type: 'plastic', name: 'Food Container', image: '/images/trash/plastic-container.png', description: 'Plastic #5' },
    { id: 7, type: 'paper', name: 'Newspaper', image: '/images/trash/newspaper.png', description: 'Newsprint paper' },
    { id: 8, type: 'glass', name: 'Wine Bottle', image: '/images/trash/glass-bottle.png', description: 'Green glass' },
  ]);

  // Bin data
  const [bins] = useState<Bin[]>([
    { type: 'plastic', label: 'Plastic', color: 'bg-blue-600', icon: '♳', accepts: ['plastic'], description: 'Bottles, containers' },
    { type: 'paper', label: 'Paper', color: 'bg-green-600', icon: '📄', accepts: ['paper'], description: 'Cardboard, paper' },
    { type: 'glass', label: 'Glass', color: 'bg-yellow-600', icon: '🥃', accepts: ['glass'], description: 'Jars, bottles' },
    { type: 'metal', label: 'Metal', color: 'bg-gray-600', icon: '🥫', accepts: ['metal'], description: 'Cans, foil' },
    { type: 'electronic', label: 'E-Waste', color: 'bg-purple-600', icon: '📱', accepts: ['electronic'], description: 'Electronics, batteries' },
  ]);

  // Items on the conveyor belt
  const [conveyorItems, setConveyorItems] = useState<FactoryItem[]>([]);
  const [sortedItems, setSortedItems] = useState<number[]>([]);
  const [incorrectItems, setIncorrectItems] = useState<number[]>([]);
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
      setTimeLeft(60);
      setScore(0);
      setItemsSorted(0);
      setSortedItems([]);
      setIncorrectItems([]);
      setConveyorItems([]);
      setGameOver(false);
      setShowReward(false);
      setMachineStatus('running');
      setConveyorSpeed(1);

      // Add initial items to conveyor
      const initialItems = [...factoryItems].sort(() => 0.5 - Math.random()).slice(0, 3);
      setConveyorItems(initialItems);
    }
  }, [gameActive, factoryItems]);

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
      setMachineStatus('jammed');
    }
    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  // Conveyor belt movement
  useEffect(() => {
    let conveyorTimer: NodeJS.Timeout;

    if (gameActive && machineStatus !== 'jammed') {
      conveyorTimer = setInterval(() => {
        // Add new items periodically
        if (conveyorItems.length < 5 && Math.random() > 0.7) {
          const remainingItems = factoryItems.filter(item =>
            !conveyorItems.some(ci => ci.id === item.id) && !sortedItems.includes(item.id)
          );

          if (remainingItems.length > 0) {
            const newItem = remainingItems[Math.floor(Math.random() * remainingItems.length)];
            setConveyorItems(prev => [...prev, newItem]);
          }
        }
      }, 2000 / conveyorSpeed);
    }

    return () => clearInterval(conveyorTimer);
  }, [gameActive, conveyorItems, factoryItems, sortedItems, conveyorSpeed, machineStatus]);

  // Check if all items are sorted
  useEffect(() => {
    if (itemsSorted === factoryItems.length && gameActive) {
      setGameActive(false);
      setShowReward(true);
      setMachineStatus('optimal');
      // Bonus points for time left
      setScore(prev => prev + timeLeft * 5);
    }
  }, [itemsSorted, gameActive, timeLeft, factoryItems.length]);

  // Check for machine jams
  useEffect(() => {
    if (incorrectItems.length >= 3 && machineStatus !== 'jammed') {
      setMachineStatus('jammed');
      // Penalty for jamming the machine
      setScore(prev => Math.max(0, prev - 20));

      // Unjam after a delay
      setTimeout(() => {
        if (gameActive) {
          setMachineStatus('running');
          setIncorrectItems([]);
        }
      }, 3000);
    }
  }, [incorrectItems, gameActive, machineStatus]);

  // Start the game
  const startGame = () => {
    setGameActive(true);
  };

  // Reset the game
  const resetGame = () => {
    setGameActive(false);
    setGameOver(false);
    setShowReward(false);
    setMachineStatus('running');
  };

  // Handle item drop
  const handleDrop = (e: React.DragEvent, binType: string) => {
    e.preventDefault();
    const itemId = parseInt(e.dataTransfer.getData('text/plain'));
    const item = factoryItems.find(item => item.id === itemId);

    if (!item) return;

    if (item.type === binType) {
      // Correct bin - add to score
      setScore(prev => prev + 10);
      setItemsSorted(prev => prev + 1);
      setSortedItems(prev => [...prev, item.id]);
      setConveyorItems(prev => prev.filter(ci => ci.id !== item.id));

      // Increase conveyor speed for challenge
      if (itemsSorted % 3 === 0 && conveyorSpeed < 2.5) {
        setConveyorSpeed(prev => prev + 0.2);
      }
    } else {
      // Wrong bin - penalize and potentially jam machine
      setShowHint(true);
      setScore(prev => Math.max(0, prev - 5));
      setIncorrectItems(prev => [...prev, item.id]);
      setTimeout(() => setShowHint(false), 2000);
    }
  };

  // Allow drop
  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, itemId: number) => {
    e.dataTransfer.setData('text/plain', itemId.toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 p-4 md:p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-5 text-4xl opacity-20">🏭</div>
        <div className="absolute top-20 right-10 text-4xl opacity-20">⚙️</div>
        <div className="absolute bottom-20 left-20 text-4xl opacity-20">🔧</div>
        <div className="absolute bottom-10 right-20 text-4xl opacity-20">🏗️</div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Recycling Factory</h1>
          <p className="text-sm md:text-lg text-gray-300">
            Keep the machines running by sorting items correctly!
          </p>

          <div className="flex justify-center items-center mt-4 gap-4 md:gap-6">
            <div className="bg-gray-700 rounded-full px-3 py-1 md:px-4 md:py-2 shadow-md flex items-center">
              <span className="text-lg mr-1 text-yellow-400">⭐</span>
              <span className="font-bold text-white">Score: {score}</span>
            </div>
            <div className="bg-gray-700 rounded-full px-3 py-1 md:px-4 md:py-2 shadow-md flex items-center">
              <span className="text-lg mr-1 text-red-400">⏱️</span>
              <span className="font-bold text-white">Time: {timeLeft}s</span>
            </div>
            <div className="bg-gray-700 rounded-full px-3 py-1 md:px-4 md:py-2 shadow-md flex items-center">
              <span className="text-lg mr-1 text-green-400">✅</span>
              <span className="font-bold text-white">
                Sorted: {itemsSorted}/{factoryItems.length}
              </span>
            </div>
          </div>
        </header>

        <div className="bg-gray-700 rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
          {/* Game instructions */}
          <div className="flex items-center mb-4 md:mb-6">
            <div className="bg-blue-600 rounded-full p-2 md:p-3 mr-3 md:mr-4">
              <span className="text-2xl md:text-3xl">🏭</span>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white">Factory Sorting</h2>
              <p className="text-sm md:text-base text-gray-300">
                "Oh no! Can you fix the machine by putting the glass bottle in the right place?"
              </p>
            </div>
          </div>

          {showHint && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 md:p-4 mb-4 md:mb-6 animate-pulse rounded">
              <p className="font-bold text-sm md:text-base">⚠️ That's not the right bin! The machine is getting jammed!</p>
            </div>
          )}

          {/* Machine status indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className={`px-4 py-2 rounded-full ${machineStatus === 'jammed' ? 'bg-red-600' :
                machineStatus === 'optimal' ? 'bg-green-600' : 'bg-blue-600'
              }`}>
              <span className="text-white font-bold">
                {machineStatus === 'jammed' ? 'MACHINE JAMMED!' :
                  machineStatus === 'optimal' ? 'OPTIMAL PERFORMANCE' : 'RUNNING'}
              </span>
            </div>
          </div>

          {/* Game content */}
          {!gameActive && !gameOver && !showReward && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🏭</div>
              <h3 className="text-2xl font-bold text-white mb-2">Recycling Factory Challenge!</h3>
              <p className="text-gray-300 mb-4">
                Sort items correctly to keep the factory machines running smoothly!
              </p>
              <button
                onClick={startGame}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md"
              >
                Start Sorting
              </button>
            </div>
          )}

          {gameOver && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">😢</div>
              <h3 className="text-2xl font-bold text-red-400 mb-2">Factory Shutdown!</h3>
              <p className="text-gray-300 mb-4">
                The machines jammed too many times. Try again to keep the factory running!
              </p>
              <button
                onClick={resetGame}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md"
              >
                Try Again
              </button>
            </div>
          )}

          {showReward && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">Factory Optimized!</h3>
              <p className="text-gray-300 mb-2">
                You've sorted all items correctly and kept the machines running smoothly!
              </p>
              <p className="text-gray-300 mb-4">
                Final Score: {score} | Time Bonus: {timeLeft * 5}
              </p>

              <div className="my-6">
                <div className="inline-block bg-gray-600 rounded-full p-4 shadow-lg">
                  <span className="text-4xl">⚙️</span>
                </div>
                <p className="text-white font-bold mt-2">Gear Badge Unlocked!</p>
              </div>

              <div className="factory-celebration flex justify-center gap-4 text-3xl my-4">
                <span className="animate-bounce">✨</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>✨</span>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={resetGame}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md mt-4"
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
                    router.push("/story/animation/10");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md mt-4"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {gameActive && (
            <>
              {/* Factory Conveyor Belt */}
              <div className="relative rounded-lg p-4 mb-6 md:mb-8 h-48 border-2 border-gray-600 overflow-hidden bg-gray-800">
                {/* Conveyor belt texture */}
                <div className="absolute inset-0 bg-repeat-x bg-auto opacity-20 conveyor-texture"></div>

                {/* Machine elements */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-2xl">
                  ⚙️
                </div>

                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-2xl">
                  ⚙️
                </div>

                {/* Conveyor belt */}
                <div className="absolute top-1/2 left-8 right-8 h-8 bg-gray-500 rounded-lg transform -translate-y-1/2"></div>

                {/* Moving conveyor animation */}
                <div className={`absolute top-1/2 left-0 right-0 h-8 transform -translate-y-1/2 conveyor-move ${machineStatus === 'jammed' ? 'paused' : ''}`}></div>

                {/* Conveyor items */}
                <div className="absolute top-1/2 left-8 right-8 h-16 transform -translate-y-1/2 flex items-center justify-start gap-8">
                  {conveyorItems.map(item => (
                    <div
                      key={item.id}
                      draggable={machineStatus !== 'jammed'}
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      className="cursor-move z-10 transition-transform duration-200 hover:scale-110 bg-white p-2 rounded-lg shadow-lg"
                    >
                      <div className="w-12 h-12 flex items-center justify-center text-2xl">
                        {item.image ? <img src={item.image} alt={item.name} className="max-w-full max-h-full" /> : '❓'}
                      </div>
                      <div className="text-xs text-center mt-1 bg-black bg-opacity-70 text-white px-1 rounded">
                        {item.name}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Machine status light */}
                <div className="absolute top-4 right-4">
                  <div className={`w-6 h-6 rounded-full ${machineStatus === 'jammed' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                </div>
              </div>

              {/* Instruction */}
              <div className="text-center text-gray-300 font-bold mb-4">
                <p>Drag items to the correct bins before they reach the end!</p>
                <p className="text-sm text-yellow-400">Speed: {conveyorSpeed.toFixed(1)}x</p>
              </div>

              {/* Bins */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 mb-4 md:mb-6">
                {bins.map(bin => (
                  <div
                    key={bin.type}
                    onDrop={(e) => machineStatus !== 'jammed' && handleDrop(e, bin.type)}
                    onDragOver={allowDrop}
                    className={`${bin.color} rounded-lg p-3 text-center min-h-32 flex flex-col items-center justify-end transition-all hover:opacity-90 border-2 border-gray-700 shadow-md relative ${machineStatus === 'jammed' ? 'opacity-50' : 'cursor-pointer'}`}
                  >
                    <div className="w-12 h-16 bg-gray-800 mb-2 rounded-t-lg flex items-center justify-center text-white text-2xl">
                      {bin.icon}
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1">{bin.label}</h3>
                    <p className="text-white text-xs opacity-80">{bin.description}</p>

                    {/* Items in Bin */}
                    <div className="flex flex-wrap justify-center gap-1 mt-2">
                      {sortedItems.map(itemId => {
                        const item = factoryItems.find(i => i.id === itemId);
                        return item && item.type === bin.type ? (
                          <div key={itemId} className="w-4 h-4 rounded flex items-center justify-center bg-white shadow-sm text-xs">
                            {item.type === 'plastic' ? '🥤' :
                              item.type === 'paper' ? '📦' :
                                item.type === 'glass' ? '🥃' :
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
        <div className="bg-blue-900 rounded-xl p-4 md:p-6 border border-blue-700 mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-bold text-white mb-2 flex items-center">
            <span className="mr-2">🏭</span> Recycling Facts
          </h3>
          <p className="text-blue-200 text-sm md:text-base">
            Recycling plants use advanced machinery to sort and process materials. Proper sorting at home
            helps these machines run efficiently and reduces contamination in recycling streams!
          </p>
        </div>

        {/* Recycling Tips */}
        <div className="bg-gray-600 rounded-xl p-4 md:p-6 border border-gray-500">
          <h3 className="text-base md:text-lg font-bold text-white mb-2 flex items-center">
            <span className="mr-2">💡</span> Factory Sorting Tips
          </h3>
          <ul className="list-disc pl-5 text-gray-300 text-sm md:text-base">
            <li>Rinse containers to avoid contaminating other materials</li>
            <li>Remove caps from bottles as they're often different materials</li>
            <li>Flatten cardboard boxes to save space in recycling bins</li>
            <li>Check local guidelines for electronic waste disposal</li>
          </ul>
        </div>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        .conveyor-texture {
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,10 L100,10 M0,15 L100,15' stroke='%23ffffff' stroke-width='1' fill='none'/%3E%3C/svg%3E");
        }
        
        .conveyor-move {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          animation: conveyorMove 1s linear infinite;
        }
        
        @keyframes conveyorMove {
          0% { transform: translateX(-100%) translateY(-50%); }
          100% { transform: translateX(100%) translateY(-50%); }
        }
        
        .paused {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default RecyclingFactoryGame;