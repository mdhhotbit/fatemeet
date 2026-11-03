import React from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { X, Wallet, LogOut, ExternalLink, AlertTriangle, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { BASE_CHAIN_ID, CONTRACT_EXPLORER_URL } from '../config/guestbook';
import { shortenAddress, getBaseScanAddressUrl } from '../lib/utils';

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

  const isBaseMainnet = chain?.id === BASE_CHAIN_ID;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0052FF]/10 flex items-center justify-center text-[#0052FF]">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-slate-900">
                {isConnected ? 'Connected Account' : 'Connect Wallet'}
              </h3>
              <p className="text-[11px] font-mono text-slate-500">
                Base Mainnet (Chain ID 8453)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isConnected && address ? (
            <div className="space-y-4">
              {/* Account Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Wallet Address
                  </span>
                  <a
                    href={getBaseScanAddressUrl(address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#0052FF] hover:underline inline-flex items-center gap-1 font-mono font-medium"
                  >
                    <span>BaseScan</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <p className="font-mono text-base sm:text-lg font-bold text-slate-900 break-all">
                  {address}
                </p>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isBaseMainnet ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  <span className="text-xs text-slate-600 font-medium">
                    Network: <strong className="text-slate-900">{chain?.name || 'Unknown'}</strong>{' '}
                    {isBaseMainnet ? '(Base Mainnet 8453)' : ''}
                  </span>
                </div>
              </div>

              {/* Wrong Network Warning */}
              {!isBaseMainnet && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Switch to Base Mainnet</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    BASE GUESTBOOK operates strictly on <strong>Base Mainnet (Chain ID 8453)</strong>. Switch your wallet network to sign the guestbook.
                  </p>
                  <button
                    onClick={() => switchChain({ chainId: BASE_CHAIN_ID })}
                    disabled={isSwitchPending}
                    className="w-full mt-1 py-2.5 px-4 bg-[#0052FF] hover:bg-[#0047DB] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    {isSwitchPending ? 'Switching Network in Wallet...' : 'Switch to Base Mainnet'}
                  </button>
                </div>
              )}

              {/* Disconnect Button */}
              <button
                onClick={() => {
                  disconnect();
                  onClose();
                }}
                className="w-full py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect Wallet</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect your EVM browser wallet to sign the guestbook on Base Mainnet. No registration, personal details, or emails are ever required.
              </p>

              {/* Connector List */}
              <div className="space-y-2">
                {connectors.map((connector) => {
                  const isRabbyDetected =
                    typeof window !== 'undefined' &&
                    Boolean((window as any)?.ethereum?.isRabby || (window as any)?.rabby);

                  const displayName =
                    connector.id === 'injected' && isRabbyDetected
                      ? 'Rabby Wallet (EIP-1193)'
                      : connector.name;

                  return (
                    <button
                      key={connector.id}
                      onClick={() => {
                        connect({ connector });
                        onClose();
                      }}
                      disabled={isConnectPending}
                      className="w-full p-3.5 bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-[#0052FF]/60 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-[#0052FF] group-hover:border-[#0052FF]/40 shadow-xs transition-colors">
                          <Wallet className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-semibold text-sm text-slate-900 group-hover:text-[#0052FF] block">
                            {displayName}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono block">
                            {connector.id === 'injected'
                              ? 'EIP-1193 / Rabby / Browser Extension'
                              : connector.id === 'coinbaseWallet'
                              ? 'Official Coinbase Smart Wallet'
                              : 'Ethereum Browser Wallet'}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0052FF] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  );
                })}
              </div>

              {connectError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                  {connectError.message}
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-[11px] text-slate-600 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero registration. Pure Web3 client-side connection.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
