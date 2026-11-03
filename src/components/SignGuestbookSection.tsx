import React, { useState, useEffect } from 'react';
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
  useBalance,
} from 'wagmi';
import confetti from 'canvas-confetti';
import {
  PenLine,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Wallet,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  BASE_CHAIN_ID,
  CONTRACT_ADDRESS,
  GUESTBOOK_ABI,
  MAX_MESSAGE_BYTES,
} from '../config/guestbook';
import { getUtf8ByteLength, getBaseScanTxUrl } from '../lib/utils';
import { SubmissionStatus } from '../types/guestbook';

interface SignGuestbookSectionProps {
  onMessageSigned: (txHash?: `0x${string}`) => void;
  onOpenWalletModal: () => void;
  formRef: React.RefObject<HTMLDivElement | null>;
}

export const SignGuestbookSection: React.FC<SignGuestbookSectionProps> = ({
  onMessageSigned,
  onOpenWalletModal,
  formRef,
}) => {
  const { address, isConnected, chain } = useAccount();
  const { switchChain, isPending: isSwitchPending } = useSwitchChain();
  const { data: balanceData } = useBalance({
    address,
    chainId: BASE_CHAIN_ID,
  });

  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [currentTxHash, setCurrentTxHash] = useState<`0x${string}` | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastConfirmedMessage, setLastConfirmedMessage] = useState<string | null>(null);

  // Wagmi Contract Write
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();

  // Transaction Receipt Watcher
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

  // Calculate UTF-8 byte length using the TextEncoder API
  const byteLength = getUtf8ByteLength(message);
  const bytesRemaining = MAX_MESSAGE_BYTES - byteLength;
  const isOverByteLimit = bytesRemaining < 0;
  const isMessageEmpty = message.trim().length === 0;
  const isBaseMainnet = chain?.id === BASE_CHAIN_ID;
  const isSubmitting = isWritePending || isTxConfirming || status === 'waiting_wallet' || status === 'confirming';

  // Handle transaction confirmation
  useEffect(() => {
    if (isTxSuccess && txReceipt && currentTxHash && status === 'confirming') {
      if (txReceipt.status === 'success') {
        setStatus('success');
        setLastConfirmedMessage(message);
        setMessage('');
        setErrorMessage(null);
        onMessageSigned(currentTxHash);

        // Celebratory confetti
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#0052FF', '#38BDF8', '#10B981', '#F59E0B'],
          });
        } catch {
          // confetti optional
        }
      } else {
        setStatus('error');
        setErrorMessage('Transaction was reverted on Base Mainnet. Your message was not recorded.');
      }
    } else if (isTxError && status === 'confirming') {
      setStatus('error');
      setErrorMessage(
        receiptError?.message || 'Transaction failed to confirm on Base Mainnet. Please try again.'
      );
    }
  }, [isTxSuccess, isTxError, txReceipt, currentTxHash, status, receiptError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate clicks
    if (isSubmitting) return;

    // Validate wallet connection
    if (!isConnected) {
      onOpenWalletModal();
      return;
    }

    // Validate network
    if (!isBaseMainnet) {
      try {
        await switchChain({ chainId: BASE_CHAIN_ID });
      } catch {
        setErrorMessage('Please switch your wallet to Base Mainnet (Chain ID 8453) to proceed.');
        setStatus('error');
      }
      return;
    }

    // Validate message content
    if (isMessageEmpty) {
      setErrorMessage('Message cannot be empty. Please enter your words.');
      setStatus('error');
      return;
    }

    // Validate UTF-8 byte limit
    if (isOverByteLimit) {
      setErrorMessage(
        `Message exceeds the smart contract limit of 280 UTF-8 bytes (currently ${byteLength} bytes). Please shorten your message.`
      );
      setStatus('error');
      return;
    }

    // Check gas balance warning
    if (balanceData && balanceData.value === 0n) {
      setErrorMessage(
        'Insufficient ETH balance for gas. A tiny amount of ETH on Base Mainnet (typically < $0.001) is required to pay network transaction gas.'
      );
      setStatus('error');
      return;
    }

    try {
      setStatus('waiting_wallet');
      setErrorMessage(null);
      setCurrentTxHash(null);

      // Execute signGuestbook(string _content)
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: GUESTBOOK_ABI,
        functionName: 'signGuestbook',
        args: [message.trim()],
      });

      setCurrentTxHash(hash);
      setStatus('confirming');
    } catch (err: any) {
      const isUserRejected =
        err?.name === 'UserRejectedRequestError' ||
        err?.message?.toLowerCase().includes('user rejected') ||
        err?.message?.toLowerCase().includes('denied') ||
        err?.cause?.message?.toLowerCase().includes('user rejected');

      if (isUserRejected) {
        setStatus('idle');
        setCurrentTxHash(null);
        setErrorMessage('Transaction was cancelled in your wallet.');
        return;
      }

      const isInsufficientFunds =
        err?.message?.toLowerCase().includes('insufficient funds') ||
        err?.message?.toLowerCase().includes('exceeds balance') ||
        err?.cause?.message?.toLowerCase().includes('insufficient funds');

      if (isInsufficientFunds) {
        setStatus('error');
        setErrorMessage(
          'Insufficient ETH for Base network gas fees. Please deposit a small amount of ETH on Base.'
        );
        return;
      }

      setStatus('error');
      setErrorMessage(
        err?.shortMessage || err?.message || 'Transaction initiation failed on Base Mainnet.'
      );
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setCurrentTxHash(null);
    setErrorMessage(null);
  };

  return (
    <section ref={formRef} className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 p-6 sm:p-10">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0052FF] flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-xs">
            <PenLine className="w-6 h-6" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Say Whatever You Want!
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Leave a message. Make it part of Base history.
          </p>
        </div>

        {/* Success Banner */}
        {status === 'success' && (
          <div className="mb-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="font-display text-base font-bold">
                Your message is now part of Base history!
              </h3>
            </div>
            {lastConfirmedMessage && (
              <p className="text-xs sm:text-sm font-medium text-emerald-800 italic bg-white/70 p-3 rounded-xl border border-emerald-200/60">
                "{lastConfirmedMessage}"
              </p>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {currentTxHash && (
                <a
                  href={getBaseScanTxUrl(currentTxHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono font-semibold text-[#0052FF] hover:underline inline-flex items-center gap-1.5"
                >
                  <span>View confirmed transaction on BaseScan</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
              >
                Write Another Message
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {status === 'error' && errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-rose-800">Submission Error</p>
              <p className="text-rose-700 leading-relaxed">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-800 text-xs font-bold p-1 cursor-pointer"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Message Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label htmlFor="guestbook-message" className="sr-only">
              Your message for the Base Guestbook
            </label>
            <textarea
              id="guestbook-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
              placeholder="Write something meaningful, funny, random, or just say GM..."
              className="w-full p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#0052FF] focus:bg-white focus:ring-4 focus:ring-blue-100 text-slate-900 placeholder-slate-400 text-base leading-relaxed resize-none focus:outline-none transition-all disabled:opacity-60"
            />

            {/* Real-time UTF-8 Byte Counter */}
            <div className="flex items-center justify-between px-1 pt-1.5 text-xs font-mono">
              <span className="text-slate-500 font-sans">
                Max 280 bytes UTF-8 limit
              </span>
              <span
                className={`font-semibold ${
                  isOverByteLimit
                    ? 'text-rose-600'
                    : bytesRemaining < 30
                    ? 'text-amber-600'
                    : 'text-slate-500'
                }`}
              >
                {bytesRemaining >= 0
                  ? `${bytesRemaining} bytes remaining`
                  : `${Math.abs(bytesRemaining)} bytes over limit`}
              </span>
            </div>
          </div>

          {/* Network Switch Prompt (if connected but wrong chain) */}
          {isConnected && !isBaseMainnet && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>You are not on Base Mainnet.</span>
              </div>
              <button
                type="button"
                onClick={() => switchChain({ chainId: BASE_CHAIN_ID })}
                disabled={isSwitchPending}
                className="px-3 py-1.5 bg-[#0052FF] hover:bg-[#0047DB] text-white font-bold rounded-lg cursor-pointer transition-colors"
              >
                {isSwitchPending ? 'Switching...' : 'Switch to Base'}
              </button>
            </div>
          )}

          {/* Pending State Indicator */}
          {isSubmitting && (
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center gap-3 text-xs sm:text-sm">
              <Loader2 className="w-5 h-5 text-[#0052FF] animate-spin shrink-0" />
              <div className="flex-1">
                {status === 'waiting_wallet' && (
                  <p className="font-semibold">
                    Please approve the transaction in your wallet...
                  </p>
                )}
                {status === 'confirming' && (
                  <div>
                    <p className="font-semibold">
                      Broadcasting message to Base blockchain...
                    </p>
                    {currentTxHash && (
                      <p className="text-[11px] font-mono text-blue-700 mt-0.5">
                        Tx: {currentTxHash.slice(0, 10)}...{currentTxHash.slice(-8)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submission Action Button */}
          {!isConnected ? (
            <button
              type="button"
              onClick={onOpenWalletModal}
              className="w-full py-4 px-6 bg-[#0052FF] hover:bg-[#0047DB] active:scale-[0.99] text-white font-display text-base font-bold uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-lg shadow-[#0052FF]/20 flex items-center justify-center gap-2"
            >
              <Wallet className="w-5 h-5" />
              <span>Connect Wallet to Sign</span>
            </button>
          ) : !isBaseMainnet ? (
            <button
              type="button"
              onClick={() => switchChain({ chainId: BASE_CHAIN_ID })}
              disabled={isSwitchPending}
              className="w-full py-4 px-6 bg-amber-600 hover:bg-amber-700 active:scale-[0.99] text-white font-display text-base font-bold uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>{isSwitchPending ? 'Switching Network...' : 'Switch to Base Mainnet'}</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || isMessageEmpty || isOverByteLimit}
              className="w-full py-4 px-6 bg-[#0052FF] hover:bg-[#0047DB] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed text-white font-display text-base font-bold uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-lg shadow-[#0052FF]/25 flex items-center justify-center gap-2.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Onchain...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Sign Guestbook</span>
                </>
              )}
            </button>
          )}

          {/* Fee Information - Mandatory requirement */}
          <div className="pt-2 text-center">
            <p className="text-xs text-slate-500 font-sans">
              Only Base network gas fees. No additional platform fees.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};
