import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
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
  ShieldCheck,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Personality, RevealStatus } from '../types';
import { getRandomPersonality, getPersonalityById } from '../lib/random';
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  IS_CONTRACT_CONFIGURED,
  BASE_CHAIN_ID,
} from '../config/contract';
import { parseEncounterRevealedEvent, getBaseScanTxUrl } from '../lib/blockchain';
import { saveDemoEncounter, saveChainEncounter } from '../lib/encountersStorage';
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

  // Mode: if contract is configured and wallet connected on Base, can do blockchain
  // By default, if contract not configured or wallet not connected, defaults to Demo Mode
  const canDoBlockchain = Boolean(IS_CONTRACT_CONFIGURED && isConnected && chain?.id === BASE_CHAIN_ID);
  const [useBlockchainMode, setUseBlockchainMode] = useState(false);

  const [status, setStatus] = useState<RevealStatus>('idle');
  const [revealedPersonality, setRevealedPersonality] = useState<Personality | null>(null);
  const [currentTxHash, setCurrentTxHash] = useState<`0x${string}` | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Wagmi contract write
  const { writeContractAsync, isPending: isWalletApprovalPending } = useWriteContract();

  // Transaction receipt watcher
  const {
    data: txReceipt,
    isLoading: isTxConfirming,
    isSuccess: isTxSuccess,
    isError: isTxError,
  } = useWaitForTransactionReceipt({
    hash: currentTxHash || undefined,
  });

  // Trigger reveal automatically when modal opens if idle
  useEffect(() => {
    if (isOpen && status === 'idle' && !revealedPersonality) {
      if (canDoBlockchain && useBlockchainMode) {
        startBlockchainReveal();
      } else {
        startDemoReveal();
      }
    }
  }, [isOpen]);

  // Handle tx receipt confirmation
  useEffect(() => {
    if (isTxSuccess && txReceipt && currentTxHash && status === 'confirming') {
      const decoded = parseEncounterRevealedEvent(txReceipt);
      if (decoded && decoded.personalityId) {
        const found = getPersonalityById(decoded.personalityId);
        if (found) {
          setRevealedPersonality(found);
          setStatus('revealed');
          if (address) {
            saveChainEncounter(address, found.id, currentTxHash);
            onEncounterSaved();
          }
          triggerGoldConfetti();
        } else {
          setStatus('failed');
          setErrorMessage(`Received personality ID ${decoded.personalityId} outside 1-50 range.`);
        }
      } else {
        setStatus('failed');
        setErrorMessage('Transaction succeeded but EncounterRevealed event could not be parsed.');
      }
    } else if (isTxError && status === 'confirming') {
      setStatus('failed');
      setErrorMessage('Transaction execution failed on the Base blockchain.');
    }
  }, [isTxSuccess, isTxError, txReceipt]);

  const triggerGoldConfetti = () => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#D4AF37', '#F5D77F', '#FFF6D5', '#0052FF'],
        ticks: 200,
      });
    } catch {
      // safe fallback
    }
  };

  const startDemoReveal = () => {
    setStatus('selecting');
    setErrorMessage(null);
    setCurrentTxHash(null);

    // Cinematic delay to create suspense and allow animation
    setTimeout(() => {
      const selected = getRandomPersonality(revealedPersonality?.id);
      setRevealedPersonality(selected);
      setStatus('revealed');
      saveDemoEncounter(selected.id);
      onEncounterSaved();
      triggerGoldConfetti();
    }, 1800);
  };

  const startBlockchainReveal = async () => {
    if (!isConnected) {
      onOpenWalletModal();
      return;
    }

    if (chain?.id !== BASE_CHAIN_ID) {
      setStatus('failed');
      setErrorMessage('Please switch your wallet network to Base Mainnet (Chain ID 8453).');
      return;
    }

    if (!IS_CONTRACT_CONFIGURED || !CONTRACT_ADDRESS) {
      setStatus('failed');
      setErrorMessage(
        'Smart contract address has not yet been deployed to Base Mainnet (Phase 1). You can view the Solidity code and Remix instructions via "Contract Spec", or run in Demo Mode.'
      );
      return;
    }

    try {
      setStatus('waiting_wallet');
      setErrorMessage(null);
      setCurrentTxHash(null);

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'reveal',
        args: [],
      });

      setCurrentTxHash(hash);
      setStatus('confirming');
    } catch (err: any) {
      setStatus('failed');
      if (err?.message?.includes('User rejected') || err?.message?.includes('denied')) {
        setErrorMessage('Transaction rejected in wallet.');
      } else {
        setErrorMessage(err?.shortMessage || err?.message || 'Transaction submission failed.');
      }
    }
  };

  const handleMeetAnother = () => {
    if (useBlockchainMode && canDoBlockchain) {
      startBlockchainReveal();
    } else {
      startDemoReveal();
    }
  };

  const handleShareOnX = () => {
    if (!revealedPersonality) return;
    const url = window.location.origin;
    const text = `I just met ${revealedPersonality.name} on FATE MEET.\n\nOne click. One extraordinary life.\n\nDiscover yours: ${url}`;
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(xUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    if (!revealedPersonality) return;
    const text = `I just met ${revealedPersonality.name} on FATE MEET. Discover yours: ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#090d1a] border border-amber-500/30 rounded-2xl shadow-2xl shadow-amber-500/10 overflow-hidden my-auto">
        {/* Header ribbon */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-cinzel text-sm sm:text-base font-bold tracking-wider text-amber-200">
              DESTINY ENCOUNTER
            </span>

            {/* Mode Tag */}
            <span
              className={`text-xs px-2.5 py-0.5 rounded font-mono ${
                useBlockchainMode && canDoBlockchain
                  ? 'bg-blue-900/40 text-blue-300 border border-blue-500/30'
                  : 'bg-amber-950/40 text-amber-300 border border-amber-500/30'
              }`}
            >
              {useBlockchainMode && canDoBlockchain ? 'Base Mainnet' : 'DEMO MODE'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close encounter modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 max-h-[85vh] overflow-y-auto">
          {/* STATE 1: SELECTING / SHUFFLING (Demo Mode) */}
          {status === 'selecting' && (
            <div className="py-16 sm:py-24 flex flex-col items-center justify-center text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full border border-amber-500/30 flex items-center justify-center animate-spin-slow">
                  <div className="w-16 h-16 rounded-full border border-dashed border-amber-400 flex items-center justify-center animate-spin">
                    <Compass className="w-8 h-8 text-amber-300" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl animate-pulse" />
              </div>

              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white mb-3">
                Aligning The Threads Of Time
              </h2>
              <p className="font-editorial italic text-slate-400 text-base sm:text-lg max-w-md">
                Searching 50 extraordinary lives across world history...
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-mono text-amber-400/80">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulating Unbiased Destiny Match</span>
              </div>
            </div>
          )}

          {/* STATE 2: BLOCKCHAIN TRANSACTION PROGRESS */}
          {(status === 'waiting_wallet' || status === 'confirming') && (
            <div className="py-16 sm:py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-blue-950/50 border border-blue-500/40 flex items-center justify-center mb-6 relative">
                <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-lg" />
              </div>

              <h2 className="font-cinzel text-2xl font-bold text-white mb-2">
                {status === 'waiting_wallet'
                  ? 'Awaiting Wallet Approval'
                  : 'Recording Encounter on Base'}
              </h2>

              <p className="text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
                {status === 'waiting_wallet'
                  ? 'Please confirm the reveal() transaction in your wallet. Only network gas is required.'
                  : 'Transaction submitted! Waiting for Base blockchain confirmation and EncounterRevealed event...'}
              </p>

              {currentTxHash && (
                <div className="p-3 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono flex items-center gap-2">
                  <span className="text-slate-400">Tx Hash:</span>
                  <a
                    href={getBaseScanTxUrl(currentTxHash)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
                  >
                    <span>{currentTxHash.slice(0, 10)}...{currentTxHash.slice(-8)}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* STATE 3: ERROR / FAILED */}
          {status === 'failed' && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-rose-950/50 border border-rose-500/40 flex items-center justify-center mb-5 text-rose-400">
                <AlertCircle className="w-8 h-8" />
              </div>

              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white mb-2">
                Encounter Interrupted
              </h2>

              <p className="text-sm text-slate-300 max-w-md mb-6 bg-slate-950/80 p-4 rounded-lg border border-white/5">
                {errorMessage || 'An error occurred while revealing destiny.'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={startDemoReveal}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-300 to-amber-500 text-slate-950 font-cinzel text-xs font-bold uppercase tracking-wider rounded-lg hover:from-amber-200 hover:to-amber-400 transition-all cursor-pointer"
                >
                  Try in Demo Mode
                </button>
                <button
                  onClick={onOpenContractModal}
                  className="px-5 py-2.5 bg-slate-900 text-slate-200 border border-white/10 text-xs font-medium rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
                >
                  View Contract Architecture
                </button>
              </div>
            </div>
          )}

          {/* STATE 4: REVEALED PERSONALITY CARD */}
          {status === 'revealed' && revealedPersonality && (
            <div className="space-y-6">
              {/* Top Banner Notice for Demo vs Blockchain */}
              <div className="flex items-center justify-between text-xs py-2 px-3.5 rounded-lg bg-slate-950/80 border border-white/5">
                <div className="flex items-center gap-2">
                  {currentTxHash ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-300">
                        Verified Base Transaction Event Confirmed
                      </span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-slate-300">
                        Demo Encounter · Unbiased Local Random Match
                      </span>
                    </>
                  )}
                </div>

                {currentTxHash ? (
                  <a
                    href={getBaseScanTxUrl(currentTxHash)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-mono flex items-center gap-1 underline"
                  >
                    <span>View on BaseScan</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-amber-400/90 font-mono">Phase 1 Demo</span>
                )}
              </div>

              {/* Main Personality Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Portrait Column */}
                <div className="md:col-span-5 flex flex-col items-center">
                  <div className="w-full max-w-[280px] sm:max-w-none rounded-xl overflow-hidden border-2 border-amber-500/40 gold-border-glow shadow-2xl relative group">
                    <PortraitImage
                      src={revealedPersonality.portraitUrl}
                      alt={revealedPersonality.name}
                      initials={getInitials(revealedPersonality.name)}
                      aspectRatio="hero"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-2 left-2 right-2 text-center">
                      <span className="text-[11px] text-amber-200/80 font-mono tracking-widest uppercase">
                        ID #{revealedPersonality.id} of 50
                      </span>
                    </div>
                  </div>

                  {/* Image Attribution */}
                  <p className="text-[10px] text-slate-500 text-center mt-2 px-2 line-clamp-1">
                    {revealedPersonality.imageAttribution}
                  </p>
                </div>

                {/* Information Column */}
                <div className="md:col-span-7 space-y-4">
                  {/* Category & Lifetime unboxed metadata */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-amber-300/80 font-medium tracking-wide">
                    <span>{revealedPersonality.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{revealedPersonality.nationality}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-300">
                      {revealedPersonality.birthDate}
                      {revealedPersonality.deathDate
                        ? ` — ${revealedPersonality.deathDate}`
                        : ' (Living)'}
                    </span>
                  </div>

                  {/* Full Name */}
                  <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                    {revealedPersonality.name}
                  </h2>

                  {/* Profession */}
                  <p className="font-editorial italic text-amber-100 text-lg sm:text-xl">
                    {revealedPersonality.profession}
                  </p>

                  {/* Quote if available */}
                  {revealedPersonality.quote && (
                    <blockquote className="p-3.5 rounded-lg bg-amber-500/5 border-l-2 border-amber-400 text-xs sm:text-sm italic text-amber-200/90 leading-relaxed font-editorial">
                      "{revealedPersonality.quote}"
                    </blockquote>
                  )}

                  {/* Biography (4-5 engaging sentences) */}
                  <div className="space-y-2">
                    <h3 className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                      Life & Legacy
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed font-normal">
                      {revealedPersonality.biography}
                    </p>
                  </div>

                  {/* Major Achievements */}
                  <div className="space-y-2 pt-2">
                    <h3 className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                      Major Achievements
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {revealedPersonality.majorAchievements.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-400 shrink-0 mt-0.5">✦</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons: MEET ANOTHER & SHARE THIS LIFE */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={handleMeetAnother}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-slate-950 font-cinzel text-xs font-bold uppercase tracking-widest rounded-lg hover:from-amber-200 hover:to-amber-400 shadow-lg shadow-amber-500/10 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>MEET ANOTHER</span>
                </button>

                <div className="w-full sm:w-auto flex items-center gap-2">
                  <button
                    onClick={handleShareOnX}
                    className="flex-1 sm:flex-initial px-4 py-3 bg-slate-900 border border-amber-500/30 text-amber-200 hover:text-white hover:bg-slate-800 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-amber-400" />
                    <span>SHARE THIS LIFE</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-3 bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Copy share text to clipboard"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 text-xs">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-xs">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
