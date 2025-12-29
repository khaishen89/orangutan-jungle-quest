
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// --- TYPES & ENUMS ---
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface FunFact {
  title: string;
  fact: string;
  emoji: string;
}

interface ScoreEntry {
  id: string;
  name: string;
  score: number;
  date: string;
  level: string;
}

enum GameState {
  HOME = 'HOME',
  QUIZ = 'QUIZ',
  FACTS = 'FACTS',
  LEADERBOARD = 'LEADERBOARD',
  GAME_OVER = 'GAME_OVER'
}

// --- GEMINI SERVICE ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const generateQuiz = async (): Promise<QuizQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 5 ultra-simple visual quiz questions for toddlers (aged 3-5) about orangutans. Each question should be about identifying a color, a fruit, or a body part. Use plenty of emojis in the options. Keep text very short.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Quiz Error:", error);
    return [];
  }
};

const generateFunFacts = async (): Promise<FunFact[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 6 super cute 'Did you know?' cards for kids about orangutans. Use simple words and big emojis.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              fact: { type: Type.STRING },
              emoji: { type: Type.STRING }
            },
            required: ["title", "fact", "emoji"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Facts Error:", error);
    return [];
  }
};

// --- COMPONENTS ---

const Header: React.FC<{ onNavigate: (view: GameState) => void }> = ({ onNavigate }) => {
  const [logo, setLogo] = useState<string | null>(localStorage.getItem('user-brand-logo'));

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogo(base64String);
        localStorage.setItem('user-brand-logo', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b-8 border-orange-100 p-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
        <div className="relative group w-full flex justify-center">
          {logo ? (
            <div className="flex flex-col items-center gap-2">
              <img src={logo} alt="Brand Logo" className="h-24 md:h-32 w-auto object-contain hover:scale-105 transition-transform" />
              <button onClick={() => { setLogo(null); localStorage.removeItem('user-brand-logo'); }} className="bg-red-400 text-white rounded-full px-4 py-1 text-xs shadow-lg mt-2">Change Brand 🔄</button>
            </div>
          ) : (
            <label className="cursor-pointer bg-white hover:bg-orange-50 border-4 border-dashed border-orange-400 rounded-3xl px-12 py-8 flex flex-col items-center gap-3 transition-all transform hover:rotate-2 shadow-inner">
              <span className="text-4xl">🖼️</span>
              <span className="text-orange-600 font-black text-xl text-center">UPLOAD YOUR BRAND PNG</span>
              <input type="file" accept="image/png" className="hidden" onChange={handleLogoUpload} />
            </label>
          )}
        </div>
        <nav className="flex items-center justify-center gap-4 md:gap-10 w-full">
          <button onClick={() => onNavigate(GameState.FACTS)} className="bg-green-100 text-green-700 px-6 py-3 rounded-2xl font-black text-lg hover:bg-green-200 border-b-4 border-green-300">Learn 🌿</button>
          <button onClick={() => onNavigate(GameState.HOME)} className="text-orange-600 font-black text-2xl hover:scale-110 hidden md:block">OrangUtan <span className="text-green-500 underline">Quest</span></button>
          <button onClick={() => onNavigate(GameState.LEADERBOARD)} className="bg-yellow-100 text-yellow-700 px-6 py-3 rounded-2xl font-black text-lg hover:bg-yellow-200 border-b-4 border-yellow-300">Trophy 🏆</button>
        </nav>
      </div>
    </header>
  );
};

const Quiz: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    generateQuiz().then(data => { setQuestions(data); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="w-24 h-24 bg-orange-400 rounded-full animate-bounce flex items-center justify-center text-5xl mb-6 shadow-xl">🦧</div>
      <p className="text-3xl font-black text-orange-600 text-center">Finding your jungle friends...</p>
    </div>
  );

  const current = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="h-8 w-full bg-white rounded-full p-2 border-4 border-green-100 mb-10 overflow-hidden relative shadow-inner">
        <div className="h-full bg-green-400 rounded-full transition-all duration-700" style={{ width: `${progress}%` }}></div>
        <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 font-black text-green-800 text-xs">Jungle Walk</span>
      </div>
      <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border-b-[12px] border-orange-100">
        <h2 className="text-3xl md:text-5xl font-black text-gray-800 mb-10 text-center leading-tight">{current.question}</h2>
        <div className="grid grid-cols-1 gap-4">
          {current.options.map((opt, i) => (
            <button 
              key={i} 
              disabled={!!selectedAnswer} 
              onClick={() => { setSelectedAnswer(opt); setShowExplanation(true); if (opt === current.correctAnswer) setScore(s => s + 10); }}
              className={`p-6 text-2xl md:text-4xl font-black rounded-3xl border-b-[8px] transition-all ${
                selectedAnswer ? (opt === current.correctAnswer ? 'bg-green-400 text-white border-green-600' : (opt === selectedAnswer ? 'bg-red-400 text-white border-red-600' : 'bg-gray-100 text-gray-300 border-gray-200')) : 'bg-white border-orange-200 hover:bg-orange-50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {showExplanation && (
          <div className="mt-8 bg-yellow-50 p-6 rounded-3xl border-4 border-dashed border-yellow-200 text-center sticker-pop">
            <p className="text-xl font-black text-yellow-800 mb-6">{current.explanation}</p>
            <button onClick={() => { if (currentIndex < questions.length - 1) { setCurrentIndex(c => c + 1); setSelectedAnswer(null); setShowExplanation(false); } else onComplete(score); }} className="bg-orange-500 text-white text-2xl font-black px-8 py-4 rounded-full shadow-lg border-b-4 border-orange-700">Next! 👉</button>
          </div>
        )}
      </div>
    </div>
  );
};

const FunFacts: React.FC = () => {
  const [facts, setFacts] = useState<FunFact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { generateFunFacts().then(data => { setFacts(data); setLoading(false); }); }, []);

  if (loading) return <div className="text-center py-20 animate-pulse text-2xl font-black text-green-600">Gathering jungle secrets...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
      {facts.map((f, i) => (
        <div key={i} className="bg-white p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition-all border-t-8 border-orange-400">
          <div className="text-5xl mb-4">{f.emoji}</div>
          <h3 className="text-xl font-black text-gray-800 mb-2">{f.title}</h3>
          <p className="text-gray-600 font-medium">{f.fact}</p>
        </div>
      ))}
    </div>
  );
};

const Leaderboard: React.FC = () => {
  const scores: ScoreEntry[] = JSON.parse(localStorage.getItem('game-leaderboard') || '[]');
  const mock: ScoreEntry[] = [
    { id: '1', name: 'King Kong', score: 50, date: '2024', level: 'Jungle King' },
    { id: '2', name: 'Banana Fan', score: 40, date: '2024', level: 'Expert' }
  ];
  const sorted = [...scores, ...mock].sort((a,b) => b.score - a.score).slice(0, 10);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-green-100">
      <div className="bg-green-600 p-8 text-center text-white"><h2 className="text-4xl font-black">🏆 Hall of Fame</h2></div>
      <div className="p-6 space-y-4">
        {sorted.map((s, i) => (
          <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-green-200">
            <span className="font-black text-2xl text-green-700">#{i+1} {s.name}</span>
            <span className="font-black text-3xl text-orange-500">{s.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN APP ---
const App: React.FC = () => {
  const [view, setView] = useState<GameState>(GameState.HOME);
  const [name, setName] = useState('');
  const [score, setScore] = useState(0);

  const save = () => {
    const entry = { id: Date.now().toString(), name, score, date: 'Today', level: 'Explorer' };
    const prev = JSON.parse(localStorage.getItem('game-leaderboard') || '[]');
    localStorage.setItem('game-leaderboard', JSON.stringify([...prev, entry]));
    setView(GameState.LEADERBOARD);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onNavigate={setView} />
      <main className="flex-grow container mx-auto py-12 px-4 max-w-5xl">
        {view === GameState.HOME && (
          <div className="text-center animate-fade-in">
            <img src="https://picsum.photos/seed/baby-orangutan/800/600" className="w-full max-w-2xl mx-auto rounded-[4rem] shadow-2xl border-[16px] border-white wobble mb-12" />
            <h2 className="text-6xl md:text-8xl font-black text-orange-600 mb-8">Hi Friend! 🦧</h2>
            <div className="flex flex-col gap-6 max-w-md mx-auto">
              <button onClick={() => setView(GameState.QUIZ)} className="bg-orange-500 text-white text-4xl font-black py-8 rounded-[3rem] shadow-[0_12px_0_rgb(194,65,12)] hover:-translate-y-2 active:translate-y-2 active:shadow-none transition-all">PLAY! 🎮</button>
              <button onClick={() => setView(GameState.FACTS)} className="bg-green-500 text-white text-2xl font-black py-6 rounded-[2.5rem] shadow-[0_10px_0_rgb(21,128,61)]">LEARN 🐒</button>
            </div>
          </div>
        )}
        {view === GameState.QUIZ && <Quiz onComplete={(s) => { setScore(s); setView(GameState.GAME_OVER); }} />}
        {view === GameState.FACTS && <FunFacts />}
        {view === GameState.LEADERBOARD && <Leaderboard />}
        {view === GameState.GAME_OVER && (
          <div className="bg-white p-12 rounded-[4rem] shadow-2xl text-center max-w-xl mx-auto border-[12px] border-orange-50">
            <h2 className="text-4xl font-black text-orange-600 mb-4">YOU DID IT! 🎉</h2>
            <div className="text-9xl font-black text-green-500 mb-8">{score}</div>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Type your name!" className="w-full p-6 border-4 border-orange-200 rounded-3xl text-3xl font-black text-center mb-8 focus:outline-none focus:border-orange-500" />
            <button onClick={save} disabled={!name} className="w-full bg-green-500 text-white text-4xl font-black py-8 rounded-[3rem] shadow-[0_12px_0_rgb(21,128,61)] disabled:opacity-50">Save Sticker! 💎</button>
          </div>
        )}
      </main>
      <footer className="py-12 text-center text-orange-900/40 font-black text-xl">🌴 🐒 🍌 OrangUtan Brand Kids</footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
