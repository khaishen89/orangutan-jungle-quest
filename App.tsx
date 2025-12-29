
import React, { useState } from 'react';
import Header from './components/Header.tsx';
import Quiz from './components/Quiz.tsx';
import FunFacts from './components/FunFacts.tsx';
import Leaderboard from './components/Leaderboard.tsx';
import { GameState, ScoreEntry } from './types.ts';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<GameState>(GameState.HOME);
  const [userName, setUserName] = useState<string>('');
  const [finalScore, setFinalScore] = useState<number>(0);

  const handleQuizComplete = (score: number) => {
    setFinalScore(score);
    setCurrentView(GameState.GAME_OVER);
  };

  const saveScore = () => {
    if (!userName.trim()) return;
    const newScore: ScoreEntry = {
      id: Math.random().toString(36).substr(2, 9),
      name: userName,
      score: finalScore,
      date: new Date().toISOString().split('T')[0],
      level: 'Super Star!'
    };
    const existingScores = JSON.parse(localStorage.getItem('game-leaderboard') || '[]');
    localStorage.setItem('game-leaderboard', JSON.stringify([...existingScores, newScore]));
    setCurrentView(GameState.LEADERBOARD);
  };

  const renderContent = () => {
    switch (currentView) {
      case GameState.HOME:
        return (
          <div className="text-center py-10 px-4 animate-fade-in flex flex-col items-center">
            <div className="relative group mb-12">
                <div className="absolute -top-10 -left-10 text-6xl float" style={{animationDelay: '1s'}}>🌴</div>
                <div className="absolute -bottom-10 -right-10 text-6xl float">🍌</div>
                <img 
                    src="https://picsum.photos/seed/baby-orangutan/800/600" 
                    alt="Cute Baby Orangutan" 
                    className="w-full max-w-2xl h-auto rounded-[4rem] shadow-2xl border-[16px] border-white wobble"
                />
            </div>
            
            <h2 className="text-5xl md:text-8xl font-black text-orange-600 mb-8 font-fredoka leading-tight drop-shadow-lg">
                Hi Friend! 🦧
            </h2>
            
            <p className="text-2xl md:text-3xl font-black text-gray-600 mb-12 max-w-xl leading-relaxed">
                Want to play in the trees with us?
            </p>

            <div className="flex flex-col gap-8 w-full max-w-md">
                <button 
                  onClick={() => setCurrentView(GameState.QUIZ)}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-4xl font-black py-8 px-10 rounded-[3rem] shadow-[0_12px_0_rgb(194,65,12)] transition-all hover:-translate-y-2 active:translate-y-2 active:shadow-none"
                >
                  PLAY NOW! 🎮
                </button>
                <button 
                  onClick={() => setCurrentView(GameState.FACTS)}
                  className="bg-green-500 hover:bg-green-600 text-white text-2xl font-black py-6 px-10 rounded-[2.5rem] shadow-[0_10px_0_rgb(21,128,61)] transition-all hover:-translate-y-1 active:translate-y-1 active:shadow-none"
                >
                  MEET THE MONKEYS 🐒
                </button>
            </div>
          </div>
        );
      case GameState.QUIZ:
        return <Quiz onComplete={handleQuizComplete} />;
      case GameState.FACTS:
        return <FunFacts />;
      case GameState.LEADERBOARD:
        return <Leaderboard />;
      case GameState.GAME_OVER:
        return (
          <div className="max-w-xl mx-auto bg-white p-12 rounded-[4rem] shadow-2xl border-[12px] border-orange-50 text-center sticker-pop">
            <div className="text-8xl mb-6">🍌🎉</div>
            <h2 className="text-4xl font-black text-orange-600 mb-4">YOU DID IT!</h2>
            <div className="text-9xl font-black text-green-500 mb-8">{finalScore}</div>
            
            <div className="bg-orange-50 p-8 rounded-3xl mb-8">
              <label className="block text-orange-400 text-lg font-black uppercase mb-4">Your Hero Name:</label>
              <input 
                type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Ex: Jungle King"
                className="w-full p-6 border-4 border-orange-200 rounded-3xl text-center text-3xl font-black text-orange-700 focus:outline-none focus:border-orange-500 shadow-inner"
              />
            </div>

            <button 
              onClick={saveScore}
              disabled={!userName.trim()}
              className="w-full bg-green-500 text-white text-4xl font-black py-8 rounded-[3rem] shadow-[0_12px_0_rgb(21,128,61)] transition-all hover:bg-green-600 active:translate-y-2 active:shadow-none disabled:opacity-50"
            >
              Save Sticker! 💎
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/30">
      <Header onNavigate={(view) => setCurrentView(view as GameState)} />
      <main className="flex-grow container mx-auto py-12 px-4 max-w-5xl">
        {renderContent()}
      </main>
      
      <footer className="py-12 text-center">
        <div className="flex justify-center gap-4 text-4xl opacity-40 mb-4">
            <span>🌴</span><span>🐒</span><span>🥥</span><span>🌴</span>
        </div>
        <p className="text-orange-900/40 font-black text-xl">OrangUtan Brand Kids - Playing Together</p>
      </footer>
    </div>
  );
};

export default App;
