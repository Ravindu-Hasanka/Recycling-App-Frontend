'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getStoryByTitle, updateProgress } from '@/app/api/story-api';
import { Story } from '@/app/types/story';

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    id: string;
    label: string;
    binType: 'plastic' | 'paper' | 'glass' | 'organic' | 'metal' | 'general';
    isCorrect: boolean;
  }[];
  itemImage: string;
  explanation: string;
}

interface ScoreData {
  correct: number;
  total: number;
  streak: number;
  maxStreak: number;
}

const SchoolProjectGame = () => {
  // Game state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [scoreData, setScoreData] = useState<ScoreData>({
    correct: 0,
    total: 0,
    streak: 0,
    maxStreak: 0
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

  // Quiz questions data
  const [quizQuestions] = useState<QuizQuestion[]>([
    {
      id: 1,
      question: "Where does the milk carton go?",
      itemImage: "/images/trash/milk-carton.png",
      options: [
        { id: "A", label: "Paper Bin", binType: "paper", isCorrect: true },
        { id: "B", label: "Plastic Bin", binType: "plastic", isCorrect: false },
        { id: "C", label: "Glass Bin", binType: "glass", isCorrect: false },
        { id: "D", label: "Food Waste Bin", binType: "organic", isCorrect: false }
      ],
      explanation: "Milk cartons are made from paperboard with a thin plastic coating, so they go in the paper recycling!"
    },
    {
      id: 2,
      question: "How should you dispose of a broken lightbulb?",
      itemImage: "/images/trash/lightbulb.png",
      options: [
        { id: "A", label: "Glass Bin", binType: "glass", isCorrect: false },
        { id: "B", label: "General Waste", binType: "general", isCorrect: true },
        { id: "C", label: "Metal Bin", binType: "metal", isCorrect: false },
        { id: "D", label: "Special Hazardous Waste", binType: "general", isCorrect: false }
      ],
      explanation: "Broken lightbulbs shouldn't go in glass recycling as they contain different materials. Wrap them and place in general waste."
    },
    {
      id: 3,
      question: "What bin does pizza cardboard go in?",
      itemImage: "/images/trash/pizza-box.png",
      options: [
        { id: "A", label: "Food Waste Bin", binType: "organic", isCorrect: false },
        { id: "B", label: "Paper Bin", binType: "paper", isCorrect: true },
        { id: "C", label: "General Waste", binType: "general", isCorrect: false },
        { id: "D", label: "It depends on grease stains", binType: "paper", isCorrect: true }
      ],
      explanation: "Clean pizza boxes can be recycled with paper. Greasy boxes should go in compost or general waste."
    },
    {
      id: 4,
      question: "Where should plastic utensils go?",
      itemImage: "/images/trash/plastic-utensils.png",
      options: [
        { id: "A", label: "Plastic Bin", binType: "plastic", isCorrect: false },
        { id: "B", label: "General Waste", binType: "general", isCorrect: true },
        { id: "C", label: "Metal Bin", binType: "metal", isCorrect: false },
        { id: "D", label: "Food Waste Bin", binType: "organic", isCorrect: false }
      ],
      explanation: "Most plastic utensils are not recyclable due to their size and material mix, so they go in general waste."
    },
    {
      id: 5,
      question: "How should you dispose of aluminum foil?",
      itemImage: "/images/trash/aluminum-foil.png",
      options: [
        { id: "A", label: "General Waste", binType: "general", isCorrect: false },
        { id: "B", label: "Metal Bin", binType: "metal", isCorrect: true },
        { id: "C", label: "Plastic Bin", binType: "plastic", isCorrect: false },
        { id: "D", label: "Food Waste Bin", binType: "organic", isCorrect: false }
      ],
      explanation: "Clean aluminum foil can be recycled with metals. Make sure to clean it first!"
    }
  ]);

  // Initialize game
  useEffect(() => {
    setCurrentQuestion(0);
    setScore(0);
    setShowFeedback(false);
    setIsCorrect(false);
    setSelectedOption(null);
    setQuizCompleted(false);
    setScoreData({
      correct: 0,
      total: 0,
      streak: 0,
      maxStreak: 0
    });
  }, []);

  // Handle option selection
  const handleOptionSelect = (optionId: string, isCorrect: boolean) => {
    setSelectedOption(optionId);
    setIsCorrect(isCorrect);
    setShowFeedback(true);

    if (isCorrect) {
      setScore(prev => prev + 100);
      setScoreData(prev => ({
        correct: prev.correct + 1,
        total: prev.total + 1,
        streak: prev.streak + 1,
        maxStreak: Math.max(prev.maxStreak, prev.streak + 1)
      }));
    } else {
      setScoreData(prev => ({
        ...prev,
        total: prev.total + 1,
        streak: 0
      }));
    }

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setShowFeedback(false);
        setSelectedOption(null);
      } else {
        setQuizCompleted(true);
      }
    }, 3000);
  };

  // Restart quiz
  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowFeedback(false);
    setIsCorrect(false);
    setSelectedOption(null);
    setQuizCompleted(false);
    setScoreData({
      correct: 0,
      total: 0,
      streak: 0,
      maxStreak: 0
    });
  };

  const currentQ = quizQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-4 md:p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-5 text-4xl opacity-20">📚</div>
        <div className="absolute top-20 right-10 text-4xl opacity-20">📝</div>
        <div className="absolute bottom-20 left-20 text-4xl opacity-20">✏️</div>
        <div className="absolute bottom-10 right-20 text-4xl opacity-20">🔬</div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-2">School Recycling Project</h1>
          <p className="text-sm md:text-lg text-indigo-600">
            Test your knowledge and teach your classmates about recycling!
          </p>

          <div className="flex justify-center items-center mt-4 gap-4 md:gap-6">
            <div className="bg-white rounded-full px-3 py-1 md:px-4 md:py-2 shadow-md flex items-center">
              <span className="text-lg mr-1">⭐</span>
              <span className="font-bold text-indigo-700">Score: {score}</span>
            </div>
            <div className="bg-white rounded-full px-3 py-1 md:px-4 md:py-2 shadow-md flex items-center">
              <span className="text-lg mr-1">❓</span>
              <span className="font-bold text-blue-700">
                Question: {currentQuestion + 1}/{quizQuestions.length}
              </span>
            </div>
            <div className="bg-white rounded-full px-3 py-1 md:px-4 md:py-2 shadow-md flex items-center">
              <span className="text-lg mr-1">🔥</span>
              <span className="font-bold text-purple-700">
                Streak: {scoreData.streak}
              </span>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
          {!quizCompleted ? (
            <>
              {/* Question area */}
              <div className="bg-blue-50 rounded-lg p-4 md:p-6 mb-6 md:mb-8 text-center">
                <h3 className="text-lg md:text-xl font-bold text-blue-800 mb-4">
                  {currentQ.question}
                </h3>

                {/* Item image */}
                <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-lg shadow-md flex items-center justify-center p-4">
                  <Image
                    src={currentQ.itemImage}
                    alt={currentQ.question}
                    width={128}
                    height={128}
                    className="object-contain"
                  />
                </div>

                {/* Options grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-black">
                  {currentQ.options.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id, option.isCorrect)}
                      disabled={showFeedback}
                      className={`p-4 rounded-lg text-left transition-all duration-200 ${selectedOption === option.id
                        ? option.isCorrect
                          ? 'bg-green-100 border-2 border-green-500'
                          : 'bg-red-100 border-2 border-red-500'
                        : 'bg-white border border-gray-200 hover:border-blue-300'
                        } ${showFeedback && option.isCorrect ? 'bg-green-100 border-2 border-green-500' : ''}`}
                    >
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${selectedOption === option.id
                          ? option.isCorrect
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                          } ${showFeedback && option.isCorrect ? 'bg-green-500 text-white' : ''}`}>
                          {option.id}
                        </div>
                        <span className="font-medium">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Feedback */}
                {showFeedback && (
                  <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    <p className="font-bold">{isCorrect ? '✅ Correct! Great job!' : '❌ Not quite right.'}</p>
                    <p className="mt-2">{currentQ.explanation}</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Quiz Completed Screen */
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-indigo-700 mb-2">Quiz Completed!</h3>
              <p className="text-indigo-600 mb-2">
                You've taught your classmates about recycling!
              </p>

              {/* Score summary */}
              <div className="bg-indigo-50 rounded-xl p-6 mb-6 max-w-md mx-auto">
                <h4 className="text-lg font-bold text-indigo-800 mb-4">Your Results</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-2xl font-bold text-indigo-700">{scoreData.correct}/{scoreData.total}</p>
                    <p className="text-sm text-indigo-600">Correct Answers</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-2xl font-bold text-indigo-700">{scoreData.maxStreak}</p>
                    <p className="text-sm text-indigo-600">Best Streak</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm col-span-2">
                    <p className="text-2xl font-bold text-indigo-700">{score}</p>
                    <p className="text-sm text-indigo-600">Total Score</p>
                  </div>
                </div>
              </div>

              {/* Reward */}
              <div className="my-6">
                <div className="inline-block bg-yellow-100 rounded-full p-4 shadow-lg">
                  <span className="text-4xl">📗</span>
                </div>
                <p className="text-amber-700 font-bold mt-2">Eco-Book Unlocked!</p>
              </div>

              {/* Class celebration */}
              <div className="class-celebration flex justify-center gap-4 text-3xl my-4">
                <span className="animate-bounce">👏</span>
                <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>👏</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>👏</span>
                <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>👏</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>👏</span>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={restartQuiz}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md mt-4"
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
                    router.push("/story/animation/11");
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md mt-4"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Educational Content */}
        <div className="bg-green-50 rounded-xl p-4 md:p-6 border border-green-200 mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-bold text-green-800 mb-2 flex items-center">
            <span className="mr-2">📚</span> Did You Know?
          </h3>
          <p className="text-green-700 text-sm md:text-base">
            Education is one of the most powerful tools for environmental change. When students learn
            about recycling, they often teach their families too, creating a ripple effect in the community!
          </p>
        </div>

        {/* Recycling Tips */}
        <div className="bg-indigo-50 rounded-xl p-4 md:p-6 border border-indigo-200">
          <h3 className="text-base md:text-lg font-bold text-indigo-800 mb-2 flex items-center">
            <span className="mr-2">💡</span> Classroom Recycling Tips
          </h3>
          <ul className="list-disc pl-5 text-indigo-700 text-sm md:text-base">
            <li>Set up clearly labeled recycling stations in classrooms</li>
            <li>Create educational posters about what goes in each bin</li>
            <li>Start a recycling club to promote environmental awareness</li>
            <li>Organize field trips to local recycling facilities</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SchoolProjectGame;
