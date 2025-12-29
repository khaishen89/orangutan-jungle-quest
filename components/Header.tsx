
import React, { useState } from 'react';

interface HeaderProps {
  onNavigate: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
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
        {/* Brand/Logo Area - Centered and Large */}
        <div className="relative group w-full flex justify-center">
          {logo ? (
            <div className="flex flex-col items-center gap-2">
              <img 
                src={logo} 
                alt="Brand Logo" 
                className="h-24 md:h-32 w-auto object-contain hover:scale-105 transition-transform" 
              />
              <button 
                onClick={() => { setLogo(null); localStorage.removeItem('user-brand-logo'); }}
                className="hidden group-hover:block absolute top-0 right-1/4 bg-red-400 text-white rounded-full p-2 text-xs shadow-lg"
              >
                Change Brand 🔄
              </button>
            </div>
          ) : (
            <label className="cursor-pointer bg-white hover:bg-orange-50 border-4 border-dashed border-orange-400 rounded-3xl px-12 py-8 flex flex-col items-center gap-3 transition-all transform hover:rotate-2 shadow-inner">
              <span className="text-4xl">🖼️</span>
              <span className="text-orange-600 font-black text-xl">UPLOAD YOUR BRAND</span>
              <span className="text-orange-400 text-sm">PNG Files look best!</span>
              <input type="file" accept="image/png" className="hidden" onChange={handleLogoUpload} />
            </label>
          )}
        </div>

        {/* Navigation - Simplified for Kids */}
        <nav className="flex items-center justify-center gap-4 md:gap-10 w-full">
          <button 
            onClick={() => onNavigate('FACTS')} 
            className="bg-green-100 text-green-700 px-6 py-3 rounded-2xl font-black text-lg hover:bg-green-200 transition-all border-b-4 border-green-300"
          >
            Learn 🌿
          </button>
          
          <button 
            onClick={() => onNavigate('HOME')}
            className="text-orange-600 font-black text-2xl hover:scale-110 transition-transform hidden md:block"
          >
            OrangUtan <span className="text-green-500 underline">Quest</span>
          </button>

          <button 
            onClick={() => onNavigate('LEADERBOARD')} 
            className="bg-yellow-100 text-yellow-700 px-6 py-3 rounded-2xl font-black text-lg hover:bg-yellow-200 transition-all border-b-4 border-yellow-300"
          >
            Trophy 🏆
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
