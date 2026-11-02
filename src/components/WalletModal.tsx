import React from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { X, Wallet, AlertTriangle, LogOut, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';
import { shortenAddress } from '../lib/blockchain';
import { BASE_CHAIN_ID } from '../config/contract';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, isPending: isConnectPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitchPending } = useSwitchChain();

  if (!isOpen) return null;

  const isBase = chain?.id === BASE_CHAIN_ID;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#060C1E] border border-[#0052FF]/30 rounded-3xl shadow-2xl shadow-[#0052FF]/15 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#040816]/90">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0052FF]/20 border border-[#0052FF]/40 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-[#0052FF]" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-white tracking-wide">
                Connect Wallet
              </h3>
              <p className="text-[10px] text-blue-300 font-mono">Base Network (Chain ID 8453)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* If already connected */}
          {isConnected && address ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-display font-semibold">
                    Connected Account
                  </span>
                  <a
                    href={`https://basescan.org/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#0052FF] hover:underline flex items-center gap-1"
                  >
                    <span>Basescan</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="font-mono text-base font-bold text-white">
                  {shortenAddress(address)}
                </p>
                <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isBase ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-amber-400'
                    }`}
                  />
                  <span className="text-xs text-slate-300">
                    Network: <strong className="text-white">{chain?.name || 'Unknown'}</strong> {isBase && <span className="text-emerald-400 font-mono">(Base Mainnet)</span>}
                  </span>
                </div>
              </div>

              {/* Wrong network alert */}
              {!isBase && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-amber-300">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Switch to Base Mainnet</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Fatemeet operates on <strong>Base Mainnet</strong> (Chain ID 8453). Switch your wallet network to proceed.
                  </p>
                  <button
                    onClick={() => switchChain({ chainId: BASE_CHAIN_ID })}
                    disabled={isSwitchPending}
                    className="w-full mt-2 py-2.5 px-3 bg-[#0052FF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-[#0052FF]/20"
                  >
                    {isSwitchPending ? 'Switching Network...' : 'Switch to Base Mainnet'}
                  </button>
                </div>
              )}

              {/* Disconnect button */}
              <button
                onClick={() => {
                  disconnect();
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect Wallet</span>
              </button>
            </div>
          ) : (
            /* Connect Wallet Options */
            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect your EVM browser wallet to interact with Fatemeet on Base. No registration or personal data required.
              </p>

              <div className="space-y-2">
                {connectors.map((connector) => (
                  <button
                    key={connector.id}
                    onClick={() => {
                      connect({ connector });
                      onClose();
                    }}
                    disabled={isConnectPending}
                    className="w-full p-3.5 bg-white/[0.02] hover:bg-[#0052FF]/10 border border-white/10 hover:border-[#0052FF]/50 rounded-2xl text-left flex items-center justify-between text-sm text-slate-100 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#0052FF]/50 group-hover:bg-[#0052FF]/15 transition-colors">
                        <Wallet className="w-4 h-4 text-blue-300 group-hover:text-white transition-colors" />
                      </div>
                      <span className="font-medium group-hover:text-white">
                        {connector.name}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>

              {connectError && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-xs text-rose-300">
                  {connectError.message}
                </div>
              )}

              <div className="p-3 rounded-xl bg-[#0052FF]/5 border border-[#0052FF]/20 flex items-center gap-2.5 text-[11px] text-blue-200">
                <ShieldCheck className="w-4 h-4 text-[#0052FF] shrink-0" />
                <span>Zero personal data collected. Connection is client-side only.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
