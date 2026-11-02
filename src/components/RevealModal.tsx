import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import confetti from 'canvas-confetti';
import {
  X,
  Compass,
  Sparkles,
  Share2,
  Copy,
  Check,
  ExternalLink,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
  ShieldCheck,
  Wallet,
  ArrowRight,
  Flame,
  Dna,
} from 'lucide-react';
import { Personality, RevealStatus } from '../types';
import { getPersonalityById } from '../lib/random';
import { PERSONALITIES } from '../data/personalities';
import {
  CONTRACT_ABI,
  BASE_CHAIN_ID,
  getStoredContractAddress,
  isContractConfigured,
  setStoredContractAddress,
  BASESCAN_URL,
} from '../config/contract';
import {
  derivePersonalityIdFromTxHash,
  getBaseScanTxUrl,
  shortenAddress,
} from '../lib/blockchain';
import { saveChainEncounter } from '../lib/encountersStorage';
import { recordProfileSelection } from '../lib/anonymousAnalytics';
import { PortraitImage } from './PortraitImage';
import { getInitials } from '../lib/utils';

interface RevealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEncounterSaved: () => void;
  onOpenWalletModal: () => void;
  onOpenContractModal: () => void;
}

export const RevealModal: React.FC<RevealModalProps> = ({
  isOpen,
  onClose,
  onEncounterSaved,
  onOpenWalletModal,
  onOpenContractModal,
}) => {
  const { isConnected, chain, address } = useAccount();
  const { switchChain, isPending: isSwitchPending } = useSwitchChain();

  const [contractAddress, setContractAddress] = useState<`0x${string}` | ''>(getStoredContractAddress());
  const [hasContract, setHasContract] = useState<boolean>(isContractConfigured());

  const [status, setStatus] = useState<RevealStatus>('idle');
  const [revealedPersonality, setRevealedPersonality] = useState<Personality | null>(null);
  const [currentTxHash, setCurrentTxHash] = useState<`0x${string}` | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Quick address input if needed inline
  const [quickAddressInput, setQuickAddressInput] = useState('');
  const [quickAddressError, setQuickAddressError] = useState<string | null>(null);

  // Kinetic shuffling slot preview
  const [shufflingName, setShufflingName] = useState('Albert Einstein');
  const [shufflingCategory, setShufflingCategory] = useState('Scientists & Inventors');

  // Wagmi contract write
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();

  // Transaction receipt watcher on Base Mainnet
  const {
    data: txReceipt,
    isLoading: isTxConfirming,
    isSuccess: isTxSuccess,
    isError: isTxError,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash: currentTxHash || undefined,
    chainId: BASE_CHAIN_ID,
  });

  // Keep contract address state synchronized with storage
  useEffect(() => {
    if (isOpen) {
      const active = getStoredContractAddress();
      setContractAddress(active);
      setHasContract(isContractConfigured());
      setQuickAddressInput(active || '');
    }
  }, [isOpen]);

  // Rapid name cycle during waiting / confirming
  useEffect(() => {
    let interval: any;
    if (status === 'confirming' || status === 'waiting_wallet') {
      interval = setInterval(() => {
        const rand = PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)];
        setShufflingName(rand.name);
        setShufflingCategory(rand.category);
      }, 85);
    }
    return () => clearInterval(interval);
  }, [status]);

  // Process transaction confirmation strictly on Base Mainnet
  useEffect(() => {
    if (isTxSuccess && txReceipt && currentTxHash && status === 'confirming') {
      if (txReceipt.status === 'reverted') {
        setStatus('failed');
        setErrorMessage('Transaction reverted on Base Mainnet. Protocol rule: No personality selection was made.');
        return;
      }

      // CRITICAL PRIVACY ARCHITECTURE:
      // Derive the personality ID strictly OFF-CHAIN using the confirmed transaction hash as entropy.
      // The personality ID is never leaked or stored on the public blockchain ledger!
      const personalityId = derivePersonalityIdFromTxHash(currentTxHash);
      const found = getPersonalityById(personalityId);

      if (found) {
        setRevealedPersonality(found);
        setStatus('revealed');
        recordProfileSelection(found.id);

        if (address) {
          saveChainEncounter(address, found.id, currentTxHash);
          onEncounterSaved();
        }

        triggerElectricConfetti();
      } else {
        setStatus('failed');
        setErrorMessage('Could not derive personality from confirmed transaction.');
      }
    } else if (isTxError && status === 'confirming') {
      setStatus('failed');
      setErrorMessage(
        receiptError?.message || 'Transaction failed to confirm on Base Mainnet. Protocol rule: No personality was revealed.'
      );
    }
  }, [isTxSuccess, isTxError, txReceipt, currentTxHash, status]);

  const triggerElectricConfetti = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0052FF', '#38BDF8', '#FFFFFF', '#F5D77F'],
        ticks: 240,
      });
    } catch {
      // safe fallback
    }
  };

  /**
   * Executes real on-chain transaction on Base Mainnet.
   * Users pay ONLY standard Base network gas (0 ETH transferred).
   * No application fee, no subscriptions.
   */
  const handleInitiateOnChainSelection = async () => {
    if (!isConnected) {
      onOpenWalletModal();
      return;
    }

    if (chain?.id !== BASE_CHAIN_ID) {
      try {
        await switchChain({ chainId: BASE_CHAIN_ID });
      } catch (err: any) {
        setErrorMessage('Please switch your wallet to Base Mainnet (Chain ID 8453) to proceed.');
        setStatus('failed');
      }
      return;
    }

    const activeContract = getStoredContractAddress();
    if (!activeContract) {
      setErrorMessage('A Base Mainnet contract address is required before initiating an on-chain selection.');
      return;
    }

    try {
      setStatus('waiting_wallet');
      setErrorMessage(null);
      setCurrentTxHash(null);
      setRevealedPersonality(null);

      // Call lightweight recordSelection on Base Mainnet
      const hash = await writeContractAsync({
        address: activeContract,
        abi: CONTRACT_ABI,
        functionName: 'recordSelection',
        args: [],
      });

      setCurrentTxHash(hash);
      setStatus('confirming');
    } catch (err: any) {
      setStatus('failed');
      if (
        err?.message?.toLowerCase().includes('user rejected') ||
        err?.message?.toLowerCase().includes('denied') ||
        err?.cause?.message?.toLowerCase().includes('user rejected')
      ) {
        setErrorMessage('Transaction was rejected in your wallet. Protocol Rule: No personality was revealed.');
      } else {
        setErrorMessage(
          err?.shortMessage || err?.message || 'Transaction initiation failed on Base Mainnet.'
        );
      }
    }
  };

  const handleQuickAddressSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = quickAddressInput.trim();
    if (!trimmed.startsWith('0x') || trimmed.length !== 42) {
      setQuickAddressError('Must be a valid 42-character EVM address starting with 0x');
      return;
    }

    const ok = setStoredContractAddress(trimmed);
    if (ok) {
      setContractAddress(trimmed as `0x${string}`);
      setHasContract(true);
      setQuickAddressError(null);
      setErrorMessage(null);
    } else {
      setQuickAddressError('Failed to save address.');
    }
  };

  const handleResetForNewSelection = () => {
    setStatus('idle');
    setRevealedPersonality(null);
    setCurrentTxHash(null);
    setErrorMessage(null);
  };

  const handleShareOnX = () => {
    if (!revealedPersonality) return;
    const url = window.location.origin;
    const text = `I just encountered ${revealedPersonality.name} on LuckyFace — verified on Base Mainnet.\n\nEvery click reveals a life. Zero platform fees, 100% private.\n\nDiscover yours: ${url}`;
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(xUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopySummary = () => {
    if (!revealedPersonality) return;
    const txInfo = currentTxHash ? `\nVerified on BaseScan: ${getBaseScanTxUrl(currentTxHash)}` : '';
    const text = `${revealedPersonality.name} (${revealedPersonality.profession}, ${revealedPersonality.nationality}). Discovered on LuckyFace: ${window.location.origin}${txInfo}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl">
      <div className="relative w-full max-w-3xl bg-[#060C1E] border border-[#0052FF]/30 rounded-3xl shadow-2xl shadow-[#0052FF]/20 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header ribbon */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#040816]/90">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0052FF] animate-pulse shadow-[0_0_8px_#0052FF]" />
            <span className="font-display text-sm sm:text-base font-bold tracking-wider text-white">
              BASE ON-CHAIN SELECTION
            </span>

            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium bg-[#0052FF]/20 text-blue-300 border border-[#0052FF]/40">
              Base Mainnet (8453)
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {/* STEP 1: WALLET NOT CONNECTED */}
          {!isConnected && (
            <div className="text-center py-8 space-y-6 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-[#0052FF]/15 border border-[#0052FF]/30 flex items-center justify-center mx-auto shadow-xl shadow-[#0052FF]/10">
                <Wallet className="w-8 h-8 text-[#0052FF]" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl font-black text-white">
                  Connect Wallet to Proceed
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Every personality selection requires a verified transaction on <strong>Base Mainnet</strong>. Users pay ONLY normal Base network gas (approx. &lt; $0.001). Zero platform fees.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenWalletModal}
                  className="w-full py-4 px-6 bg-[#0052FF] hover:bg-blue-600 text-white font-display text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-[#0052FF]/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Connect EVM Wallet</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Anonymous & Private. Zero personal info collected.</span>
              </div>
            </div>
          )}

          {/* STEP 2: WRONG NETWORK (NOT BASE MAINNET) */}
          {isConnected && chain?.id !== BASE_CHAIN_ID && (
            <div className="text-center py-8 space-y-6 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-amber-400" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl font-black text-white">
                  Switch to Base Mainnet
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  You are connected to <strong>{chain?.name || 'an unsupported network'}</strong>. LuckyFace operates strictly on <strong>Base Mainnet</strong> (Chain ID 8453).
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => switchChain({ chainId: BASE_CHAIN_ID })}
                  disabled={isSwitchPending}
                  className="w-full py-4 px-6 bg-[#0052FF] hover:bg-blue-600 text-white font-display text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-[#0052FF]/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  {isSwitchPending ? 'Switching Network in Wallet...' : 'Switch to Base Mainnet'}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CONTRACT NOT CONFIGURED YET */}
          {isConnected && chain?.id === BASE_CHAIN_ID && !hasContract && (
            <div className="space-y-6 max-w-lg mx-auto py-4">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-[#0052FF]/15 border border-[#0052FF]/30 flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-7 h-7 text-[#0052FF]" />
                </div>
                <h3 className="font-display text-2xl font-black text-white">
                  Base Mainnet Contract Required
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Per the protocol rule, every selection must execute a real on-chain transaction. Enter your deployed Base contract address below or view the deployment guide.
                </p>
              </div>

              {/* Quick Input Form */}
              <form onSubmit={handleQuickAddressSave} className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                <label className="block text-xs font-semibold text-slate-300 uppercase font-display tracking-wider">
                  Contract Address (Base Mainnet):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={quickAddressInput}
                    onChange={(e) => setQuickAddressInput(e.target.value)}
                    placeholder="0x..."
                    className="flex-1 px-3.5 py-2.5 bg-[#030612] border border-white/10 focus:border-[#0052FF] rounded-xl text-white font-mono text-xs placeholder-slate-600 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#0052FF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer transition-all"
                  >
                    Activate
                  </button>
                </div>
                {quickAddressError && (
                  <p className="text-rose-400 text-xs">{quickAddressError}</p>
                )}
              </form>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={onOpenContractModal}
                  className="text-xs text-blue-300 hover:text-white underline inline-flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Remix IDE Deployment Guide & Solidity Code</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: READY TO SELECT (CONNECTED & CONFIGURED) */}
          {isConnected && chain?.id === BASE_CHAIN_ID && hasContract && status === 'idle' && (
            <div className="space-y-6 max-w-lg mx-auto py-4 text-center">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0052FF] to-cyan-400 rounded-2xl blur-lg opacity-40 animate-pulse" />
                <div className="relative w-full h-full rounded-2xl bg-[#060C1E] border border-[#0052FF]/40 flex items-center justify-center">
                  <Compass className="w-10 h-10 text-[#0052FF] animate-spin-slow" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl sm:text-3xl font-black text-white">
                  Meet Your Destiny on Base
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                  Click below to execute a lightweight on-chain selection on <strong>Base Mainnet</strong>. Your transaction will reveal one of 50 extraordinary historical minds.
                </p>
              </div>

              {/* Fee & Privacy Spec Breakdown */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-left space-y-2.5 text-xs text-slate-300 font-mono">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-slate-400">Application Fee:</span>
                  <span className="text-emerald-400 font-bold">0.0000 ETH (Free)</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-slate-400">Network / Gas:</span>
                  <span className="text-blue-300">Standard Base Gas (~$0.0005)</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-slate-400">Privacy Guarantee:</span>
                  <span className="text-emerald-300">Personality ID stored OFF-CHAIN</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Contract:</span>
                  <span className="text-slate-300">{shortenAddress(contractAddress)}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleInitiateOnChainSelection}
                  disabled={isWritePending}
                  className="w-full py-4 sm:py-5 px-6 bg-[#0052FF] hover:bg-blue-600 text-white font-display text-sm sm:text-base font-black uppercase tracking-wider rounded-2xl shadow-xl shadow-[#0052FF]/30 flex items-center justify-center gap-3 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Sparkles className="w-5 h-5 text-cyan-200" />
                  <span>Execute On-Chain Selection</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: WAITING WALLET APPROVAL */}
          {status === 'waiting_wallet' && (
            <div className="text-center py-10 space-y-6 max-w-md mx-auto">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 bg-[#0052FF] rounded-full blur-xl opacity-50 animate-ping" />
                <div className="relative w-full h-full rounded-full bg-[#060C1E] border-2 border-[#0052FF] flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#0052FF] animate-spin" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl font-black text-white">
                  Approve in Your Wallet
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Please confirm the transaction in your EVM wallet. You pay <strong>0 ETH platform fee</strong> and only normal Base network gas.
                </p>
              </div>

              {/* Kinetic preview slot */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-[#0052FF]/30 font-mono text-xs text-blue-300 flex items-center justify-center gap-2">
                <Dna className="w-4 h-4 text-[#0052FF] animate-pulse" />
                <span>Destiny Shuffling: {shufflingName}</span>
              </div>
            </div>
          )}

          {/* STEP 6: CONFIRMING ON BASE MAINNET */}
          {status === 'confirming' && (
            <div className="text-center py-10 space-y-6 max-w-md mx-auto">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0052FF] to-cyan-400 rounded-full blur-xl opacity-60 animate-pulse" />
                <div className="relative w-full h-full rounded-full bg-[#060C1E] border-2 border-[#0052FF] flex items-center justify-center">
                  <Compass className="w-9 h-9 text-[#0052FF] animate-spin" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl font-black text-white">
                  Confirming on Base Mainnet
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Transaction submitted to the Base blockchain. Waiting for block inclusion...
                </p>
              </div>

              {currentTxHash && (
                <div className="p-3.5 rounded-2xl bg-[#0052FF]/10 border border-[#0052FF]/30 space-y-1">
                  <span className="text-[11px] text-slate-400 font-mono block">Transaction Hash:</span>
                  <a
                    href={getBaseScanTxUrl(currentTxHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-300 hover:text-white font-mono font-bold flex items-center justify-center gap-1.5 underline"
                  >
                    <span>{shortenAddress(currentTxHash)}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Kinetic preview slot */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 font-mono text-xs text-blue-300 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0052FF] animate-spin-slow" />
                <span>Synthesizing encounter for: {shufflingName}</span>
              </div>
            </div>
          )}

          {/* STEP 7: REVEALED SUCCESSFULLY */}
          {status === 'revealed' && revealedPersonality && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              {/* On-Chain Verified Header Banner */}
              <div className="flex flex-wrap items-center justify-between p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">
                    Transaction Confirmed on Base Mainnet
                    {txReceipt?.blockNumber ? ` (Block #${txReceipt.blockNumber.toString()})` : ''}
                  </span>
                </div>

                {currentTxHash && (
                  <a
                    href={getBaseScanTxUrl(currentTxHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-200 hover:text-white underline flex items-center gap-1 font-mono shrink-0"
                  >
                    <span>View on BaseScan</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Privacy Notice Pill */}
              <div className="px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                <Lock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>
                  Privacy Protected: Personality #{revealedPersonality.id} derived off-chain using transaction entropy. Never leaked to public ledger.
                </span>
              </div>

              {/* Personality Showcase Card */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start p-5 rounded-3xl bg-[#040816] border border-white/10">
                <div className="sm:col-span-5 flex flex-col items-center">
                  <div className="w-full max-w-[220px] rounded-2xl overflow-hidden border border-[#0052FF]/30 shadow-2xl shadow-[#0052FF]/15 ring-1 ring-white/10">
                    <PortraitImage
                      src={revealedPersonality.portraitUrl}
                      alt={revealedPersonality.name}
                      initials={getInitials(revealedPersonality.name)}
                      aspectRatio="portrait"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2 text-center line-clamp-1">
                    {revealedPersonality.imageAttribution}
                  </span>
                </div>

                <div className="sm:col-span-7 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 font-medium font-mono">
                      {revealedPersonality.category}
                    </span>
                    <span className="text-slate-500" aria-hidden="true">·</span>
                    <span className="text-slate-300">{revealedPersonality.nationality}</span>
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {revealedPersonality.name}
                  </h2>

                  <p className="text-blue-200/90 font-medium text-sm sm:text-base">
                    {revealedPersonality.profession}
                  </p>

                  <div className="text-xs font-mono text-slate-400 py-1">
                    <span>Lifetime: {revealedPersonality.birthDate}</span>
                    {revealedPersonality.deathDate ? (
                      <span> — {revealedPersonality.deathDate}</span>
                    ) : (
                      <span className="text-emerald-400 ml-1.5 font-sans font-semibold">(Living)</span>
                    )}
                  </div>

                  {revealedPersonality.quote && (
                    <div className="text-xs sm:text-sm italic text-blue-100/90 bg-[#0052FF]/10 p-3.5 rounded-xl border-l-2 border-[#0052FF] leading-relaxed">
                      "{revealedPersonality.quote}"
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                    {revealedPersonality.biography}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShareOnX}
                    className="px-4 py-2 bg-[#0052FF] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#0052FF]/20 transition-all hover:scale-[1.02]"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share on X</span>
                  </button>

                  <button
                    onClick={handleCopySummary}
                    className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Summary</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetForNewSelection}
                    className="px-4 py-2 bg-[#0052FF]/15 hover:bg-[#0052FF]/25 border border-[#0052FF]/40 text-blue-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Discover Another Life</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-white/10 cursor-pointer transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: TRANSACTION FAILED OR REJECTED */}
          {status === 'failed' && (
            <div className="text-center py-8 space-y-6 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-rose-400" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl font-black text-white">
                  Selection Not Completed
                </h3>
                <p className="text-rose-300 text-xs sm:text-sm leading-relaxed">
                  {errorMessage || 'Transaction could not be confirmed on Base Mainnet.'}
                </p>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 mt-2">
                  <strong>Protocol Rule:</strong> No successful transaction = No personality selection. No personality was revealed.
                </div>
              </div>

              {currentTxHash && (
                <a
                  href={getBaseScanTxUrl(currentTxHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-300 hover:underline inline-flex items-center gap-1 font-mono"
                >
                  <span>Inspect failed tx on BaseScan</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleInitiateOnChainSelection}
                  className="w-full py-3.5 px-6 bg-[#0052FF] hover:bg-blue-600 text-white font-display text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-[#0052FF]/25 cursor-pointer transition-all"
                >
                  Try Again on Base Mainnet
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-medium rounded-xl border border-white/10 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
