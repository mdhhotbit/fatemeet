import React, { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { shortenAddress } from '../lib/blockchain';
import { Wallet, LogOut, Menu, X, ShieldCheck, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'gallery' | 'history' | 'how-it-works';
  onSelectTab: (tab: 'home' | 'gallery' | 'history' | 'how-it-works') => void;
  onOpenWalletModal: () => void;
  onOpenContractModal: () => void;
  isContractConfigured: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenWalletModal,
  onOpenContractModal,
  isContractConfigured,
}) => {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isBaseChain = chain?.id === 8453;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#05070f]/85 border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            onSelectTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform duration-300">
            <span className="font-cinzel font-black text-slate-950 text-sm">FM</span>
          </div>
          <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-widest text-slate-100 group-hover:text-amber-200 transition-colors">
            FATE MEET
          </span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <button
            onClick={() => onSelectTab('home')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'home'
                ? 'text-amber-300 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Home
            {activeTab === 'home' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('gallery')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'gallery'
                ? 'text-amber-300 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            The 50 Lives
            {activeTab === 'gallery' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'history'
                ? 'text-amber-300 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            My Encounters
            {activeTab === 'history' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('how-it-works')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'how-it-works'
                ? 'text-amber-300 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            How It Works
            {activeTab === 'how-it-works' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={onOpenContractModal}
            className="whitespace-nowrap shrink-0 text-slate-400 hover:text-amber-200/90 transition-colors py-1 text-xs tracking-wider uppercase flex items-center gap-1.5"
            title="View Phase 2 Smart Contract Architecture & Remix Guide"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400/80" />
            <span>Contract Spec</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {isConnected && address ? (
            <div className="flex items-center gap-2">
              <div
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-md border ${
                  isBaseChain
                    ? 'border-blue-500/40 bg-blue-950/40 text-blue-300'
                    : 'border-amber-500/40 bg-amber-950/40 text-amber-300'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isBaseChain ? 'bg-[#0052FF]' : 'bg-amber-400'
                  }`}
                />
                {isBaseChain ? 'Base Mainnet' : chain?.name || 'Wrong Network'}
              </div>

              <div className="flex items-center bg-slate-900/90 border border-amber-500/25 rounded-lg px-3 py-1.5 text-xs text-slate-200">
                <span className="font-mono text-amber-200 mr-2">{shortenAddress(address)}</span>
                <button
                  onClick={() => disconnect()}
                  className="text-slate-400 hover:text-rose-400 transition-colors ml-1"
                  title="Disconnect Wallet"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenWalletModal}
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium tracking-wide text-slate-950 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 hover:from-amber-100 hover:to-amber-300 rounded-lg shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-95 transition-all whitespace-nowrap shrink-0"
            >
              <Wallet className="w-4 h-4 text-slate-950" />
              <span>Connect Wallet</span>
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#070b16] px-4 pt-3 pb-5 space-y-3">
          <button
            onClick={() => {
              onSelectTab('home');
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-left py-2 px-3 rounded-lg text-sm ${
              activeTab === 'home'
                ? 'bg-amber-400/10 text-amber-300 font-semibold'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              onSelectTab('gallery');
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-left py-2 px-3 rounded-lg text-sm ${
              activeTab === 'gallery'
                ? 'bg-amber-400/10 text-amber-300 font-semibold'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            The 50 Lives Gallery
          </button>
          <button
            onClick={() => {
              onSelectTab('history');
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-left py-2 px-3 rounded-lg text-sm ${
              activeTab === 'history'
                ? 'bg-amber-400/10 text-amber-300 font-semibold'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            My Encounters
          </button>
          <button
            onClick={() => {
              onSelectTab('how-it-works');
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-left py-2 px-3 rounded-lg text-sm ${
              activeTab === 'how-it-works'
                ? 'bg-amber-400/10 text-amber-300 font-semibold'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => {
              onOpenContractModal();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 px-3 rounded-lg text-sm text-amber-300/80 hover:bg-amber-500/10"
          >
            Contract Spec & Remix Guide
          </button>
        </div>
      )}
    </header>
  );
};
