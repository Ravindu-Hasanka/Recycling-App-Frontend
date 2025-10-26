'use client';

import { useState, useEffect } from "react";

// Types
type AgeGroup = '1-3' | '4-6' | '7-10';
type DifficultyLevel = 1 | 2 | 3;
type Question = {
  question: string;
  options: string[];
  correct: string;
  image: string;
  ageGroup: AgeGroup;
  level: DifficultyLevel;
};

// Expanded Question Bank
const questionBank: Question[] = [
  // ========== AGE GROUP 1-3 ==========
  // Level 1 (Very Simple)
  {
    question: "Which bin does the banana go in?",
    options: ["Green Bin", "Blue Bin", "Black Bin"],
    correct: "Green Bin",
    image: "banana",
    ageGroup: "1-3",
    level: 1
  },
  {
    question: "Where do we put paper?",
    options: ["Blue Bin", "Green Bin", "Yellow Bin"],
    correct: "Blue Bin",
    image: "paper",
    ageGroup: "1-3",
    level: 1
  },
  {
    question: "Which bin for plastic bottles?",
    options: ["Yellow Bin", "Green Bin", "Red Bin"],
    correct: "Yellow Bin",
    image: "plastic-bottle",
    ageGroup: "1-3",
    level: 1
  },
  {
    question: "Where does apple core go?",
    options: ["Green Bin", "Blue Bin", "Black Bin"],
    correct: "Green Bin",
    image: "apple-core",
    ageGroup: "1-3",
    level: 1
  },
  {
    question: "Which bin for glass jar?",
    options: ["Green Bin", "Blue Bin", "Yellow Bin"],
    correct: "Green Bin",
    image: "glass-jar",
    ageGroup: "1-3",
    level: 1
  },

  // Level 2
  {
    question: "Which one goes in the green bin?",
    options: ["Apple Core", "Plastic Bottle", "Newspaper"],
    correct: "Apple Core",
    image: "apple-core",
    ageGroup: "1-3",
    level: 2
  },
  {
    question: "What do we do with plastic bottles?",
    options: ["Yellow Bin", "Green Bin", "Throw Away"],
    correct: "Yellow Bin",
    image: "plastic-bottle",
    ageGroup: "1-3",
    level: 2
  },
  {
    question: "Where should we put cardboard box?",
    options: ["Blue Bin", "Green Bin", "Black Bin"],
    correct: "Blue Bin",
    image: "cardboard",
    ageGroup: "1-3",
    level: 2
  },
  {
    question: "Which bin for milk carton?",
    options: ["Yellow Bin", "Green Bin", "Blue Bin"],
    correct: "Yellow Bin",
    image: "milk-carton",
    ageGroup: "1-3",
    level: 2
  },
  {
    question: "What goes in blue bin?",
    options: ["Newspaper", "Banana Peel", "Soda Can"],
    correct: "Newspaper",
    image: "newspaper",
    ageGroup: "1-3",
    level: 2
  },

  // Level 3
  {
    question: "Which bin for broken toy?",
    options: ["Black Bin", "Green Bin", "Yellow Bin"],
    correct: "Black Bin",
    image: "broken-toy",
    ageGroup: "1-3",
    level: 3
  },
  {
    question: "Where to put juice box?",
    options: ["Yellow Bin", "Blue Bin", "Green Bin"],
    correct: "Yellow Bin",
    image: "juice-box",
    ageGroup: "1-3",
    level: 3
  },
  {
    question: "Which one is recycling?",
    options: ["Plastic Bottle", "Apple Core", "Pizza Box"],
    correct: "Plastic Bottle",
    image: "recycling",
    ageGroup: "1-3",
    level: 3
  },
  {
    question: "What should we do with old clothes?",
    options: ["Donate", "Throw Away", "Burn"],
    correct: "Donate",
    image: "clothes",
    ageGroup: "1-3",
    level: 3
  },
  {
    question: "Which bin for egg shells?",
    options: ["Green Bin", "Blue Bin", "Yellow Bin"],
    correct: "Green Bin",
    image: "egg-shells",
    ageGroup: "1-3",
    level: 3
  },

  // ========== AGE GROUP 4-6 ==========
  // Level 1
  {
    question: "What should you do with an old toy?",
    options: ["Throw away", "Donate it", "Burn it"],
    correct: "Donate it",
    image: "toy",
    ageGroup: "4-6",
    level: 1
  },
  {
    question: "Which item takes longest to decompose?",
    options: ["Banana Peel", "Plastic Bag", "Paper"],
    correct: "Plastic Bag",
    image: "plastic-bag",
    ageGroup: "4-6",
    level: 1
  },
  {
    question: "What is composting?",
    options: ["Burning trash", "Turning food into soil", "Recycling plastic"],
    correct: "Turning food into soil",
    image: "compost",
    ageGroup: "4-6",
    level: 1
  },
  {
    question: "How can we save water?",
    options: ["Turn off tap", "Take long showers", "Wash car every day"],
    correct: "Turn off tap",
    image: "save-water",
    ageGroup: "4-6",
    level: 1
  },
  {
    question: "What should we do with old batteries?",
    options: ["Special bin", "Regular trash", "Burn them"],
    correct: "Special bin",
    image: "batteries",
    ageGroup: "4-6",
    level: 1
  },

  // Level 2
  {
    question: "Why should we recycle paper?",
    options: ["Save trees", "Make more trash", "It's fun"],
    correct: "Save trees",
    image: "recycle-paper",
    ageGroup: "4-6",
    level: 2
  },
  {
    question: "What can we make from recycled plastic?",
    options: ["New bottles", "Food", "Nothing"],
    correct: "New bottles",
    image: "recycled-plastic",
    ageGroup: "4-6",
    level: 2
  },
  {
    question: "Which bin for pizza box with grease?",
    options: ["Compost", "Trash", "Recycling"],
    correct: "Trash",
    image: "pizza-box",
    ageGroup: "4-6",
    level: 2
  },
  {
    question: "How long does plastic bottle take to decompose?",
    options: ["450 years", "1 week", "5 years"],
    correct: "450 years",
    image: "plastic-decompose",
    ageGroup: "4-6",
    level: 2
  },
  {
    question: "What is better than recycling?",
    options: ["Reusing", "Burning", "Throwing away"],
    correct: "Reusing",
    image: "reuse",
    ageGroup: "4-6",
    level: 2
  },

  // Level 3
  {
    question: "Why is littering bad for animals?",
    options: ["They can eat it", "They like it", "It helps them"],
    correct: "They can eat it",
    image: "littering-animals",
    ageGroup: "4-6",
    level: 3
  },
  {
    question: "What does 'reduce' mean?",
    options: ["Use less", "Make smaller", "Throw away"],
    correct: "Use less",
    image: "reduce",
    ageGroup: "4-6",
    level: 3
  },
  {
    question: "How can we reduce plastic waste?",
    options: ["Use cloth bags", "Use more plastic", "Burn plastic"],
    correct: "Use cloth bags",
    image: "cloth-bags",
    ageGroup: "4-6",
    level: 3
  },
  {
    question: "What happens to glass when recycled?",
    options: ["Melted for new glass", "Buried", "Burned"],
    correct: "Melted for new glass",
    image: "recycled-glass",
    ageGroup: "4-6",
    level: 3
  },
  {
    question: "Why should we turn off lights?",
    options: ["Save energy", "Make room dark", "For fun"],
    correct: "Save energy",
    image: "save-energy",
    ageGroup: "4-6",
    level: 3
  },

  // ========== AGE GROUP 7-10 ==========
  // Level 1
  {
    question: "Why is recycling important?",
    options: ["Saves energy", "Makes garbage look nice", "It's a trend"],
    correct: "Saves energy",
    image: "recycling",
    ageGroup: "7-10",
    level: 1
  },
  {
    question: "What does 'reduce' mean in recycling?",
    options: ["Cut things smaller", "Use less stuff", "Make garbage piles smaller"],
    correct: "Use less stuff",
    image: "reduce",
    ageGroup: "7-10",
    level: 1
  },
  {
    question: "What happens to recycled paper?",
    options: ["Buried underground", "Turned into new paper", "Burned for energy"],
    correct: "Turned into new paper",
    image: "recycled-paper",
    ageGroup: "7-10",
    level: 1
  },
  {
    question: "Which material is infinitely recyclable?",
    options: ["Glass", "Plastic", "Paper"],
    correct: "Glass",
    image: "glass-recycle",
    ageGroup: "7-10",
    level: 1
  },
  {
    question: "What is the recycling symbol called?",
    options: ["Mobius loop", "Recycle circle", "Green arrow"],
    correct: "Mobius loop",
    image: "recycling-symbol",
    ageGroup: "7-10",
    level: 1
  },

  // Level 2
  {
    question: "What is e-waste?",
    options: ["Electronic waste", "Food waste", "Paper waste"],
    correct: "Electronic waste",
    image: "e-waste",
    ageGroup: "7-10",
    level: 2
  },
  {
    question: "Why shouldn't batteries go in regular trash?",
    options: ["They have chemicals", "They are heavy", "They are expensive"],
    correct: "They have chemicals",
    image: "battery-chemicals",
    ageGroup: "7-10",
    level: 2
  },
  {
    question: "What is methane gas from landfills?",
    options: ["Greenhouse gas", "Clean air", "Good smell"],
    correct: "Greenhouse gas",
    image: "methane",
    ageGroup: "7-10",
    level: 2
  },
  {
    question: "How does recycling help climate change?",
    options: ["Reduces emissions", "Makes more jobs", "Looks better"],
    correct: "Reduces emissions",
    image: "climate-change",
    ageGroup: "7-10",
    level: 2
  },
  {
    question: "What is single-use plastic?",
    options: ["Used once then thrown", "Strong plastic", "Recyclable plastic"],
    correct: "Used once then thrown",
    image: "single-use-plastic",
    ageGroup: "7-10",
    level: 2
  },

  // Level 3
  {
    question: "What is circular economy?",
    options: ["Reuse everything", "Make more trash", "Buy new things"],
    correct: "Reuse everything",
    image: "circular-economy",
    ageGroup: "7-10",
    level: 3
  },
  {
    question: "Why is Styrofoam hard to recycle?",
    options: ["Takes much space", "It's light", "It breaks easily"],
    correct: "Takes much space",
    image: "styrofoam",
    ageGroup: "7-10",
    level: 3
  },
  {
    question: "What is microplastic?",
    options: ["Tiny plastic pieces", "Small bottles", "Recycled plastic"],
    correct: "Tiny plastic pieces",
    image: "microplastic",
    ageGroup: "7-10",
    level: 3
  },
  {
    question: "How does composting reduce methane?",
    options: ["Aerobic decomposition", "Burning food", "Burying deep"],
    correct: "Aerobic decomposition",
    image: "compost-methane",
    ageGroup: "7-10",
    level: 3
  },
  {
    question: "What is upcycling?",
    options: ["Make better products", "Throw away", "Burn trash"],
    correct: "Make better products",
    image: "upcycling",
    ageGroup: "7-10",
    level: 3
  },
  {
    question: "Why are some plastics not recyclable?",
    options: ["Mixed materials", "They are colorful", "They are small"],
    correct: "Mixed materials",
    image: "non-recyclable-plastic",
    ageGroup: "7-10",
    level: 3
  },
  {
    question: "What is zero waste?",
    options: ["No trash to landfill", "No recycling", "No composting"],
    correct: "No trash to landfill",
    image: "zero-waste",
    ageGroup: "7-10",
    level: 3
  },
  {
    question: "How does food waste affect environment?",
    options: ["Produces methane", "Makes soil better", "Helps plants"],
    correct: "Produces methane",
    image: "food-waste",
    ageGroup: "7-10",
    level: 3
  }
];

const getQuestionsForAgeAndLevel = (ageGroup: AgeGroup, level: DifficultyLevel, count: number = 5) => {
  const filtered = questionBank.filter(q => q.ageGroup === ageGroup && q.level === level);
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getEmojiForImage = (image: string) => {
  const emojiMap: { [key: string]: string } = {
    // Age 1-3 emojis
    'banana': '🍌',
    'paper': '📄',
    'plastic-bottle': '💧',
    'apple-core': '🍎',
    'glass-jar': '🍶',
    'cardboard': '📦',
    'milk-carton': '🥛',
    'newspaper': '📰',
    'broken-toy': '🧸',
    'juice-box': '🧃',
    'recycling': '♻️',
    'clothes': '👕',
    'egg-shells': '🥚',
    
    // Age 4-6 emojis
    'toy': '🧸',
    'plastic-bag': '🛍️',
    'compost': '🍂',
    'save-water': '💦',
    'batteries': '🔋',
    'recycle-paper': '📝',
    'recycled-plastic': '🔄',
    'pizza-box': '🍕',
    'plastic-decompose': '⏰',
    'reuse': '🔁',
    'littering-animals': '🐢',
    'reduce': '📉',
    'cloth-bags': '🛍️',
    'recycled-glass': '🥃',
    'save-energy': '💡',
    
    // Age 7-10 emojis
    'glass-recycle': '🔁',
    'recycling-symbol': '♻️',
    'e-waste': '📱',
    'battery-chemicals': '⚠️',
    'methane': '💨',
    'climate-change': '🌍',
    'single-use-plastic': '🚫',
    'circular-economy': '🔄',
    'styrofoam': '☕',
    'microplastic': '🔬',
    'compost-methane': '🌱',
    'upcycling': '✨',
    'non-recyclable-plastic': '❌',
    'zero-waste': '🚫🗑️',
    'food-waste': '🍎'
  };
  return emojiMap[image] || '🗑️';
};

const getAgeGroupConfig = (ageGroup: AgeGroup) => {
  const configs = {
    '1-3': {
      title: "Recycling Fun!",
      buttonSize: "px-8 py-4 text-2xl",
      emojiSize: "text-8xl",
      textSize: "text-2xl",
      progressHeight: "h-8",
      theme: "from-pink-100 to-purple-100",
      buttonColor: "bg-pink-500 hover:bg-pink-600",
      progressColor: "bg-pink-500",
      cardPadding: "p-6"
    },
    '4-6': {
      title: "Recycling Adventure",
      buttonSize: "px-6 py-3 text-xl",
      emojiSize: "text-6xl",
      textSize: "text-xl",
      progressHeight: "h-6",
      theme: "from-blue-100 to-green-100",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
      progressColor: "bg-blue-500",
      cardPadding: "p-6"
    },
    '7-10': {
      title: "Recycling Challenge",
      buttonSize: "px-4 py-2 text-lg",
      emojiSize: "text-4xl",
      textSize: "text-lg",
      progressHeight: "h-4",
      theme: "from-green-100 to-teal-100",
      buttonColor: "bg-green-500 hover:bg-green-600",
      progressColor: "bg-green-500",
      cardPadding: "p-6"
    }
  };
  return configs[ageGroup];
};

export default function RecyclingQuiz() {
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [level, setLevel] = useState<DifficultyLevel | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animate, setAnimate] = useState("");
  const [showFinalScore, setShowFinalScore] = useState(false);

  const current = questions[index];
  const config = ageGroup ? getAgeGroupConfig(ageGroup) : null;

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const startQuiz = (selectedAgeGroup: AgeGroup, selectedLevel: DifficultyLevel) => {
    setAgeGroup(selectedAgeGroup);
    setLevel(selectedLevel);
    const quizQuestions = getQuestionsForAgeAndLevel(selectedAgeGroup, selectedLevel, 5);
    setQuestions(quizQuestions);
    setIndex(0);
    setScore(0);
  };

  const check = (opt: string) => {
    if (!current) return;

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
    if (ageGroup && level) {
      const quizQuestions = getQuestionsForAgeAndLevel(ageGroup, level, 5);
      setQuestions(quizQuestions);
      setIndex(0);
      setScore(0);
      setFeedback("");
      setShowFinalScore(false);
    }
  };

  const backToSelection = () => {
    setAgeGroup(null);
    setLevel(null);
    setShowFinalScore(false);
  };

  const calculatePercentage = () => {
    return Math.round((score / questions.length) * 100);
  };

  const getScoreMessage = (percentage: number, ageGroup: AgeGroup) => {
    if (percentage === 100) {
      return ageGroup === '1-3' ? "Perfect! You're a recycling superstar! 🌟" :
             ageGroup === '4-6' ? "Amazing! You know everything about recycling! 🏆" :
             "Outstanding! You're a recycling expert! 💫";
    }
    if (percentage >= 80) return "Excellent job!";
    if (percentage >= 60) return "Good work!";
    if (percentage >= 40) return "Nice try!";
    return "Keep learning!";
  };

  // Age Group Selection Screen
  if (!ageGroup || !level) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-6 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-green-800 mb-4">🌍 Recycling Quiz</h1>
          <p className="text-xl text-gray-600">Choose your age group and level to start!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {/* Age Group 1-3 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform">
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">👶</div>
              <h2 className="text-2xl font-bold text-pink-600">Ages 1-3</h2>
              <p className="text-gray-600">Simple & Fun</p>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => startQuiz('1-3', lvl as DifficultyLevel)}
                  className="w-full px-6 py-3 bg-pink-500 text-white rounded-full font-bold hover:bg-pink-600 transition-colors text-lg"
                >
                  Level {lvl} {lvl === 1 ? "🌟" : lvl === 2 ? "🚀" : "🏆"}
                </button>
              ))}
            </div>
          </div>

          {/* Age Group 4-6 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform">
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">👧👦</div>
              <h2 className="text-2xl font-bold text-blue-600">Ages 4-6</h2>
              <p className="text-gray-600">Learning Adventure</p>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => startQuiz('4-6', lvl as DifficultyLevel)}
                  className="w-full px-6 py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-colors text-lg"
                >
                  Level {lvl} {lvl === 1 ? "🌱" : lvl === 2 ? "🌿" : "🌳"}
                </button>
              ))}
            </div>
          </div>

          {/* Age Group 7-10 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform">
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">🧒👧</div>
              <h2 className="text-2xl font-bold text-green-600">Ages 7-10</h2>
              <p className="text-gray-600">Smart Challenge</p>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => startQuiz('7-10', lvl as DifficultyLevel)}
                  className="w-full px-6 py-3 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition-colors text-lg"
                >
                  Level {lvl} {lvl === 1 ? "📚" : lvl === 2 ? "💡" : "🎯"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen
  return (
    <div className={`min-h-screen bg-gradient-to-b ${config?.theme} p-6 flex flex-col text-black`}>
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className={`font-bold mb-4 text-green-800 ${config?.textSize === 'text-2xl' ? 'text-4xl' : config?.textSize === 'text-xl' ? 'text-3xl' : 'text-2xl'}`}>
          {config?.title}
        </h1>
        
        {/* Progress Bar */}
        <div className="w-full max-w-md mb-4">
          <div className="flex justify-between text-gray-600 mb-2">
            <span>Level {level}</span>
            <span>Question {index + 1} of {questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full">
            <div 
              className={`${config?.progressHeight} rounded-full transition-all duration-500 ${config?.progressColor}`}
              style={{ width: `${((index) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {showFinalScore ? (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-2xl max-w-md w-full animate-pop-in">
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
                {getScoreMessage(calculatePercentage(), ageGroup)}
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={restartQuiz}
                  className={`px-6 py-3 ${config?.buttonColor} text-white rounded-full font-bold transition-colors`}
                >
                  Try Again
                </button>
                <button
                  onClick={backToSelection}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-200 transition-colors"
                >
                  Choose Another Level
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center w-full max-w-md">
            {/* Question Card */}
            <div className={`flex-grow max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden ${config?.cardPadding} mb-4`}>
              <div className={`bg-green-200 rounded-lg mb-4 flex items-center justify-center ${config?.emojiSize === 'text-8xl' ? 'h-48' : config?.emojiSize === 'text-6xl' ? 'h-40' : 'h-32'}`}>
                <span className={config?.emojiSize}>
                  {current ? getEmojiForImage(current.image) : '🗑️'}
                </span>
              </div>
              
              <p className={`font-semibold mb-6 text-green-700 ${config?.textSize}`}>
                {current?.question}
              </p>
              
              <div className="flex flex-col gap-3 items-center">
                {current?.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => check(opt)}
                    disabled={!!feedback}
                    className={`w-full rounded-full text-white font-bold transition-all 
                      ${config?.buttonSize} 
                      ${opt === current.correct && feedback.includes("Correct") ? "bg-green-500 scale-105" : 
                        feedback.includes(opt) && !feedback.includes("Correct") ? "bg-red-400" : config?.buttonColor}
                      ${animate === "jump" && opt === current.correct ? "animate-bounce" : 
                        animate === "shake" && opt !== current.correct && feedback.includes(opt) ? "animate-shake" : ""}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <div className={`p-4 rounded-lg max-w-md w-full mb-4
                ${feedback.includes("Correct") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                <p className={`text-center font-bold ${config?.textSize}`}>{feedback}</p>
                {feedback.includes("Correct") && (
                  <p className="mt-2 text-center">Current score: {score}/{questions.length}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confetti */}
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