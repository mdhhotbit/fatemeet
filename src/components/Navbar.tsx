import React from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { Wallet, AlertTriangle } from 'lucide-react';
import { BASE_CHAIN_ID } from '../config/guestbook';
import { shortenAddress } from '../lib/utils';

interface NavbarProps {
  onOpenWalletModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenWalletModal }) => {
  const { address, isConnected, chain } = useAccount();
  const { switchChain, isPending: isSwitchPending } = useSwitchChain();

  const isBaseMainnet = chain?.id === BASE_CHAIN_ID;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0052FF] flex items-center justify-center shadow-md shadow-[#0052FF]/20 shrink-0">
            {/* Base Logo Emblem */}
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0052FF]" />
            </div>
          </div>
          <div>
            <span className="font-display text-lg sm:text-xl font-black tracking-tight text-slate-900 block leading-tight">
              BASE GUESTBOOK
            </span>
            <span className="text-[11px] font-mono text-slate-500 font-medium hidden sm:block">
              Base Mainnet · Immutable Onchain History
            </span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Network Alert (if connected to wrong chain) */}
          {isConnected && !isBaseMainnet && (
            <button
              onClick={() => switchChain({ chainId: BASE_CHAIN_ID })}
              disabled={isSwitchPending}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{isSwitchPending ? 'Switching...' : 'Switch to Base'}</span>
            </button>
          )}

          {/* Connected Network Indicator (if on Base Mainnet) */}
          {isConnected && isBaseMainnet && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Base Mainnet</span>
            </div>
          )}

          {/* Wallet Button */}
          {isConnected && address ? (
            <button
              onClick={onOpenWalletModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold font-mono text-slate-800 bg-slate-100 hover:bg-slate-200/80 border border-slate-300/80 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <div className="w-2 h-2 rounded-full bg-[#0052FF]" />
              <span>{shortenAddress(address)}</span>
            </button>
          ) : (
            <button
              onClick={onOpenWalletModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-display font-bold uppercase tracking-wider text-white bg-[#0052FF] hover:bg-[#0047DB] active:scale-[0.98] rounded-xl transition-all cursor-pointer shadow-md shadow-[#0052FF]/20"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
