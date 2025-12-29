
import React, { useState, useEffect } from 'react';
import { FunFact } from '../types.ts';
import { generateFunFacts } from '../services/geminiService.ts';

const FunFacts: React.FC = () => {
  const [facts, setFacts] = useState<FunFact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacts = async () => {
      const data = await generateFunFacts();
      setFacts(data);
      setLoading(false);
    };
    fetchFacts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-green-400 rounded-full mb-4"></div>
            <p className="text-xl font-bold text-green-600">Gathering jungle secrets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-4xl font-black text-center text-green-700 mb-10 font-fredoka">Amazing Orangutan Facts!</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {facts.map((fact, i) => (
          <div 
            key={i} 
            className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border-t-8 border-orange-400 hover:-translate-y-2 group"
          >
            <div className="text-5xl mb-4 transform transition-transform group-hover:scale-125 inline-block">
              {fact.emoji}
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-3">{fact.title}</h3>
            <p className="text-gray-600 font-medium leading-relaxed">{fact.fact}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FunFacts;
