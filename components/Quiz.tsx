
import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { generateQuiz } from '../services/geminiService';

interface QuizProps {
  onComplete: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      const data = await generateQuiz();
      setQuestions(data);
      setLoading(false);
    };
    fetchQuiz();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-24 h-24 bg-orange-400 rounded-full animate-bounce flex items-center justify-center text-5xl mb-6 shadow-xl">
          🦧
        </div>
        <p className="text-3xl font-black text-orange-600 text-center animate-pulse">
          Wait for the monkeys...<br/>
          <span className="text-xl">Building your game!</span>
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    setShowExplanation(true);
    if (answer === currentQuestion.correctAnswer) {
      setScore(s => s + 10);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      onComplete(score);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Visual Progress Bar */}
      <div className="mb-10 flex flex-col items-center gap-4">
        <div className="flex justify-between w-full px-2">
            <span className="text-4xl">🏝️</span>
            <span className="text-4xl">🍌</span>
        </div>
        <div className="h-8 w-full bg-white rounded-full p-2 border-4 border-green-100 shadow-inner overflow-hidden relative">
          <div 
            className="h-full bg-green-400 rounded-full transition-all duration-700 ease-out relative" 
            style={{ width: `${progress}%` }}
          >
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl">🦧</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border-b-[12px] border-orange-100 relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 font-black px-8 py-2 rounded-full shadow-lg border-4 border-white">
            QUESTION {currentIndex + 1}
        </div>

        <h2 className="text-3xl md:text-5xl font-black text-gray-800 mb-10 text-center leading-tight mt-4">
          {currentQuestion.question}
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {currentQuestion.options.map((option, idx) => {
            const isCorrect = option === currentQuestion.correctAnswer;
            const isSelected = option === selectedAnswer;
            
            let btnClass = "p-6 md:p-10 text-center rounded-3xl text-2xl md:text-4xl font-black transition-all border-b-[8px] ";
            
            if (selectedAnswer) {
                if (isCorrect) btnClass += "bg-green-400 border-green-600 text-white scale-105 sticker-pop";
                else if (isSelected) btnClass += "bg-red-400 border-red-600 text-white opacity-50";
                else btnClass += "bg-gray-100 border-gray-200 text-gray-300";
            } else {
                btnClass += "bg-white border-orange-200 hover:border-orange-400 text-gray-700 hover:-translate-y-1 hover:bg-orange-50 active:translate-y-2 active:border-b-0";
            }

            return (
              <button
                key={idx}
                disabled={!!selectedAnswer}
                onClick={() => handleAnswer(option)}
                className={btnClass}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-12 bg-yellow-50 p-8 rounded-[2rem] border-4 border-dashed border-yellow-200 text-center sticker-pop">
            <div className="text-6xl mb-4">
              {selectedAnswer === currentQuestion.correctAnswer ? "✨🌟✨" : "🧡"}
            </div>
            <p className="text-2xl font-black text-yellow-800 mb-8">
              {currentQuestion.explanation}
            </p>
            <button 
              onClick={handleNext}
              className="bg-orange-500 text-white text-3xl font-black px-12 py-6 rounded-full shadow-xl hover:bg-orange-600 transition-transform active:scale-95 border-b-[8px] border-orange-700"
            >
              Next One! 👉
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
