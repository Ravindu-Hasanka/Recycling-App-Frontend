'use client';

import { getStoryByTitle, updateProgress } from "@/app/api/story-api";
import { Story } from "@/app/types/story";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface DraggableItem {
  id: number;
  type: 'plastic' | 'paper' | 'glass' | 'organic' | 'metal';
  name: string;
  image: string; // URL to real image
}

interface Bin {
  type: 'plastic' | 'paper' | 'glass' | 'organic' | 'metal';
  label: string;
  color: string;
  icon: string;
  accepts: string[];
}

const RealisticRecyclingGame = () => {
  const [draggableItems] = useState<DraggableItem[]>([
    { id: 1, type: 'plastic', name: 'Plastic Bottle', image: '/images/trash/plastic-bottle.png' },
    { id: 2, type: 'paper', name: 'Newspaper', image: '/images/trash/newspaper.png' },
    { id: 3, type: 'glass', name: 'Glass Jar', image: '/images/trash/glass-jar.png' },
    { id: 4, type: 'plastic', name: 'Chip Bag', image: '/images/trash/chip-bag.png' },
    { id: 5, type: 'paper', name: 'Cardboard Box', image: '/images/trash/cardboard.png' },
    { id: 6, type: 'organic', name: 'Apple Core', image: '/images/trash/apple-core.png' },
    { id: 7, type: 'metal', name: 'Soda Can', image: '/images/trash/soda-can.png' }
  ]);

  const [bins] = useState<Bin[]>([
    { type: 'plastic', label: 'Plastic', color: 'bg-blue-500', icon: '♳', accepts: ['plastic'] },
    { type: 'paper', label: 'Paper', color: 'bg-green-500', icon: '📄', accepts: ['paper'] },
    { type: 'glass', label: 'Glass', color: 'bg-yellow-500', icon: '🥃', accepts: ['glass'] },
    { type: 'organic', label: 'Food Waste', color: 'bg-amber-700', icon: '🍂', accepts: ['organic'] },
    { type: 'metal', label: 'Metal', color: 'bg-gray-500', icon: '🥫', accepts: ['metal'] }
  ]);

  const [itemsInBins, setItemsInBins] = useState<Record<string, number[]>>({
    plastic: [],
    paper: [],
    glass: [],
    organic: [],
    metal: []
  });

  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
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

  useEffect(() => {
    const totalSorted = Object.values(itemsInBins).flat().length;
    if (totalSorted === draggableItems.length) {
      setCompleted(true);
    }
  }, [itemsInBins, draggableItems.length]);

  const handleOnDrop = (e: React.DragEvent, binType: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("itemId");

    const item = draggableItems.find(item => item.id === parseInt(itemId));
    if (!item) return;

    if (item.type === binType) {
      setItemsInBins(prev => ({
        ...prev,
        [binType]: [...prev[binType as keyof typeof prev], parseInt(itemId)]
      }));
      setScore(prev => prev + 10);
    } else {
      setShowHint(true);
      setIncorrectAttempts(prev => prev + 1);
      setScore(prev => Math.max(0, prev - 5));
      setTimeout(() => setShowHint(false), 2000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent, itemId: number, itemType: string) => {
    e.dataTransfer.setData("itemId", itemId.toString());
    e.dataTransfer.setData("itemType", itemType);
    e.dataTransfer.effectAllowed = "move";
  };

  const resetGame = () => {
    setItemsInBins({
      plastic: [],
      paper: [],
      glass: [],
      organic: [],
      metal: []
    });
    setCompleted(false);
    setScore(0);
    setIncorrectAttempts(0);
  };

  const unsortedItems = draggableItems.filter(
    item => !Object.values(itemsInBins).flat().includes(item.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Recycling Park Adventure</h1>
          <p className="text-lg text-green-600">
            Help EcoHero clean the park by sorting the trash into the right bins
          </p>
          <div className="flex justify-center items-center mt-4 gap-6">
            <div className="bg-white rounded-full px-4 py-2 shadow-md">
              <span className="font-bold text-green-700">Score: {score}</span>
            </div>
            <div className="bg-white rounded-full px-4 py-2 shadow-md">
              <span className="font-bold text-blue-700">
                Sorted: {Object.values(itemsInBins).flat().length}/{draggableItems.length}
              </span>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <span className="text-3xl">🌳</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-green-800">The Messy Park</h2>
              <p className="text-green-600">
                Drag each item to the correct recycling bin. Can you help clean up?
              </p>
            </div>
          </div>

          {showHint && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 animate-pulse">
              <p className="font-bold">Oops! That doesn't go there. Try a different bin.</p>
            </div>
          )}

          {completed ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-green-700 mb-2">Congratulations!</h3>
              <p className="text-green-600 mb-2">You've cleaned the park and helped the environment!</p>
              <p className="text-green-600 mb-4">
                Final Score: {score} | Incorrect attempts: {incorrectAttempts}
              </p>
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
                    router.push("/story/animation/2");
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Park Scene */}
              <div className="relative bg-green-50 rounded-lg p-4 mb-8 h-64 border-2 border-green-200 overflow-hidden">
                <div className="absolute left-4 bottom-4 text-4xl">🌳</div>
                <div className="absolute right-8 bottom-4 text-4xl">⚽</div>
                <div className="absolute left-1/2 bottom-4 text-4xl">🧺</div>
                <div className="absolute right-1/4 top-4 text-4xl">🌻</div>

                {unsortedItems.map(item => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id, item.type)}
                    className="absolute cursor-grab active:cursor-grabbing transition-transform duration-200 hover:scale-110"
                    style={{
                      top: `${20 + (item.id * 10) % 50}%`,
                      left: `${10 + (item.id * 20) % 70}%`
                    }}
                  >
                    <div className="w-16 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center shadow-md bg-white">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bins */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {bins.map(bin => (
                  <div
                    key={bin.type}
                    onDrop={(e) => handleOnDrop(e, bin.type)}
                    onDragOver={handleDragOver}
                    className={`${bin.color} rounded-lg p-4 text-center min-h-40 flex flex-col items-center justify-end transition-all hover:opacity-90 border-2 border-gray-700`}
                  >
                    <div className="w-16 h-20 bg-gray-800 mb-2 rounded-t-lg flex items-center justify-center text-white text-2xl">
                      {bin.icon}
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{bin.label}</h3>

                    {/* Items in Bin */}
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      {itemsInBins[bin.type].map(itemId => {
                        const item = draggableItems.find(i => i.id === itemId);
                        return item ? (
                          <div key={itemId} className="w-8 h-8 rounded flex items-center justify-center bg-white shadow-sm">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center text-gray-600">
                <p>Drag the items to the correct bins above</p>
              </div>
            </>
          )}
        </div>

        {/* Educational Content */}
        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200 mb-6">
          <h3 className="text-lg font-bold text-yellow-800 mb-2">Did You Know? 🌍</h3>
          <p className="text-yellow-700">
            Recycling helps keep our parks clean and protects animals from harmful trash
            When we recycle correctly, we save energy and reduce pollution.
          </p>
        </div>

        {/* Recycling Tips */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-blue-800 mb-2">Recycling Tips 💡</h3>
          <ul className="list-disc pl-5 text-blue-700">
            <li>Rinse containers before recycling them</li>
            <li>Flatten cardboard boxes to save space</li>
            <li>Check local guidelines for specific recycling rules</li>
            <li>When in doubt, find out! Don't wishcycle</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RealisticRecyclingGame;
