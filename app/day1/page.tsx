'use client';

import { useState, useEffect } from "react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

// Types
type AgeGroup = '1' | '2' | '3';
type DifficultyLevel = 1 | 2 | 3;
type Question = {
  question: string;
  options: string[];
  correct: string;
  image: string;
  ageGroup: AgeGroup;
  level: DifficultyLevel;
};

const reload = () => {
    window.location.reload();
};

// Enhanced Question Bank with Text-Based Questions for Older Children
const questionBank: Question[] = [
  // ========== AGE GROUP 1 ==========
  // Level 1 (Very Simple - Visual)
  {
    question: "Which bin does the banana go in?",
    options: ["Green Bin", "Blue Bin", "Black Bin"],
    correct: "Green Bin",
    image: "banana",
    ageGroup: "1",
    level: 1
  },
  {
    question: "Where do we put paper?",
    options: ["Blue Bin", "Green Bin", "Yellow Bin"],
    correct: "Blue Bin",
    image: "paper",
    ageGroup: "1",
    level: 1
  },
  {
    question: "Which bin for plastic bottles?",
    options: ["Yellow Bin", "Green Bin", "Red Bin"],
    correct: "Yellow Bin",
    image: "plastic-bottle",
    ageGroup: "1",
    level: 1
  },
  {
    question: "Where does apple core go?",
    options: ["Green Bin", "Blue Bin", "Black Bin"],
    correct: "Green Bin",
    image: "apple-core",
    ageGroup: "1",
    level: 1
  },
  {
    question: "Which bin for glass jar?",
    options: ["Green Bin", "Blue Bin", "Yellow Bin"],
    correct: "Green Bin",
    image: "glass-jar",
    ageGroup: "1",
    level: 1
  },

  // Level 2
  {
    question: "Which one goes in the green bin?",
    options: ["Apple Core", "Plastic Bottle", "Newspaper"],
    correct: "Apple Core",
    image: "apple-core",
    ageGroup: "1",
    level: 2
  },
  {
    question: "What do we do with plastic bottles?",
    options: ["Yellow Bin", "Green Bin", "Throw Away"],
    correct: "Yellow Bin",
    image: "plastic-bottle",
    ageGroup: "1",
    level: 2
  },
  {
    question: "Where should we put cardboard box?",
    options: ["Blue Bin", "Green Bin", "Black Bin"],
    correct: "Blue Bin",
    image: "cardboard",
    ageGroup: "1",
    level: 2
  },

  // Level 3
  {
    question: "Which bin for broken toy?",
    options: ["Black Bin", "Green Bin", "Yellow Bin"],
    correct: "Black Bin",
    image: "broken-toy",
    ageGroup: "1",
    level: 3
  },
  {
    question: "What should we do with old clothes?",
    options: ["Donate", "Throw Away", "Burn"],
    correct: "Donate",
    image: "clothes",
    ageGroup: "1",
    level: 3
  },

  // ========== AGE GROUP 2 ==========
  // Level 1 (Mix of Visual and Simple Text)
  {
    question: "What should you do with an old toy?",
    options: ["Throw away", "Donate it", "Burn it"],
    correct: "Donate it",
    image: "toy",
    ageGroup: "2",
    level: 1
  },
  {
    question: "Which item takes longest to decompose?",
    options: ["Banana Peel", "Plastic Bag", "Paper"],
    correct: "Plastic Bag",
    image: "plastic-bag",
    ageGroup: "2",
    level: 1
  },
  {
    question: "What is composting?",
    options: ["Burning trash", "Turning food into soil", "Recycling plastic"],
    correct: "Turning food into soil",
    image: "compost",
    ageGroup: "2",
    level: 1
  },

  // Level 2 (More Text-Based)
  {
    question: "Why should we recycle paper instead of throwing it away?",
    options: ["To save trees and energy", "Because it's heavy", "It looks better"],
    correct: "To save trees and energy",
    image: "recycle-paper",
    ageGroup: "2",
    level: 2
  },
  {
    question: "What happens when we recycle plastic bottles?",
    options: ["They become new products", "They disappear", "They turn into food"],
    correct: "They become new products",
    image: "recycled-plastic",
    ageGroup: "2",
    level: 2
  },
  {
    question: "Why is littering bad for the environment?",
    options: ["It can harm animals and plants", "It makes things colorful", "It's not really bad"],
    correct: "It can harm animals and plants",
    image: "littering",
    ageGroup: "2",
    level: 2
  },

  // Level 3 (Mostly Text-Based)
  {
    question: "What does 'reduce' mean in 'reduce, reuse, recycle'?",
    options: ["Use less stuff to make less trash", "Make things smaller", "Throw things away faster"],
    correct: "Use less stuff to make less trash",
    image: "reduce",
    ageGroup: "2",
    level: 3
  },
  {
    question: "How does using a reusable water bottle help the environment?",
    options: ["It creates less plastic waste", "It makes water colder", "It's more expensive"],
    correct: "It creates less plastic waste",
    image: "reusable-bottle",
    ageGroup: "2",
    level: 3
  },

  // ========== AGE GROUP 3 ==========
  // Level 1 (Text-Based with Simple Concepts)
  {
    question: "What is the primary environmental benefit of recycling aluminum cans?",
    options: [
      "Saves 95% of the energy needed to make new aluminum",
      "Makes them shinier",
      "Changes their color",
      "Makes them heavier"
    ],
    correct: "Saves 95% of the energy needed to make new aluminum",
    image: "aluminum-cans",
    ageGroup: "3",
    level: 1
  },
  {
    question: "Why are some plastics difficult to recycle?",
    options: [
      "They are made from mixed materials that are hard to separate",
      "They are too colorful",
      "They smell bad",
      "They are too light"
    ],
    correct: "They are made from mixed materials that are hard to separate",
    image: "plastic-recycling",
    ageGroup: "3",
    level: 1
  },
  {
    question: "What is the main purpose of a materials recovery facility (MRF)?",
    options: [
      "To sort and prepare recyclables for manufacturing",
      "To burn trash for energy",
      "To store garbage underground",
      "To create new raw materials from scratch"
    ],
    correct: "To sort and prepare recyclables for manufacturing",
    image: "mrf",
    ageGroup: "3",
    level: 1
  },

  // Level 2 (More Complex Text-Based Questions)
  {
    question: "How does the process of composting contribute to reducing greenhouse gas emissions?",
    options: [
      "It produces carbon-rich soil that sequesters carbon",
      "It burns methane gas for energy",
      "It turns waste into oxygen",
      "It makes garbage disappear completely"
    ],
    correct: "It produces carbon-rich soil that sequesters carbon",
    image: "compost-benefits",
    ageGroup: "3",
    level: 2
  },
  {
    question: "What is the significance of the resin identification code on plastic products?",
    options: [
      "It identifies the type of plastic for recycling purposes",
      "It shows when the plastic was made",
      "It indicates the product's quality",
      "It tells you if the plastic is safe to eat from"
    ],
    correct: "It identifies the type of plastic for recycling purposes",
    image: "resin-codes",
    ageGroup: "3",
    level: 2
  },
  {
    question: "Why is it important to rinse food containers before recycling them?",
    options: [
      "To prevent contamination of other recyclables",
      "To make them look cleaner",
      "To remove the labels",
      "To make them weigh less"
    ],
    correct: "To prevent contamination of other recyclables",
    image: "rinse-containers",
    ageGroup: "3",
    level: 2
  },
  {
    question: "What economic benefit does recycling provide to communities?",
    options: [
      "Creates jobs and reduces waste management costs",
      "Makes garbage collection free",
      "Increases property taxes",
      "Eliminates the need for landfills entirely"
    ],
    correct: "Creates jobs and reduces waste management costs",
    image: "economic-benefits",
    ageGroup: "3",
    level: 2
  },

  // Level 3 (Advanced Text-Based Questions)
  {
    question: "How does the concept of 'extended producer responsibility' impact waste management?",
    options: [
      "Makes manufacturers responsible for their products' entire lifecycle",
      "Forces consumers to pay more for recycling",
      "Bans all plastic production",
      "Requires governments to collect all waste"
    ],
    correct: "Makes manufacturers responsible for their products' entire lifecycle",
    image: "epr",
    ageGroup: "3",
    level: 3
  },
  {
    question: "What is the relationship between recycling and climate change mitigation?",
    options: [
      "Recycling reduces energy consumption and greenhouse gas emissions",
      "Recycling creates more carbon dioxide",
      "Recycling has no impact on climate change",
      "Recycling increases global temperatures"
    ],
    correct: "Recycling reduces energy consumption and greenhouse gas emissions",
    image: "climate-impact",
    ageGroup: "3",
    level: 3
  },
  {
    question: "Why is closed-loop recycling considered more sustainable than open-loop recycling?",
    options: [
      "It maintains materials at their highest value through multiple lifecycles",
      "It uses more energy in the process",
      "It only works for plastic materials",
      "It requires less consumer participation"
    ],
    correct: "It maintains materials at their highest value through multiple lifecycles",
    image: "closed-loop",
    ageGroup: "3",
    level: 3
  },
  {
    question: "What role does chemical recycling play in managing plastic waste?",
    options: [
      "It breaks down plastics to molecular level for new products",
      "It burns plastic for energy recovery",
      "It melts plastic into different shapes",
      "It buries plastic deep underground"
    ],
    correct: "It breaks down plastics to molecular level for new products",
    image: "chemical-recycling",
    ageGroup: "3",
    level: 3
  },
  {
    question: "How do deposit return systems improve recycling rates for beverage containers?",
    options: [
      "They provide financial incentives for returning containers",
      "They make containers biodegradable",
      "They reduce the size of containers",
      "They eliminate the need for recycling bins"
    ],
    correct: "They provide financial incentives for returning containers",
    image: "deposit-return",
    ageGroup: "3",
    level: 3
  },
  {
    question: "What is the environmental impact of microplastics from degraded plastic waste?",
    options: [
      "They enter food chains and harm ecosystems",
      "They make ocean water cleaner",
      "They help marine animals grow",
      "They dissolve completely in water"
    ],
    correct: "They enter food chains and harm ecosystems",
    image: "microplastics",
    ageGroup: "3",
    level: 3
  },
  {
    question: "Why is source separation more effective than single-stream recycling?",
    options: [
      "It reduces contamination and improves material quality",
      "It requires more collection trucks",
      "It's more confusing for residents",
      "It processes materials faster"
    ],
    correct: "It reduces contamination and improves material quality",
    image: "source-separation",
    ageGroup: "3",
    level: 3
  },
  {
    question: "How does waste-to-energy technology complement recycling programs?",
    options: [
      "It manages non-recyclable waste while generating energy",
      "It replaces the need for recycling entirely",
      "It makes recycling more expensive",
      "It only works for organic waste"
    ],
    correct: "It manages non-recyclable waste while generating energy",
    image: "waste-to-energy",
    ageGroup: "3",
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
    // Age 1 emojis
    'banana': '🍌',
    'paper': '📄',
    'plastic-bottle': '💧',
    'apple-core': '🍎',
    'glass-jar': '🍶',
    'cardboard': '📦',
    'broken-toy': '🧸',
    'clothes': '👕',
    
    // Age 2 emojis
    'toy': '🧸',
    'plastic-bag': '🛍️',
    'compost': '🍂',
    'recycle-paper': '📝',
    'recycled-plastic': '🔄',
    'littering': '🚯',
    'reduce': '📉',
    'reusable-bottle': '💧',
    
    // Age 3 emojis (minimal emojis for older kids)
    'aluminum-cans': '🥫',
    'plastic-recycling': '♻️',
    'mrf': '🏭',
    'compost-benefits': '🌱',
    'resin-codes': '🔢',
    'rinse-containers': '💦',
    'economic-benefits': '💰',
    'epr': '🏢',
    'climate-impact': '🌍',
    'closed-loop': '🔄',
    'chemical-recycling': '🧪',
    'deposit-return': '🏦',
    'microplastics': '🔬',
    'source-separation': '📊',
    'waste-to-energy': '⚡'
  };
  return emojiMap[image] || '🗑️';
};

const getAgeGroupConfig = (ageGroup: AgeGroup) => {
  const configs = {
    '1': {
      title: "Recycling Fun!",
      buttonSize: "px-8 py-4 text-2xl",
      emojiSize: "text-8xl",
      textSize: "text-2xl",
      questionSize: "text-2xl",
      progressHeight: "h-8",
      theme: "from-pink-100 to-purple-100",
      buttonColor: "bg-pink-500 hover:bg-pink-600",
      progressColor: "bg-pink-500",
      cardPadding: "p-6",
      emojiContainerHeight: "h-48",
      showEmoji: true,
      maxWidth: "max-w-md"
    },
    '2': {
      title: "Recycling Adventure",
      buttonSize: "px-6 py-3 text-xl",
      emojiSize: "text-6xl",
      textSize: "text-xl",
      questionSize: "text-xl",
      progressHeight: "h-6",
      theme: "from-blue-100 to-green-100",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
      progressColor: "bg-blue-500",
      cardPadding: "p-6",
      emojiContainerHeight: "h-40",
      showEmoji: true,
      maxWidth: "max-w-md"
    },
    '3': {
      title: "Recycling Challenge",
      buttonSize: "px-4 py-3 text-base",
      emojiSize: "text-4xl",
      textSize: "text-base",
      questionSize: "text-lg",
      progressHeight: "h-4",
      theme: "from-green-100 to-teal-100",
      buttonColor: "bg-green-500 hover:bg-green-600",
      progressColor: "bg-green-500",
      cardPadding: "p-6",
      emojiContainerHeight: "h-24",
      showEmoji: false,
      maxWidth: "max-w-2xl"
    }
  };
  return configs[ageGroup];
};

// Helper functions to save and load from localStorage
const saveQuizSettings = (ageGroup: AgeGroup, level: DifficultyLevel) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('recyclingQuizSettings', JSON.stringify({ ageGroup, level }));
  }
};

const loadQuizSettings = (): { ageGroup: AgeGroup | null; level: DifficultyLevel | null } => {
  if (typeof window !== 'undefined') {
    try {
      const settings = localStorage.getItem('recyclingQuizSettings');
      if (settings) {
        const { ageGroup, level } = JSON.parse(settings);
        if (['1', '2', '3'].includes(ageGroup) && [1, 2, 3].includes(level)) {
          return { ageGroup, level };
        }
      }
    } catch (error) {
      console.error('Error loading quiz settings from localStorage:', error);
    }
  }
  return { ageGroup: null, level: null };
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
  const [isClient, setIsClient] = useState(false);
  const [submittedScore, setSubmittedScore] = useState(false);   // guard to avoid double submits
  const [submittedStatus, setSubmittedStatus] = useState(false); // guard for status submit

  // NEW: ensure we fetch & store settings BEFORE loading UI
  const [bootstrapped, setBootstrapped] = useState(false);

  const current = questions[index];
  const config = ageGroup ? getAgeGroupConfig(ageGroup) : null;

  // Fetch level info and save to localStorage as { ageGroup, level } — THEN mark bootstrapped
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const fetchLevelSettings = async () => {
      try {
        const res = await fetch("http://localhost:8085/api/student-course/level/full", {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch level data");
        const data = await res.json();

        const apiAgeGroup: AgeGroup = (data.ageGroup?.toString() as AgeGroup) ?? '1';
        const apiLevel: DifficultyLevel = (Number(data.overallLevelCode) as DifficultyLevel) ?? 1;

        localStorage.setItem(
          "recyclingQuizSettings",
          JSON.stringify({ ageGroup: apiAgeGroup, level: apiLevel })
        );
        console.log("Saved recyclingQuizSettings:", { ageGroup: apiAgeGroup, level: apiLevel });
      } catch (err) {
        console.error("Error fetching level settings:", err);
        // Even if it fails, proceed so UI isn't stuck
      } finally {
        setBootstrapped(true); // signal that localStorage is ready (or attempted)
      }
    };

    if (typeof window !== "undefined") {
      fetchLevelSettings();
    }
  }, []);

  // Load saved settings ONLY AFTER bootstrapping is done
  useEffect(() => {
    if (!bootstrapped) return;
    setIsClient(true);
    const savedSettings = loadQuizSettings();
    if (savedSettings.ageGroup && savedSettings.level) {
      setAgeGroup(savedSettings.ageGroup);
      setLevel(savedSettings.level);
      const quizQuestions = getQuestionsForAgeAndLevel(savedSettings.ageGroup, savedSettings.level, 5);
      setQuestions(quizQuestions);
    }
  }, [bootstrapped]);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const startQuiz = (selectedAgeGroup: AgeGroup, selectedLevel: DifficultyLevel) => {
    saveQuizSettings(selectedAgeGroup, selectedLevel);
    setAgeGroup(selectedAgeGroup);
    setLevel(selectedLevel);
    const quizQuestions = getQuestionsForAgeAndLevel(selectedAgeGroup, selectedLevel, 5);
    setQuestions(quizQuestions);
    setIndex(0);
    setScore(0);
    setFeedback("");
    setShowFinalScore(false);
    setSubmittedScore(false);
    setSubmittedStatus(false);
  };

  const calculatePercentage = () => {
    return Math.round((score / questions.length) * 100);
  };

  // Submit score to backend using level as "day"
  const submitScoreToBackend = async (day: number, percentage: number) => {
    try {
      const token = localStorage.getItem("authToken");
      const url = `http://localhost:8085/api/student-course/day/${day}/score`;
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ score: percentage })
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`Score submit failed: ${res.status} ${t}`);
      }
      console.log("Score submitted:", { day, percentage });
      setSubmittedScore(true);
    } catch (e) {
      console.error(e);
    }
  };

  // Submit status to backend using level as "day"
  const submitStatusToBackend = async (day: number, status: "COMPLETED" | "IN_PROGRESS" | "NOT_START") => {
    try {
      const token = localStorage.getItem("authToken");
      const url = `http://localhost:8085/api/student-course/day/${day}/status`;
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`Status submit failed: ${res.status} ${t}`);
      }
      console.log("Status submitted:", { day, status });
      setSubmittedStatus(true);
    } catch (e) {
      console.error(e);
    }
  };

  const check = (opt: string) => {
    if (!current) return;

    if (opt === current.correct) {
      setFeedback("🎉 Correct!");
      setScore(prev => prev + 1);
      setShowConfetti(true);
      setAnimate("jump");
    } else {
      setFeedback(`❌ Incorrect! The correct answer is: ${current.correct}`);
      setAnimate("shake");
    }
    
    setTimeout(() => {
      setFeedback("");
      setAnimate("");
      
      const isLast = index === questions.length - 1;

      if (isLast) {
        setShowFinalScore(true);

        // compute final percentage with the just-clicked answer accounted for
        const finalCorrect = opt === current.correct ? score + 1 : score;
        const pct = Math.round((finalCorrect / questions.length) * 100);

        // Submit both score and status once
        if (level) {
          if (!submittedScore) submitScoreToBackend(level, pct);
          if (!submittedStatus) submitStatusToBackend(level, "COMPLETED");
        }
      } else {
        setIndex(index + 1);
      }
    }, 3000);
  };

  const restartQuiz = () => {
    if (ageGroup && level) {
      const quizQuestions = getQuestionsForAgeAndLevel(ageGroup, level, 5);
      setQuestions(quizQuestions);
      setIndex(0);
      setScore(0);
      setFeedback("");
      setShowFinalScore(false);
      setSubmittedScore(false);
      setSubmittedStatus(false);
    }
  };

  const backToSelection = () => {
    setAgeGroup(null);
    setLevel(null);
    setShowFinalScore(false);
    setSubmittedScore(false);
    setSubmittedStatus(false);
  };

  const getScoreMessage = (percentage: number, ageGroup: AgeGroup) => {
    if (percentage === 100) {
      return ageGroup === '1' ? "Perfect! You're a recycling superstar! 🌟" :
             ageGroup === '2' ? "Amazing! You know everything about recycling! 🏆" :
             "Outstanding! You're a recycling expert! 💫";
    }
    if (percentage >= 80) return "Excellent job!";
    if (percentage >= 60) return "Good work!";
    if (percentage >= 40) return "Nice try!";
    return "Keep learning!";
  };

  // Show loading state during SSR and until client-side hydration is complete
  if (!isClient || !bootstrapped) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-green-800 mb-4">🌍 Recycling Quiz</h1>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Age Group Selection Screen
  if (!ageGroup || !level) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-6 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-green-800 mb-4">🌍 Recycling Quiz</h1>
        <p className="text-xl text-gray-600">Choose your age group and level to start!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {/* Age Group 1 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform">
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">👶</div>
              <h2 className="text-2xl font-bold text-pink-600">Ages 1-3</h2>
              <p className="text-gray-600">Simple & Visual</p>
              <p className="text-sm text-gray-500 mt-2">Big buttons, pictures, simple choices</p>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => startQuiz('1', lvl as DifficultyLevel)}
                  className="w-full px-6 py-3 bg-pink-500 text-white rounded-full font-bold hover:bg-pink-600 transition-colors text-lg"
                >
                  Level {lvl} {lvl === 1 ? "🌟" : lvl === 2 ? "🚀" : "🏆"}
                </button>
              ))}
            </div>
          </div>

          {/* Age Group 2 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform">
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">👧👦</div>
              <h2 className="text-2xl font-bold text-blue-600">Ages 4-6</h2>
              <p className="text-gray-600">Learning Adventure</p>
              <p className="text-sm text-gray-500 mt-2">Mix of pictures and simple text</p>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => startQuiz('2', lvl as DifficultyLevel)}
                  className="w-full px-6 py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-colors text-lg"
                >
                  Level {lvl} {lvl === 1 ? "🌱" : lvl === 2 ? "🌿" : "🌳"}
                </button>
              ))}
            </div>
          </div>

          {/* Age Group 3 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform">
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">🧒👧</div>
              <h2 className="text-2xl font-bold text-green-600">Ages 7-10</h2>
              <p className="text-gray-600">Advanced Challenge</p>
              <p className="text-sm text-gray-500 mt-2">Text-based, complex questions</p>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => startQuiz('3', lvl as DifficultyLevel)}
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
    <div className={`min-h-screen bg-gradient-to-b ${config?.theme} flex flex-col`}>
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center mt-5">
        <h1 className={`font-bold mb-4 text-green-800 ${config?.textSize === 'text-2xl' ? 'text-4xl' : config?.textSize === 'text-xl' ? 'text-3xl' : 'text-2xl'}`}>
          {config?.title}
        </h1>
        
        {/* Progress Bar */}
        <div className={`w-full ${config?.maxWidth} mb-4`}>
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
                  onClick={reload}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-200 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center w-full">
            {/* Question Card */}
            <div className={`flex-grow w-full bg-white rounded-2xl shadow-lg overflow-hidden ${config?.cardPadding} mb-4 ${config?.maxWidth}`}>
              {/* Emoji Container - Only show for younger ages */}
              {config?.showEmoji && (
                <div className={`bg-green-200 rounded-lg mb-4 flex items-center justify-center ${config?.emojiContainerHeight}`}>
                  <span className={config?.emojiSize}>
                    {current ? getEmojiForImage(current.image) : '🗑️'}
                  </span>
                </div>
              )}
              
              <p className={`font-semibold mb-6 text-green-700 ${config?.questionSize} text-center`}>
                {current?.question}
              </p>
              
              <div className="flex flex-col gap-3 items-center">
                {current?.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => check(opt)}
                    disabled={!!feedback}
                    className={`w-full rounded-lg text-white font-bold transition-all text-left
                      ${config?.buttonSize} 
                      ${opt === current.correct && feedback.includes("Correct") ? "bg-green-500 scale-105" : 
                        feedback.includes(opt) && !feedback.includes("Correct") ? "bg-red-400" : config?.buttonColor}
                      ${animate === "jump" && opt === current.correct ? "animate-bounce" : 
                        animate === "shake" && opt !== current.correct && feedback.includes(opt) ? "animate-shake" : ""}
                      ${ageGroup === '3' ? 'px-6 leading-relaxed' : ''}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <div className={`p-4 rounded-lg w-full mb-4 ${config?.maxWidth}
                ${feedback.includes("Correct") ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border-red-300"}`}>
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
