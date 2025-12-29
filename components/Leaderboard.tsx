
import React, { useState, useEffect } from 'react';
import { ScoreEntry } from '../types';

const Leaderboard: React.FC = () => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    const localScores = JSON.parse(localStorage.getItem('game-leaderboard') || '[]');
    // Mock global scores for more competition
    const mockGlobal: ScoreEntry[] = [
      { id: '1', name: 'SuperMonkey99', score: 50, date: '2024-03-20', level: 'Jungle King' },
      { id: '2', name: 'BananoFan', score: 40, date: '2024-03-21', level: 'Fruit Expert' },
      { id: '3', name: 'TreeClimber', score: 30, date: '2024-03-19', level: 'Tree Scout' },
    ];
    
    const combined = [...localScores, ...mockGlobal].sort((a, b) => b.score - a.score).slice(0, 10);
    setScores(combined);
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-green-100">
      <div className="bg-green-600 p-8 text-center">
        <h2 className="text-4xl font-black text-white font-fredoka mb-2">🏆 Jungle Hall of Fame</h2>
        <p className="text-green-100 font-medium">Are you the smartest Orangutan in the forest?</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-12 gap-4 text-sm font-black text-gray-400 uppercase tracking-widest border-b pb-4 mb-4">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-5">Adventurer</div>
          <div className="col-span-3 text-right">Score</div>
          <div className="col-span-3 text-right">Level</div>
        </div>

        <div className="space-y-3">
          {scores.length > 0 ? scores.map((entry, index) => (
            <div 
              key={entry.id} 
              className={`grid grid-cols-12 gap-4 items-center p-4 rounded-2xl transition-colors ${
                index === 0 ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-gray-50 border-2 border-transparent hover:border-green-200'
              }`}
            >
              <div className="col-span-1 text-center font-black text-xl">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
              </div>
              <div className="col-span-5 font-black text-gray-800 text-lg flex items-center gap-2">
                {entry.name}
                {entry.date === new Date().toISOString().split('T')[0] && (
                  <span className="bg-green-500 text-white text-[10px] px-2 py-1 rounded-full animate-pulse">NEW!</span>
                )}
              </div>
              <div className="col-span-3 text-right font-black text-orange-600 text-2xl">
                {entry.score}
              </div>
              <div className="col-span-3 text-right font-bold text-green-700 italic">
                {entry.level}
              </div>
            </div>
          )) : (
            <div className="text-center py-10 text-gray-400 italic">No explorers have reached the top yet. Will you be the first?</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
