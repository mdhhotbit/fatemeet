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
  CheckCircle2,
  Loader2,
  Lock,
  Zap,
} from 'lucide-react';
import { Personality, RevealStatus } from '../types';
import { getRandomPersonality, getPersonalityById } from '../lib/random';
import { PERSONALITIES } from '../data/personalities';
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  IS_CONTRACT_CONFIGURED,
  BASE_CHAIN_ID,
} from '../config/contract';
import { parseEncounterRevealedEvent, getBaseScanTxUrl } from '../lib/blockchain';
import { saveLocalEncounter, saveChainEncounter } from '../lib/encountersStorage';
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

  const canDoBlockchain = Boolean(IS_CONTRACT_CONFIGURED && isConnected && chain?.id === BASE_CHAIN_ID);
  const [useBlockchainMode, setUseBlockchainMode] = useState(false);

  const [status, setStatus] = useState<RevealStatus>('idle');
  const [revealedPersonality, setRevealedPersonality] = useState<Personality | null>(null);
  const [currentTxHash, setCurrentTxHash] = useState<`0x${string}` | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Cycling names animation during discovery
  const [shufflingName, setShufflingName] = useState('Albert Einstein');
  const [shufflingCategory, setShufflingCategory] = useState('Scientists & Inventors');

  // Wagmi contract write
  const { writeContractAsync } = useWriteContract();

  // Transaction receipt watcher
  const {
    data: txReceipt,
    isLoading: isTxConfirming,
    isSuccess: isTxSuccess,
    isError: isTxError,
  } = useWaitForTransactionReceipt({
    hash: currentTxHash || undefined,
  });

  // Cycle names rapidly during shuffling animation
  useEffect(() => {
    let interval: any;
    if (status === 'selecting') {
      interval = setInterval(() => {
        const rand = PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)];
        setShufflingName(rand.name);
        setShufflingCategory(rand.category);
      }, 90);
    }
    return () => clearInterval(interval);
  }, [status]);

  // Trigger reveal automatically when modal opens if idle
  useEffect(() => {
    if (isOpen && status === 'idle' && !revealedPersonality) {
      if (canDoBlockchain && useBlockchainMode) {
        startBlockchainReveal();
      } else {
        startInstantReveal();
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
          recordProfileSelection(found.id);
          if (address) {
            saveChainEncounter(address, found.id, currentTxHash);
            onEncounterSaved();
          }
          triggerElectricConfetti();
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

  const triggerElectricConfetti = () => {
    try {
      confetti({
        particleCount: 55,
        spread: 70,
        origin: { y: 0.62 },
        colors: ['#0052FF', '#38BDF8', '#FFFFFF', '#F5D77F'],
        ticks: 220,
      });
    } catch {
      // safe fallback
    }
  };

  const startInstantReveal = () => {
    setStatus('selecting');
    setErrorMessage(null);
    setCurrentTxHash(null);

    // Fast, responsive 1.4s delay for fun slot-machine anticipation
    setTimeout(() => {
      const selected = getRandomPersonality(revealedPersonality?.id);
      setRevealedPersonality(selected);
      setStatus('revealed');
      saveLocalEncounter(selected.id);
      recordProfileSelection(selected.id);
      onEncounterSaved();
      triggerElectricConfetti();
    }, 1400);
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
        'Base Mainnet contract address is not yet active. You can view the Solidity code via "Base Contract", or experience your encounter instantly.'
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
      startInstantReveal();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl">
      <div className="relative w-full max-w-3xl bg-[#060C1E] border border-[#0052FF]/30 rounded-3xl shadow-2xl shadow-[#0052FF]/15 overflow-hidden my-auto">
        {/* Header ribbon */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-slate-950/70">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0052FF] animate-pulse shadow-[0_0_8px_#0052FF]" />
            <span className="font-display text-sm sm:text-base font-bold tracking-wider text-white">
              DESTINY DISCOVERY
            </span>

            {/* Mode Tag */}
            <span
              className={`text-xs px-3 py-1 rounded-full font-mono font-medium ${
                useBlockchainMode && canDoBlockchain
                  ? 'bg-[#0052FF]/20 text-blue-300 border border-[#0052FF]/40'
                  : 'bg-slate-900 text-slate-300 border border-white/10'
              }`}
            >
              {useBlockchainMode && canDoBlockchain ? 'Base Mainnet On-Chain' : 'Instant Discovery'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close encounter modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          {/* STATE 1: SELECTING / SHUFFLING (Fun slot-machine vortex) */}
          {status === 'selecting' && (
            <div className="py-14 sm:py-20 flex flex-col items-center justify-center text-center">
              <div className="relative mb-8">
                {/* Outer spinning radar */}
                <div className="w-28 h-28 rounded-full border-2 border-[#0052FF]/30 flex items-center justify-center animate-spin-slow">
                  <div className="w-20 h-20 rounded-full border border-dashed border-[#38BDF8] flex items-center justify-center animate-spin">
                    <Compass className="w-9 h-9 text-[#0052FF]" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-[#0052FF]/25 rounded-full blur-2xl animate-pulse" />
              </div>

              {/* Live rapid name cycling */}
              <div className="min-h-[50px] flex flex-col items-center justify-center mb-4">
                <span className="text-xs uppercase tracking-widest text-[#38BDF8] font-mono font-semibold">
                  {shufflingCategory}
                </span>
                <span className="font-display text-2xl sm:text-4xl font-black text-white mt-1 transition-all">
                  {shufflingName}
                </span>
              </div>

              <p className="font-sans-clean text-slate-400 text-sm max-w-md">
                Interrogating the historical pantheon for an unexpected match...
              </p>

              <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0052FF]/10 border border-[#0052FF]/30 text-xs font-mono text-blue-300">
                <Zap className="w-3.5 h-3.5 text-[#38BDF8] animate-pulse" />
                <span>Unbiased Randomness Algorithm</span>
              </div>
            </div>
          )}

          {/* STATE 2: BLOCKCHAIN TRANSACTION PROGRESS */}
          {(status === 'waiting_wallet' || status === 'confirming') && (
            <div className="py-16 sm:py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-[#0052FF]/10 border border-[#0052FF]/40 flex items-center justify-center mb-6 relative">
                <Loader2 className="w-10 h-10 text-[#0052FF] animate-spin" />
                <div className="absolute inset-0 bg-[#0052FF]/20 rounded-2xl blur-xl" />
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-black text-white mb-2">
                {status === 'waiting_wallet'
                  ? 'Awaiting Wallet Confirmation'
                  : 'Recording On-Chain on Base'}
              </h2>

              <p className="text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
                {status === 'waiting_wallet'
                  ? 'Please confirm the reveal() call in your EVM wallet. Only minimal Base network gas is required.'
                  : 'Transaction submitted! Awaiting Base block inclusion and EncounterRevealed event...'}
              </p>

              {currentTxHash && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono flex items-center gap-2">
                  <span className="text-slate-400">Transaction:</span>
                  <a
                    href={getBaseScanTxUrl(currentTxHash)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#38BDF8] hover:text-white underline flex items-center gap-1 font-semibold"
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
              <div className="w-16 h-16 rounded-2xl bg-rose-950/50 border border-rose-500/40 flex items-center justify-center mb-5 text-rose-400">
                <AlertCircle className="w-8 h-8" />
              </div>

              <h2 className="font-display text-2xl font-black text-white mb-2">
                Encounter Interrupted
              </h2>

              <p className="text-sm text-slate-300 max-w-md mb-6 bg-slate-950/80 p-4 rounded-xl border border-white/5">
                {errorMessage || 'An error occurred during discovery.'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={startInstantReveal}
                  className="px-6 py-3 bg-[#0052FF] hover:bg-[#1A65FF] text-white font-display text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-[#0052FF]/20"
                >
                  Try Instant Encounter
                </button>
                <button
                  onClick={onOpenContractModal}
                  className="px-6 py-3 bg-slate-900 text-slate-200 border border-white/10 text-xs font-semibold rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
                >
                  View Contract Spec
                </button>
              </div>
            </div>
          )}

          {/* STATE 4: REVEALED PERSONALITY CARD */}
          {status === 'revealed' && revealedPersonality && (
            <div className="space-y-6">
              {/* Top Banner Notice */}
              <div className="flex items-center justify-between text-xs py-2.5 px-4 rounded-xl bg-slate-950 border border-white/[0.08]">
                <div className="flex items-center gap-2">
                  {currentTxHash ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-200 font-medium">
                        Base Mainnet Verified Transaction
                      </span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                      <span className="text-slate-200 font-medium">
                        Unbiased Historical Destiny Match
                      </span>
                    </>
                  )}
                </div>

                {currentTxHash ? (
                  <a
                    href={getBaseScanTxUrl(currentTxHash)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#38BDF8] hover:text-white font-mono flex items-center gap-1 underline"
                  >
                    <span>View on BaseScan</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Private & Anonymous</span>
                  </span>
                )}
              </div>

              {/* Main Personality Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Portrait Column */}
                <div className="md:col-span-5 flex flex-col items-center">
                  <div className="w-full max-w-[280px] sm:max-w-none rounded-2xl overflow-hidden border-2 border-[#0052FF]/50 shadow-2xl shadow-[#0052FF]/20 relative group">
                    <PortraitImage
                      src={revealedPersonality.portraitUrl}
                      alt={revealedPersonality.name}
                      initials={getInitials(revealedPersonality.name)}
                      aspectRatio="hero"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060C1E] via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-center">
                      <span className="text-[11px] text-blue-200 font-mono tracking-widest uppercase bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-md border border-white/10">
                        Personality #{revealedPersonality.id} of 50
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
                  {/* Category & Lifetime badges */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0052FF]/15 text-blue-300 border border-[#0052FF]/30 font-semibold">
                      {revealedPersonality.category}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-300 font-medium">{revealedPersonality.nationality}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-mono text-cyan-300">
                      {revealedPersonality.birthDate}
                      {revealedPersonality.deathDate
                        ? ` — ${revealedPersonality.deathDate}`
                        : ' (Living)'}
                    </span>
                  </div>

                  {/* Full Name */}
                  <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                    {revealedPersonality.name}
                  </h2>

                  {/* Profession */}
                  <p className="font-sans-clean font-medium text-blue-200 text-base sm:text-lg">
                    {revealedPersonality.profession}
                  </p>

                  {/* Historical Quote */}
                  {revealedPersonality.quote && (
                    <blockquote className="p-3.5 rounded-xl bg-[#0052FF]/10 border-l-3 border-[#0052FF] text-xs sm:text-sm italic text-blue-100 leading-relaxed font-sans-clean">
                      "{revealedPersonality.quote}"
                    </blockquote>
                  )}

                  {/* Biography (4-5 sentences) */}
                  <div className="space-y-1.5">
                    <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                      Life & Impact
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed font-normal">
                      {revealedPersonality.biography}
                    </p>
                  </div>

                  {/* Major Achievements */}
                  <div className="space-y-1.5 pt-1">
                    <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                      Key Milestones
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {revealedPersonality.majorAchievements.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#0052FF] font-bold shrink-0 mt-0.5">✦</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons: MEET ANOTHER & SHARE THIS LIFE */}
              <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={handleMeetAnother}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#0052FF] hover:bg-[#1A65FF] text-white font-display text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#0052FF]/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>DISCOVER ANOTHER LIFE</span>
                </button>

                <div className="w-full sm:w-auto flex items-center gap-2">
                  <button
                    onClick={handleShareOnX}
                    className="flex-1 sm:flex-initial px-4 py-3.5 bg-slate-900 border border-[#0052FF]/30 text-blue-200 hover:text-white hover:bg-slate-800 text-xs font-bold tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-[#38BDF8]" />
                    <span>SHARE DISCOVERY</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-3.5 bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer font-medium"
                    title="Copy discovery text to clipboard"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 text-xs">Copied</span>
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
