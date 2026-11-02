import React from 'react';

interface FooterProps {
  onSelectTab: (tab: 'home' | 'gallery' | 'history' | 'how-it-works') => void;
  onOpenContractModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenContractModal }) => {
  return (
    <footer className="w-full border-t border-white/5 bg-[#03050a] text-slate-400 text-xs py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-white/5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center text-slate-950 font-cinzel font-black text-xs">
              FM
            </div>
            <span className="font-cinzel text-lg font-bold text-white tracking-wider">
              FATE MEET
            </span>
          </div>
          <p className="font-editorial italic text-amber-200/80 text-sm">
            Every click reveals a life.
          </p>
          <p className="text-xs text-slate-500 max-w-sm">
            50 extraordinary personalities who shaped our world, discovered on the Base blockchain ecosystem.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300">
          <button
            onClick={() => {
              onSelectTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-amber-300 transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => {
              onSelectTab('gallery');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-amber-300 transition-colors cursor-pointer"
          >
            The 50 Lives
          </button>
          <button
            onClick={() => {
              onSelectTab('history');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-amber-300 transition-colors cursor-pointer"
          >
            My Encounters
          </button>
          <button
            onClick={() => {
              onSelectTab('how-it-works');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-amber-300 transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={onOpenContractModal}
            className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            Remix Spec
          </button>
        </div>
      </div>

      {/* Disclaimers & Copyright */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} FATE MEET. Developed for Base Mainnet (Chain ID 8453). Public historical archives via Wikimedia Commons.
        </p>

        <p className="text-center sm:text-right">
          Phase 1: Frontend & Demo. Phase 2: Remix Smart Contract integration.
        </p>
      </div>
    </footer>
  );
};
