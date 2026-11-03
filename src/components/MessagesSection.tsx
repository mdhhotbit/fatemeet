import React, { useState, useEffect, useCallback } from 'react';
import { usePublicClient } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import {
  MessageSquare,
  RefreshCw,
  AlertCircle,
  Inbox,
  ArrowDown,
  Loader2,
} from 'lucide-react';
import {
  BASE_CHAIN_ID,
  CONTRACT_ADDRESS,
  GUESTBOOK_ABI,
  PAGE_SIZE,
  RPC_URL,
} from '../config/guestbook';
import { GuestbookEntry } from '../types/guestbook';

// Fallback public client to ensure messages load even without wallet connected
const fallbackPublicClient = createPublicClient({
  chain: base,
  transport: http(RPC_URL),
});

interface MessagesSectionProps {
  refreshTrigger: number;
  recentTxHash: `0x${string}` | null;
  onTotalMessagesUpdated?: (total: number) => void;
}

export const MessagesSection: React.FC<MessagesSectionProps> = ({
  refreshTrigger,
  recentTxHash,
  onTotalMessagesUpdated,
}) => {
  const wagmiPublicClient = usePublicClient({ chainId: BASE_CHAIN_ID });
  const client = wagmiPublicClient || fallbackPublicClient;

  const [messages, setMessages] = useState<GuestbookEntry[]>([]);
  const [totalMessages, setTotalMessages] = useState<number | null>(null);
  const [oldestLoadedIndex, setOldestLoadedIndex] = useState<number>(0);
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Fetches total count and the initial batch (up to 20 newest messages)
   * Newest messages are at the highest indices in the contract array.
   */
  const loadInitialMessages = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoadingInitial(true);
    }
    setErrorMessage(null);

    try {
      // 1. Fetch total number of messages on-chain
      const totalBigInt = (await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: GUESTBOOK_ABI,
        functionName: 'getTotalMessages',
      })) as bigint;

      const total = Number(totalBigInt);
      setTotalMessages(total);
      if (onTotalMessagesUpdated) {
        onTotalMessagesUpdated(total);
      }

      if (total === 0) {
        setMessages([]);
        setOldestLoadedIndex(0);
        return;
      }

      // 2. Compute pagination to retrieve the newest messages first
      const count = Math.min(PAGE_SIZE, total);
      const start = total - count;

      // 3. Read batch directly from smart contract getMessages(_start, _count)
      const rawMessages = (await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: GUESTBOOK_ABI,
        functionName: 'getMessages',
        args: [BigInt(start), BigInt(count)],
      })) as Array<{ sender: `0x${string}`; content: string; timestamp: bigint }>;

      // Map and reverse so the newest message (highest index) appears at the top
      const parsed: GuestbookEntry[] = rawMessages.map((msg, idx) => {
        const messageIndex = start + idx;
        return {
          id: messageIndex + 1, // 1-based message ID
          sender: msg.sender,
          content: msg.content,
          timestamp: Number(msg.timestamp) * 1000,
          // Attach session transaction hash to the newest entry if confirmed
          txHash: messageIndex === total - 1 && recentTxHash ? recentTxHash : undefined,
        };
      });

      // Reverse so newest appears first
      parsed.reverse();

      setMessages(parsed);
      setOldestLoadedIndex(start);
    } catch (err: any) {
      console.error('Failed to load guestbook messages:', err);
      setErrorMessage(
        err?.message || 'Failed to read messages from Base Mainnet.'
      );
    } finally {
      setIsLoadingInitial(false);
      setIsRefreshing(false);
    }
  }, [client, recentTxHash, onTotalMessagesUpdated]);

  /**
   * Loads older messages (next batch of up to 20)
   */
  const handleLoadMore = async () => {
    if (isLoadingMore || oldestLoadedIndex <= 0) return;

    setIsLoadingMore(true);
    try {
      const count = Math.min(PAGE_SIZE, oldestLoadedIndex);
      const start = oldestLoadedIndex - count;

      const rawOlder = (await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: GUESTBOOK_ABI,
        functionName: 'getMessages',
        args: [BigInt(start), BigInt(count)],
      })) as Array<{ sender: `0x${string}`; content: string; timestamp: bigint }>;

      const parsedOlder: GuestbookEntry[] = rawOlder.map((msg, idx) => ({
        id: start + idx + 1,
        sender: msg.sender,
        content: msg.content,
        timestamp: Number(msg.timestamp) * 1000,
      }));

      // Reverse batch to maintain newest-first order
      parsedOlder.reverse();

      setMessages((prev) => [...prev, ...parsedOlder]);
      setOldestLoadedIndex(start);
    } catch (err: any) {
      console.error('Failed to load more messages:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Initial load and auto-refresh on refreshTrigger
  useEffect(() => {
    loadInitialMessages();
  }, [loadInitialMessages, refreshTrigger]);

  const hasMoreMessages = oldestLoadedIndex > 0;

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Header with Title and Total Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Messages on Base
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Read directly from the Base blockchain.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {totalMessages !== null && (
            <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-xl bg-blue-50 text-[#0052FF] border border-blue-200/80">
              {totalMessages} {totalMessages === 1 ? 'Message' : 'Messages'} Total
            </span>
          )}

          <button
            onClick={() => loadInitialMessages(true)}
            disabled={isRefreshing || isLoadingInitial}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            title="Refresh messages from Base blockchain"
            aria-label="Refresh messages"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#0052FF]' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Error State */}
      {errorMessage && (
        <div className="p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Unable to fetch on-chain messages</p>
            <p className="text-rose-700 leading-relaxed">{errorMessage}</p>
          </div>
          <button
            onClick={() => loadInitialMessages(true)}
            className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Initial State */}
      {isLoadingInitial ? (
        <div className="py-20 text-center space-y-4">
          <Loader2 className="w-8 h-8 text-[#0052FF] animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-500">
            Reading messages from Base Mainnet...
          </p>
        </div>
      ) : messages.length === 0 ? (
        /* Empty State: Exact required copy */
        <div className="p-10 sm:p-14 text-center rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0052FF] flex items-center justify-center mx-auto mb-2 border border-blue-100">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
            No messages yet. Be the first to leave your mark on Base.
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Write a sentence above, confirm your transaction on Base Mainnet, and your words will permanently appear here.
          </p>
        </div>
      ) : (
        /* List of Messages */
        <div className="space-y-4">
          {messages.map((entry) => (
            <article
              key={`${entry.id}-${entry.timestamp}`}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all duration-200"
            >
              <p className="text-slate-800 text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap font-sans-clean font-medium">
                {entry.content}
              </p>
            </article>
          ))}

          {/* Load More Button */}
          {hasMoreMessages && (
            <div className="pt-6 text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-900 font-display text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs inline-flex items-center gap-2 disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#0052FF]" />
                    <span>Loading Older Messages...</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="w-4 h-4 text-[#0052FF]" />
                    <span>Load More Messages ({oldestLoadedIndex} remaining)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {!hasMoreMessages && messages.length > 0 && (
            <div className="pt-6 text-center">
              <p className="text-xs font-mono text-slate-400">
                All onchain messages loaded ({messages.length} total)
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
