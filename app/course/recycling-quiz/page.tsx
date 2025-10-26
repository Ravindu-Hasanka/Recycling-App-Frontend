'use client';

import { useState, useEffect } from "react";

const questionBank = [
  {
    question: "Where should you throw a glass bottle?",
    options: ["Plastic Bin", "Glass Bin", "Paper Bin"],
    correct: "Glass Bin",
    image: "glass-bottle"
  },
  {
    question: "What is biodegradable?",
    options: ["Banana Peel", "Plastic Straw", "Soda Can"],
    correct: "Banana Peel",
    image: "banana-peel"
  },
  {
    question: "Which bin should a newspaper go in?",
    options: ["Compost Bin", "Recycling Bin", "Trash Bin"],
    correct: "Recycling Bin",
    image: "newspaper"
  },
  {
    question: "What can you do with an old toy you don't want?",
    options: ["Throw it away", "Donate it", "Burn it"],
    correct: "Donate it",
    image: "toy"
  },
  {
    question: "How can you reduce waste at school?",
    options: ["Use reusable water bottles", "Throw everything in trash", "Never eat lunch"],
    correct: "Use reusable water bottles",
    image: "water-bottle"
  },
  {
    question: "What should you do with old batteries?",
    options: ["Put in regular trash", "Recycle at special collection points", "Bury in the garden"],
    correct: "Recycle at special collection points",
    image: "batteries"
  },
  {
    question: "Which item takes the longest to decompose?",
    options: ["Apple core", "Plastic bag", "Paper towel"],
    correct: "Plastic bag",
    image: "plastic-bag"
  },
  {
    question: "What is composting?",
    options: ["Throwing food in the trash", "Burning organic waste", "Turning food scraps into nutrient-rich soil"],
    correct: "Turning food scraps into nutrient-rich soil",
    image: "compost"
  },
  {
    question: "Why is recycling important?",
    options: ["It saves energy and resources", "It makes garbage trucks look full", "It's just a trend"],
    correct: "It saves energy and resources",
    image: "recycling"
  },
  {
    question: "What should you do with old clothes that don't fit?",
    options: ["Throw them away", "Donate or repurpose them", "Burn them"],
    correct: "Donate or repurpose them",
    image: "clothes"
  },
  {
    question: "Which of these is NOT recyclable?",
    options: ["Aluminum cans", "Pizza boxes with grease stains", "Clean cardboard"],
    correct: "Pizza boxes with grease stains",
    image: "pizza-box"
  },
  {
    question: "What does 'reduce' mean in 'reduce, reuse, recycle'?",
    options: ["Cutting paper into pieces", "Using fewer items to create less waste", "Making garbage piles smaller"],
    correct: "Using fewer items to create less waste",
    image: "reduce"
  },
  {
    question: "How can you reuse a plastic container?",
    options: ["As a trash can", "For storing items or crafts", "By melting it at home"],
    correct: "For storing items or crafts",
    image: "plastic-container"
  },
  {
    question: "What happens to recycled paper?",
    options: ["It's turned into new paper products", "It's burned for energy", "It's buried underground"],
    correct: "It's turned into new paper products",
    image: "recycled-paper"
  }
];

const getRandomQuestions = (count: number) => {
  const shuffled = [...questionBank].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default function RecyclingQuiz() {
  const [questions, setQuestions] = useState(getRandomQuestions(10));
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animate, setAnimate] = useState("");
  const [showFinalScore, setShowFinalScore] = useState(false);

  const current = questions[index];

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const check = (opt: string) => {
    if (opt === current.correct) {
      setFeedback("🎉 Correct!");
      setScore(score + 1);
      setShowConfetti(true);
      setAnimate("jump");
    } else {
      setFeedback(`🙈 Oops! The correct answer is ${current.correct}`);
      setAnimate("shake");
    }
    
    setTimeout(() => {
      setFeedback("");
      setAnimate("");
      
      if (index === questions.length - 1) {
        setShowFinalScore(true);
      } else {
        setIndex(index + 1);
      }
    }, 2000);
  };

  const restartQuiz = () => {
    setQuestions(getRandomQuestions(10));
    setIndex(0);
    setScore(0);
    setFeedback("");
    setShowFinalScore(false);
  };

  const calculatePercentage = () => {
    return Math.round((score / questions.length) * 100);
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage === 100) return "Perfect! You're a recycling superstar! 🌟";
    if (percentage >= 80) return "Excellent! You know so much about recycling!";
    if (percentage >= 60) return "Good job! You're getting better at recycling!";
    if (percentage >= 40) return "Not bad! Keep learning about recycling!";
    return "Keep practicing! You'll be a recycling expert soon!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-6 flex flex-col">
      <div className="flex-grow flex flex-col">
        {showFinalScore ? (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-xl max-w-md w-full animate-pop-in">
              <h2 className="text-3xl font-bold text-green-600 mb-4">Quiz Complete!</h2>
              <div className="text-6xl mb-6">🏆</div>
              
              <div className="relative w-40 h-40 mx-auto mb-6">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-green-500"
                    strokeWidth="8"
                    strokeDasharray={`${calculatePercentage() * 2.51}, 251`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold">
                  {calculatePercentage()}%
                </div>
              </div>
              
              <p className="text-xl mb-2">
                You got {score} out of {questions.length} correct
              </p>
              <p className="text-lg mb-6">
                {getScoreMessage(calculatePercentage())}
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={restartQuiz}
                  className="px-6 py-3 bg-teal-500 text-white rounded-full font-bold hover:bg-teal-600 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={restartQuiz}
                  className="px-6 py-3 bg-green-100 text-green-700 rounded-full font-bold hover:bg-green-200 transition-colors"
                >
                  New Questions
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4 text-green-800">Recycling Adventure!</h1>
            <div className="w-screen mb-4 px-40 flex flex-col justify-between items-center">
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div 
                  className="w-full bg-green-600 h-6 rounded-full transition-all duration-500" 
                  style={{ width: `${((index) / questions.length) * 100}%` }}
                ></div>
              </div>
              <p className="mt-2 text-gray-600">Question {index + 1} of {questions.length}</p>
            </div>
            
            <div className="flex-grow max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 mb-4">
              <div className="h-40 bg-green-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-6xl">
                  {current.image.includes("glass") ? "🍶" : 
                   current.image.includes("banana") ? "🍌" :
                   current.image.includes("newspaper") ? "📰" :
                   current.image.includes("toy") ? "🧸" :
                   current.image.includes("water") ? "💧" :
                   current.image.includes("batteries") ? "🔋" :
                   current.image.includes("plastic-bag") ? "🛍️" :
                   current.image.includes("compost") ? "🍂" :
                   current.image.includes("clothes") ? "👕" :
                   current.image.includes("pizza") ? "🍕" :
                   current.image.includes("reduce") ? "♻️" :
                   current.image.includes("container") ? "🥡" : "📄"}
                </span>
              </div>
              
              <p className="text-xl font-semibold mb-6 text-green-700">{current.question}</p>
              
              <div className="flex flex-col gap-3 items-center">
                {current.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => check(opt)}
                    className={`px-6 py-3 w-full rounded-full text-white font-bold transition-all 
                      ${opt === current.correct && feedback.includes("Correct") ? "bg-green-500 scale-105" : 
                        feedback.includes(opt) && !feedback.includes("Correct") ? "bg-red-400" : "bg-teal-500 hover:bg-teal-600"}
                      ${animate === "jump" && opt === current.correct ? "animate-bounce" : 
                        animate === "shake" && opt !== current.correct && feedback.includes(opt) ? "animate-shake" : ""}`}
                    disabled={!!feedback}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {feedback && (
              <div className={`p-4 rounded-lg mx-auto max-w-md mb-4
                ${feedback.includes("Correct") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                <p className="text-xl font-bold text-center">{feedback}</p>
                {feedback.includes("Correct") && (
                  <p className="mt-2 text-center">Current score: {score}/{questions.length}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `scale(${Math.random() * 1.5})`,
                opacity: Math.random()
              }}
            ></div>
          ))}
        </div>
      )}

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes pop-in {
          0% { transform: scale(0.5); opacity: 0; }
          80% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
        .animate-pop-in {
          animation: pop-in 0.5s;
        }
      `}</style>
    </div>
  );
}