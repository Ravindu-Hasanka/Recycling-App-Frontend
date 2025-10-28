'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getStoryByTitle, updateProgress } from '@/app/api/story-api';
import { Story } from '@/app/types/story';

export default function PlaygroundGame() {
  const [gameState, setGameState] = useState({
    score: 0,
    currentItem: 0,
    showFeedback: false,
    isCorrect: false,
    feedbackMessage: '',
    rewardUnlocked: false,
    gameComplete: false
  });

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

  const items = [
    {
      id: 1,
      name: 'Plastic Wrapper',
      image: '/plastic-wrapper.png',
      type: 'waste',
      description: 'This plastic wrapper should be disposed of properly in a bin.',
    },
    {
      id: 2,
      name: 'Apple Core',
      image: '/apple-core.png',
      type: 'food-waste',
      description: 'Apple cores are organic waste and can be placed in the food waste bin.',
    },
    {
      id: 3,
      name: 'Paper Napkin',
      image: '/paper-napkin.png',
      type: 'waste',
      description: 'Used paper napkins should go in the general waste bin.',
    },
    {
      id: 4,
      name: 'Plastic Bottle',
      image: '/plastic-bottle.png',
      type: 'recyclable',
      description: 'Plastic bottles can be recycled! Look for the recycling bin.',
    },
    {
      id: 5,
      name: 'Toy Car',
      image: '/toy-car.png',
      type: 'not-waste',
      description: 'This is not waste! Toys should be kept and not thrown away.',
    },
    {
      id: 6,
      name: 'Banana Peel',
      image: '/banana-peel.png',
      type: 'food-waste',
      description: 'Banana peels are food waste and can be placed in the food waste bin.',
    },
  ];

  const handleChoice = (userChoice: string) => {
    const currentItem = items[gameState.currentItem];
    let isCorrect = false;
    let feedbackMessage = '';

    if (userChoice === 'waste' && (currentItem.type === 'waste' || currentItem.type === 'recyclable')) {
      isCorrect = true;
      feedbackMessage = 'Great job! You properly identified this as waste.';
    } else if (userChoice === 'food-waste' && currentItem.type === 'food-waste') {
      isCorrect = true;
      feedbackMessage = 'Excellent! This is food waste and belongs in the food waste bin.';
    } else if (userChoice === 'recyclable' && currentItem.type === 'recyclable') {
      isCorrect = true;
      feedbackMessage = 'Perfect! This item can be recycled.';
    } else if (userChoice === 'not-waste' && currentItem.type === 'not-waste') {
      isCorrect = true;
      feedbackMessage = 'That\'s right! This is not waste and should be kept.';
    } else {
      isCorrect = false;
      feedbackMessage = `Oops! ${currentItem.description}`;
    }

    setGameState(prev => ({
      ...prev,
      showFeedback: true,
      isCorrect,
      feedbackMessage,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));

    setTimeout(() => {
      setGameState(prev => {
        const nextItem = prev.currentItem + 1;
        const rewardUnlocked = nextItem >= items.length && prev.score >= items.length - 1;
        const gameComplete = nextItem >= items.length;

        return {
          ...prev,
          showFeedback: false,
          currentItem: gameComplete ? prev.currentItem : nextItem,
          rewardUnlocked,
          gameComplete
        };
      });
    }, 2500);
  };

  const resetGame = () => {
    setGameState({
      score: 0,
      currentItem: 0,
      showFeedback: false,
      isCorrect: false,
      feedbackMessage: '',
      rewardUnlocked: false,
      gameComplete: false
    });
  };

  if (gameState.gameComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-green-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-green-800 mb-4">Game Complete!</h2>
          <p className="text-lg text-gray-700 mb-2">
            You scored {gameState.score} out of {items.length}
          </p>
          {gameState.rewardUnlocked ? (
            <>
              <div className="my-6 animate-bounce">
                <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-4xl">🏆</span>
                </div>
              </div>
              <p className="text-lg text-green-600 font-semibold mb-4">
                Congratulations! You're an Eco Hero! You earned jumping boots!
              </p>
            </>
          ) : (
            <p className="text-lg text-orange-600 mb-4">
              Good effort! Try again to become an Eco Hero and unlock your reward!
            </p>
          )}
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
                      score: gameState.score,
                    });
                    console.log("Progress updated!");
                  } catch (err) {
                    console.error("Failed to update progress", err);
                  }
                }
                router.push("/story/animation/4");
              }}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentItem = items[gameState.currentItem];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center my-6">
          <h1 className="text-4xl font-bold text-green-800">EcoHero: Waste Sorting Game</h1>
          <p className="text-lg text-gray-600 mt-2">Learn what items are waste and how to properly dispose of them!</p>
          <div className="bg-green-200 inline-block px-4 py-2 rounded-full mt-4">
            <span className="text-green-800 font-semibold">Score: {gameState.score}</span>
          </div>
        </header>

        <div className="relative bg-blue-50 rounded-3xl shadow-xl overflow-hidden border-4 border-amber-100">
          <div className="absolute inset-0 z-0">
            <div className="absolute bottom-0 left-0 w-full h-2/5 bg-green-300"></div>
          </div>

          <div className="relative z-10 p-8 flex flex-col items-center">
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 max-w-lg text-center">
              <p className="text-xl text-gray-800">
                &quot;What should we do with this item? Shout it out!&quot;
              </p>
            </div>

            <div className="mb-8 transition-all duration-500 transform hover:scale-105">
              <div className="bg-white p-4 rounded-2xl shadow-md">
                <div className="w-48 h-48 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center mx-auto">
                  <span className="text-6xl">
                    {currentItem.name === 'Plastic Wrapper' && '📦'}
                    {currentItem.name === 'Apple Core' && '🍎'}
                    {currentItem.name === 'Paper Napkin' && '🧻'}
                    {currentItem.name === 'Plastic Bottle' && '🧴'}
                    {currentItem.name === 'Toy Car' && '🚗'}
                    {currentItem.name === 'Banana Peel' && '🍌'}
                  </span>
                </div>
                <p className="text-center mt-2 font-semibold text-gray-700">{currentItem.name}</p>
              </div>
            </div>

            {!gameState.showFeedback && (
              <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-md">
                <button
                  onClick={() => handleChoice('waste')}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  🗑️ General Waste
                </button>
                <button
                  onClick={() => handleChoice('recyclable')}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  ♻️ Recyclable
                </button>
                <button
                  onClick={() => handleChoice('food-waste')}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  🍲 Food Waste
                </button>
                <button
                  onClick={() => handleChoice('not-waste')}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  ❌ Not Waste
                </button>
              </div>
            )}

            {gameState.showFeedback && (
              <div className={`p-6 rounded-2xl mb-8 text-center w-full max-w-md ${gameState.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <h3 className="text-2xl font-bold mb-2">
                  {gameState.isCorrect ? 'Correct! 🎉' : 'Oops! 💭'}
                </h3>
                <p className="text-lg">{gameState.feedbackMessage}</p>
              </div>
            )}

            <div className="w-full max-w-md bg-gray-200 rounded-full h-4 mb-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${((gameState.currentItem + 1) / items.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-gray-600">
              Item {gameState.currentItem + 1} of {items.length}
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600 bg-white p-4 rounded-xl shadow">
          <p className="font-semibold">How to play:</p>
          <p>Decide what type of waste each item is and select the correct bin.</p>
          <div className="flex justify-center mt-2 gap-4">
            <span className="text-gray-500">🗑️ General Waste</span>
            <span className="text-blue-500">♻️ Recyclable</span>
            <span className="text-green-500">🍲 Food Waste</span>
            <span className="text-purple-500">❌ Not Waste</span>
          </div>
        </div>
      </div>
    </div>
  );
}
