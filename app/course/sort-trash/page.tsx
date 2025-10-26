// pages/sort-trash.tsx
'use client';

import { useState, useEffect } from "react";
import Head from "next/head";

const items = [
  { id: "1", name: "Plastic Bottle", type: "plastic", emoji: "🧴" },
  { id: "2", name: "Newspaper", type: "paper", emoji: "📰" },
  { id: "3", name: "Banana Peel", type: "organic", emoji: "🍌" },
  { id: "4", name: "Soda Can", type: "metal", emoji: "🥫" },
  { id: "5", name: "Glass Bottle", type: "glass", emoji: "🍾" },
  { id: "6", name: "Pizza Box", type: "paper", emoji: "🍕" },
  { id: "7", name: "Egg Shell", type: "organic", emoji: "🥚" },
  { id: "8", name: "Plastic Bag", type: "plastic", emoji: "🛍️" },
];

const bins = [
  { type: "plastic", color: "bg-blue-200", borderColor: "border-blue-400", emoji: "♻️", label: "Plastic" },
  { type: "paper", color: "bg-yellow-200", borderColor: "border-yellow-400", emoji: "📄", label: "Paper" },
  { type: "organic", color: "bg-green-200", borderColor: "border-green-400", emoji: "🍃", label: "Organic" },
  { type: "metal", color: "bg-gray-200", borderColor: "border-gray-400", emoji: "⛓️", label: "Metal" },
  { type: "glass", color: "bg-purple-200", borderColor: "border-purple-400", emoji: "🔮", label: "Glass" },
];

export default function SortTrashGame() {
  const [score, setScore] = useState(0);
  const [remainingItems, setRemainingItems] = useState([...items]);
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);

  useEffect(() => {
    if (remainingItems.length === 0) {
      setGameComplete(true);
    }
  }, [remainingItems]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, binType: string) => {
    const itemId = e.dataTransfer.getData("text/plain");
    const item = items.find(item => item.id === itemId);
    
    if (!item) return;

    if (item.type === binType) {
      // Correct drop
      setScore(score + 10);
      setCurrentStreak(currentStreak + 1);
      if (currentStreak + 1 > highestStreak) {
        setHighestStreak(currentStreak + 1);
      }
      setFeedback("Correct! Great job! 🌟");
      setRemainingItems(remainingItems.filter(i => i.id !== itemId));
    } else {
      // Incorrect drop
      setScore(Math.max(0, score - 5));
      setCurrentStreak(0);
      setFeedback(`Oops! That goes in ${item.type.toUpperCase()}!`);
    }
    
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const resetGame = () => {
    setScore(0);
    setRemainingItems([...items]);
    setGameComplete(false);
    setCurrentStreak(0);
    setHighestStreak(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-6 text-center text-black">
      <Head>
        <title>Sort the Trash Game</title>
      </Head>
      
      <h1 className="text-3xl font-bold mb-4 text-green-800">Sort the Trash</h1>
      <p className="mb-6 text-gray-600">Drag each item to the correct recycling bin!</p>
      
      <div className="mb-8 flex justify-center items-center gap-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="font-bold">Score: <span className="text-blue-600">{score}</span></p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="font-bold">Items Left: <span className="text-green-600">{remainingItems.length}</span></p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="font-bold">Streak: <span className="text-yellow-600">{currentStreak}</span> (Best: {highestStreak})</p>
        </div>
      </div>

      {showFeedback && (
        <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          p-6 rounded-lg text-white font-bold text-xl animate-bounce z-10
          ${feedback.includes("Oops") ? "bg-red-400" : "bg-green-400"}`}>
          {feedback}
        </div>
      )}

      {gameComplete ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-600">🎉 Congratulations! 🎉</h2>
            <p className="mb-4">You sorted all the trash correctly!</p>
            <p className="text-xl mb-6">Final Score: <span className="font-bold text-blue-600">{score}</span></p>
            <button 
              onClick={resetGame}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full text-lg transition-all"
            >
              Play Again
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {remainingItems.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", item.id)}
                className="p-4 bg-white rounded-lg cursor-grab border-2 border-dashed border-gray-300 
                  hover:border-solid hover:border-blue-400 hover:shadow-md transition-all
                  flex flex-col items-center justify-center w-24 h-24"
              >
                <span className="text-3xl mb-1">{item.emoji}</span>
                <span className="text-xs font-medium">{item.name}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-8 justify-center items-end">
            {bins.map((bin) => (
              <div
                key={bin.type}
                onDrop={(e) => handleDrop(e, bin.type)}
                onDragOver={(e) => e.preventDefault()}
                className={`w-40 h-48 ${bin.color} rounded-t-2xl ${bin.borderColor} border-t-4 border-l-4 border-r-4
                  flex flex-col items-center justify-end pb-4 shadow-xl relative overflow-hidden
                  hover:translate-y-[-5px] transition-transform`}
              >
                {/* Bin Details */}
                <div className={`absolute top-1 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-3 border-4 ${bin.borderColor} shadow-md`}>
                  <span className="text-3xl">{bin.emoji}</span>
                </div>
                <div className="w-full h-36 bg-white/30 rounded-t-xl"></div>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <span className="font-bold text-gray-800 bg-white/90 px-3 py-1 rounded-full shadow-sm">
                    {bin.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white p-4 rounded-lg shadow-md max-w-md mx-auto">
            <h3 className="font-bold mb-2 text-green-700">Recycling Tips:</h3>
            <ul className="text-left text-sm text-gray-600 list-disc pl-5">
              <li>Clean food containers before recycling</li>
              <li>Remove lids from bottles</li>
              <li>Flatten cardboard boxes</li>
              <li>Check local recycling rules</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}