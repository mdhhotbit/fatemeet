import React from 'react';
import { LuckyFaceLogo } from './LuckyFaceLogo';
import { Lock, Shield } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: 'home' | 'gallery' | 'history' | 'how-it-works') => void;
  onOpenContractModal: () => void;
  onOpenPrivacyModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenContractModal,
  onOpenPrivacyModal,
}) => {
  return (
    <footer className="w-full border-t border-white/5 bg-[#03050a] text-slate-400 text-xs py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-white/5">
        <div className="space-y-3">
          <LuckyFaceLogo size="md" />
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
            Discover the 50 extraordinary personalities who shaped our world. Built with privacy as our core principle on the Base blockchain ecosystem.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero trackers · No cookies · No sign-up required</span>
          </div>
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
            onClick={onOpenPrivacyModal}
            className="text-emerald-300 hover:text-emerald-200 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Lock className="w-3 h-3" />
            <span>Privacy & Stats</span>
          </button>
          <button
            onClick={onOpenContractModal}
            className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Shield className="w-3 h-3" />
            <span>Base Contract</span>
          </button>
        </div>
      </div>

      {/* Disclaimers & Copyright */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} LuckyFace. Verified on Base Mainnet (Chain ID 8453). Public historical archives via Wikimedia Commons.
        </p>

        <p className="text-center sm:text-right">
          Privacy-First Architecture · Fully Decentralized & Client-Side Sovereign.
        </p>
      </div>
    </footer>
  );
};
