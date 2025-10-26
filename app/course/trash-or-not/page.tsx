'use client';

import { useState, useEffect } from "react";
import confetti from 'canvas-confetti';

const items = [
  { id: "1", label: "Apple Core", isTrash: true },
  { id: "2", label: "Flower", isTrash: false },
  { id: "3", label: "Plastic Cup", isTrash: true },
  { id: "4", label: "Paper", isTrash: false },
  { id: "5", label: "Banana Peel", isTrash: true },
  { id: "6", label: "Toy", isTrash: false },
  { id: "7", label: "Glass Bottle", isTrash: false },
  { id: "8", label: "Candy Wrapper", isTrash: true },
  { id: "9", label: "Newspaper", isTrash: false },
  { id: "10", label: "Used Tissue", isTrash: true },
  { id: "11", label: "Aluminum Can", isTrash: false },
  { id: "12", label: "Chewing Gum", isTrash: true },
];

export default function TrashOrNotGame() {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showFinalScore, setShowFinalScore] = useState(false);

  const current = items[index];
  const totalQuestions = 10;
  const percentage = Math.round((score / (totalQuestions * 10)) * 100);

  const checkAnswer = (answer: boolean) => {
    if (current.isTrash === answer) {
      setFeedback("✅ Correct!");
      setScore(score + 10);
      setStreak(streak + 1);
      
      if (streak >= 2) {
        setShowCelebration(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => setShowCelebration(false), 2000);
      }
    } else {
      setFeedback("❌ Oops! Try Again!");
      setStreak(0);
    }
    
    setQuestionsAnswered(questionsAnswered + 1);
    
    setTimeout(() => {
      if (questionsAnswered < totalQuestions - 1) {
        setIndex((i) => (i + 1) % items.length);
        setFeedback("");
      } else {
        setShowFinalScore(true);
      }
    }, 1500);
  };

  const resetGame = () => {
    setIndex(0);
    setScore(0);
    setStreak(0);
    setQuestionsAnswered(0);
    setShowFinalScore(false);
    setFeedback("");
  };

  const startGame = () => {
    setGameStarted(true);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-100 to-blue-100 p-6 text-center text-black">
        <h1 className="text-4xl font-bold mb-6 text-green-800">Is this Trash?</h1>
        <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full animate-pop-in">
          <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto">
            🌎
          </div>
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Eco Hero Challenge!</h2>
          <p className="mb-6 text-lg">Can you sort 10 items correctly to help our planet?</p>
          <button
            onClick={startGame}
            className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-full text-xl font-bold shadow-lg transform transition hover:scale-105"
          >
            Start Game!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-6 text-center">
      {showFinalScore ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl max-w-md w-full animate-pop-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-4 text-green-600">Game Complete!</h2>
            <div className="text-5xl font-bold mb-6 text-blue-600">{percentage}%</div>
            <p className="text-xl mb-6">
              You scored {score} out of {totalQuestions * 10} points!
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full text-lg font-bold shadow-md transform transition hover:scale-105"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="text-lg font-bold text-blue-600">
              Score: <span className="text-2xl">{score}</span>
            </div>
            <div className="bg-white rounded-full px-4 py-2 shadow">
              Question: {questionsAnswered + 1}/{totalQuestions}
            </div>
            {streak > 0 && (
              <div className="text-lg font-bold text-orange-500">
                Streak: {streak} {Array(streak).fill("🔥").join("")}
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-6 text-green-800">Is this Trash?</h1>
          
          <div className="bg-white rounded-xl p-8 mb-8 shadow-lg border-4 border-dashed border-green-200">
            <div className="text-3xl font-bold mb-2">{current.label}</div>
          </div>
          
          <div className="flex gap-4 justify-center mb-6">
            <button
              onClick={() => checkAnswer(true)}
              className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-full text-xl font-bold shadow-lg transform transition hover:scale-105 flex items-center gap-2"
            >
              <span className="text-2xl">🗑️</span> Trash
            </button>
            <button
              onClick={() => checkAnswer(false)}
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-xl font-bold shadow-lg transform transition hover:scale-105 flex items-center gap-2"
            >
              <span className="text-2xl">♻️</span> Not Trash
            </button>
          </div>
          
          {feedback && (
            <div className={`text-3xl font-bold mb-6 animate-bounce ${feedback.includes("✅") ? "text-green-600" : "text-red-600"}`}>
              {feedback}
            </div>
          )}
          
          {showCelebration && (
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-8xl animate-jump">🎉</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}