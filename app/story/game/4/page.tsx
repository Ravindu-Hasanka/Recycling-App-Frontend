'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getStoryByTitle, updateProgress } from '@/app/api/story-api';
import { Story } from '@/app/types/story';

export default function MagicalForestGame() {
  const [gameState, setGameState] = useState({
    score: 0,
    itemsRecycled: 0,
    showFeedback: false,
    feedbackMessage: '',
    isCorrect: false,
    rewardUnlocked: false,
    gameComplete: false,
    treeGrowth: 0
  });

  const [items, setItems] = useState<Item[]>([
    { id: 1, type: 'paper', name: 'Newspaper', image: '/newspaper.png', x: 50, y: 60, recycled: false },
    { id: 2, type: 'plastic', name: 'Plastic Bottle', image: '/plastic-bottle.png', x: 150, y: 70, recycled: false },
    { id: 3, type: 'paper', name: 'Cardboard Box', image: '/cardboard.png', x: 250, y: 80, recycled: false },
    { id: 4, type: 'organic', name: 'Apple Core', image: '/apple-core.png', x: 350, y: 90, recycled: false },
    { id: 5, type: 'paper', name: 'Paper Bag', image: '/paper-bag.png', x: 450, y: 100, recycled: false },
    { id: 6, type: 'other', name: 'Toy Car', image: '/toy-car.png', x: 550, y: 110, recycled: false },
  ]);

  const [draggedItem, setDraggedItem] = useState<Item | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
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

  const paperItems = items.filter(item => item.type === 'paper');
  const totalPaperItems = paperItems.length;

  interface GameState {
    score: number;
    itemsRecycled: number;
    showFeedback: boolean;
    feedbackMessage: string;
    isCorrect: boolean;
    rewardUnlocked: boolean;
    gameComplete: boolean;
    treeGrowth: number;
  }

  interface Item {
    id: number;
    type: 'paper' | 'plastic' | 'organic' | 'other';
    name: string;
    image: string;
    x: number;
    y: number;
    recycled: boolean;
  }

  interface DragOffset {
    x: number;
    y: number;
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: Item) => {
    e.dataTransfer.setData('text/plain', item.id.toString());
    setDraggedItem(item);
    setDragOffset({
      x: e.clientX - item.x,
      y: e.clientY - item.y
    });
  };

  const handleDragOver = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  };

  const handleDrop = (e: { preventDefault: () => void; currentTarget: { getBoundingClientRect: () => any; }; clientX: number; clientY: number; }) => {
    e.preventDefault();
    const binRect = e.currentTarget.getBoundingClientRect();
    const dropX = e.clientX - binRect.left;
    const dropY = e.clientY - binRect.top;

    if (draggedItem) {
      const isPaperItem = draggedItem.type === 'paper';
      const isInBin = dropX > 0 && dropX < binRect.width && dropY > 0 && dropY < binRect.height;

      if (isInBin && isPaperItem) {
        // Correct recycling
        setItems(prev => prev.map(item =>
          item.id === draggedItem.id ? { ...item, recycled: true } : item
        ));

        const newItemsRecycled = gameState.itemsRecycled + 1;
        const allPaperRecycled = newItemsRecycled >= totalPaperItems;
        const treeGrowth = Math.min(100, (newItemsRecycled / totalPaperItems) * 100);

        setGameState(prev => ({
          ...prev,
          itemsRecycled: newItemsRecycled,
          score: prev.score + 10,
          showFeedback: true,
          isCorrect: true,
          feedbackMessage: 'Great job! You recycled paper waste!',
          treeGrowth,
          rewardUnlocked: allPaperRecycled,
          gameComplete: allPaperRecycled
        }));
      } else if (isInBin && !isPaperItem) {
        // Wrong item in bin
        setGameState(prev => ({
          ...prev,
          showFeedback: true,
          isCorrect: false,
          feedbackMessage: 'This is not paper waste! Try again.',
        }));
      }

      // Reset item position if not correctly recycled
      if (!(isInBin && isPaperItem)) {
        setItems(prev => prev.map(item =>
          item.id === draggedItem.id ? { ...item, x: 50 + Math.random() * 500, y: 60 + Math.random() * 50 } : item
        ));
      }
    }

    setDraggedItem(null);

    setTimeout(() => {
      setGameState(prev => ({ ...prev, showFeedback: false }));
    }, 2000);
  };

  const resetGame = () => {
    setItems([
      { id: 1, type: 'paper', name: 'Newspaper', image: '/newspaper.png', x: 50, y: 60, recycled: false },
      { id: 2, type: 'plastic', name: 'Plastic Bottle', image: '/plastic-bottle.png', x: 150, y: 70, recycled: false },
      { id: 3, type: 'paper', name: 'Cardboard Box', image: '/cardboard.png', x: 250, y: 80, recycled: false },
      { id: 4, type: 'organic', name: 'Apple Core', image: '/apple-core.png', x: 350, y: 90, recycled: false },
      { id: 5, type: 'paper', name: 'Paper Bag', image: '/paper-bag.png', x: 450, y: 100, recycled: false },
      { id: 6, type: 'other', name: 'Toy Car', image: '/toy-car.png', x: 550, y: 110, recycled: false },
    ]);
    setGameState({
      score: 0,
      itemsRecycled: 0,
      showFeedback: false,
      feedbackMessage: '',
      isCorrect: false,
      rewardUnlocked: false,
      gameComplete: false,
      treeGrowth: 0
    });
  };

  if (gameState.gameComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-green-800 mb-4">Forest Restored!</h2>
          <p className="text-lg text-gray-700 mb-2">
            You recycled all the paper waste and helped the forest regrow!
          </p>
          <div className="my-6">
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-green-500 to-emerald-700 rounded-full flex items-center justify-center">
              <span className="text-white text-4xl">🌳</span>
            </div>
          </div>
          <p className="text-lg text-green-600 font-semibold mb-4">
            Congratulations! You earned a leaf crown! 👑🍃
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={resetGame}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 transform hover:scale-105 mt-4"
            >
              Play Again
            </button>
            <button
              onClick={async () => {
                if (story) {
                  try {
                    await updateProgress({
                      storyId: story.id,
                      score: gameState.score,
                    });
                    console.log("Progress updated!");
                  } catch (err) {
                    console.error("Failed to update progress", err);
                  }
                }
                router.push("/story/animation/5");
              }}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 transform hover:scale-105 mt-4"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center my-6">
          <h1 className="text-4xl font-bold text-green-800">EcoHero: The Magical Forest</h1>
          <p className="text-lg text-gray-600 mt-2">Help restore the forest by recycling paper waste</p>
          <div className="flex justify-center items-center gap-4 mt-4">
            <div className="bg-green-200 inline-block px-4 py-2 rounded-full">
              <span className="text-green-800 font-semibold">Score: {gameState.score}</span>
            </div>
            <div className="bg-amber-200 inline-block px-4 py-2 rounded-full">
              <span className="text-amber-800 font-semibold">Recycled: {gameState.itemsRecycled}/{totalPaperItems}</span>
            </div>
          </div>
        </header>

        {/* Game Scene */}
        <div
          className="relative rounded-3xl shadow-xl overflow-hidden border-4 border-emerald-200 h-96 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/magical-forest-bg-1.jpg')" }} >

          {/* Recycling Bin */}
          <div
            className="absolute bottom-10 right-10 w-24 h-32 bg-blue-400 rounded-t-lg cursor-pointer border-4 border-blue-600 z-20"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="absolute top-2 left-2 right-2 text-center text-white font-bold text-sm">
              PAPER
            </div>
            <div className="absolute inset-2 bg-blue-300 rounded-t-sm mt-6 flex items-center justify-center">
              <span className="text-2xl">📄</span>
            </div>
          </div>

          {/* Items */}
          {items.map(item => !item.recycled && (
            <div
              key={item.id}
              className={`absolute w-16 h-16 cursor-grab z-10 transition-transform ${draggedItem?.id === item.id ? 'scale-110 rotate-12' : ''}`}
              style={{ left: item.x, top: item.y }}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
            >
              <div className="bg-white p-2 rounded-lg shadow-md border-2 border-amber-200 flex flex-col items-center justify-center h-full">
                <span className="text-2xl mb-1">
                  {item.type === 'paper' && '📄'}
                  {item.type === 'plastic' && '🧴'}
                  {item.type === 'organic' && '🍎'}
                  {item.type === 'other' && '🚗'}
                </span>
                <span className="text-xs text-black font-semibold text-center">{item.name}</span>
              </div>
            </div>
          ))}

          {/* Feedback */}
          {gameState.showFeedback && (
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-2xl text-center z-30 ${gameState.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <h3 className="text-2xl font-bold mb-2">
                {gameState.isCorrect ? 'Great Job! 🎉' : 'Oops! 💭'}
              </h3>
              <p className="text-lg">
                {gameState.feedbackMessage}
              </p>
            </div>
          )}

          {/* Narration */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl p-4 shadow-lg max-w-md text-center z-20">
            <p className="text-lg text-gray-800">
              "Can you find the paper waste to recycle?"
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-gray-600 bg-white p-4 rounded-xl shadow">
          <p className="font-semibold">How to play:</p>
          <p>Drag only the paper waste items to the recycling bin to help the forest grow</p>
          <div className="flex justify-center mt-2 gap-4 flex-wrap">
            <span className="text-gray-600">📄 Paper Waste</span>
            <span className="text-blue-500">🧴 Other Materials</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${gameState.treeGrowth}%` }}
          ></div>
        </div>
        <p className="text-center text-gray-600 mt-2">
          Forest Restoration: {Math.round(gameState.treeGrowth)}%
        </p>
      </div>
    </div>
  );
}