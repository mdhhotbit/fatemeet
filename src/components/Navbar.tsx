import React, { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { shortenAddress } from '../lib/blockchain';
import { Wallet, LogOut, Menu, X, Shield, Lock, Compass } from 'lucide-react';
import { FateMeetLogo } from './FateMeetLogo';

interface NavbarProps {
  activeTab: 'home' | 'gallery' | 'history' | 'how-it-works';
  onSelectTab: (tab: 'home' | 'gallery' | 'history' | 'how-it-works') => void;
  onOpenWalletModal: () => void;
  onOpenContractModal: () => void;
  onOpenPrivacyModal: () => void;
  isContractConfigured: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenWalletModal,
  onOpenContractModal,
  onOpenPrivacyModal,
  isContractConfigured,
}) => {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isBaseChain = chain?.id === 8453;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#030712]/85 border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Compact Base-native Fatemeet brand */}
        <button
          onClick={() => {
            onSelectTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group flex items-center text-left whitespace-nowrap shrink-0 focus:outline-none cursor-pointer"
          aria-label="Fatemeet home"
        >
          <FateMeetLogo size="md" variant="full" />
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium tracking-normal text-slate-300">
          <button
            onClick={() => onSelectTab('home')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
              activeTab === 'home'
                ? 'text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Home
            {activeTab === 'home' && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0052FF] rounded-full shadow-[0_0_8px_#0052FF]" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('gallery')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
              activeTab === 'gallery'
                ? 'text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            The 50 Lives
            {activeTab === 'gallery' && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0052FF] rounded-full shadow-[0_0_8px_#0052FF]" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
              activeTab === 'history'
                ? 'text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Encounters
            {activeTab === 'history' && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0052FF] rounded-full shadow-[0_0_8px_#0052FF]" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('how-it-works')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
              activeTab === 'how-it-works'
                ? 'text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            How It Works
            {activeTab === 'how-it-works' && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0052FF] rounded-full shadow-[0_0_8px_#0052FF]" />
            )}
          </button>

          <button
            onClick={onOpenPrivacyModal}
            className="whitespace-nowrap shrink-0 text-slate-400 hover:text-emerald-300 transition-colors py-1 text-xs tracking-wide uppercase flex items-center gap-1.5 cursor-pointer"
            title="Privacy First & Anonymous Stats"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Privacy</span>
          </button>

          <button
            onClick={onOpenContractModal}
            className="whitespace-nowrap shrink-0 text-slate-400 hover:text-blue-300 transition-colors py-1 text-xs tracking-wide uppercase flex items-center gap-1.5 cursor-pointer"
            title="Base Blockchain Smart Contract"
          >
            <Shield className="w-3.5 h-3.5 text-[#0052FF]" />
            <span>Base Contract</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {isConnected && address ? (
            <div className="flex items-center gap-2">
              <div
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border ${
                  isBaseChain
                    ? 'border-[#0052FF]/40 bg-[#0052FF]/10 text-blue-300'
                    : 'border-amber-500/40 bg-amber-950/40 text-amber-300'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isBaseChain ? 'bg-[#0052FF] animate-pulse shadow-[0_0_8px_#0052FF]' : 'bg-amber-400'
                  }`}
                />
                {isBaseChain ? 'Base Mainnet' : chain?.name || 'Switch to Base'}
              </div>

              <div className="flex items-center bg-slate-900/90 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200">
                <span className="font-mono text-blue-200 mr-2">{shortenAddress(address)}</span>
                <button
                  onClick={() => disconnect()}
                  className="text-slate-400 hover:text-rose-400 transition-colors ml-1 cursor-pointer"
                  title="Disconnect Wallet"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenWalletModal}
              className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold tracking-wide text-white bg-[#0052FF] hover:bg-[#1A65FF] rounded-xl shadow-lg shadow-[#0052FF]/20 hover:shadow-[#0052FF]/40 active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Wallet className="w-4 h-4 text-white" />
              <span>Connect Wallet</span>
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#060B18] px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => {
              onSelectTab('home');
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
              activeTab === 'home'
                ? 'bg-[#0052FF]/15 text-blue-300 font-semibold'
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
            className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
              activeTab === 'gallery'
                ? 'bg-[#0052FF]/15 text-blue-300 font-semibold'
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
            className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
              activeTab === 'history'
                ? 'bg-[#0052FF]/15 text-blue-300 font-semibold'
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
            className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
              activeTab === 'how-it-works'
                ? 'bg-[#0052FF]/15 text-blue-300 font-semibold'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => {
              onOpenPrivacyModal();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-sm text-emerald-300 hover:bg-emerald-500/10 flex items-center gap-2 font-medium"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy & Anonymous Statistics</span>
          </button>
          <button
            onClick={() => {
              onOpenContractModal();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-sm text-blue-300 hover:bg-blue-500/10 flex items-center gap-2 font-medium"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Base Smart Contract Specification</span>
          </button>
        </div>
      )}
    </header>
  );
};
