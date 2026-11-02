import React from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { X, Wallet, CheckCircle, AlertTriangle, LogOut, ArrowRight } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#090d1c] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-amber-400" />
            <h3 className="font-cinzel text-base font-bold text-white tracking-wide">
              EVM WALLET
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* If already connected */}
          {isConnected && address ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-medium">
                  Connected Account
                </span>
                <p className="font-mono text-base font-bold text-amber-200">
                  {shortenAddress(address)}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isBase ? 'bg-[#0052FF]' : 'bg-amber-400'
                    }`}
                  />
                  <span className="text-xs text-slate-300">
                    Network: <strong>{chain?.name || 'Unknown'}</strong> (Chain ID: {chain?.id})
                  </span>
                </div>
              </div>

              {/* Wrong network alert */}
              {!isBase && (
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Wrong Network Detected</span>
                  </div>
                  <p className="text-slate-300">
                    FATE MEET operates on <strong>Base Mainnet</strong> (Chain ID 8453). Please switch network to continue.
                  </p>
                  <button
                    onClick={() => switchChain({ chainId: BASE_CHAIN_ID })}
                    disabled={isSwitchPending}
                    className="w-full mt-2 py-2 px-3 bg-amber-400 text-slate-950 text-xs font-bold rounded-lg hover:bg-amber-300 transition-all cursor-pointer"
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
                className="w-full py-2.5 px-4 bg-slate-900 border border-rose-500/30 text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect Wallet</span>
              </button>
            </div>
          ) : (
            /* Connect Wallet Options */
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                Connect your preferred EVM browser wallet to interact with Base Mainnet.
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
                    className="w-full p-3.5 bg-slate-950 hover:bg-slate-900 border border-white/10 hover:border-amber-400/50 rounded-xl text-left flex items-center justify-between text-sm text-slate-100 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center group-hover:border-amber-400/50">
                        <Wallet className="w-4 h-4 text-amber-400" />
                      </div>
                      <span className="font-medium group-hover:text-amber-200">
                        {connector.name}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>

              {connectError && (
                <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-500/30 text-xs text-rose-300">
                  {connectError.message}
                </div>
              )}

              <div className="pt-2 text-[11px] text-slate-500 text-center">
                Supports Rabby, MetaMask, Coinbase Wallet, Brave, and other injected EVM wallets.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
