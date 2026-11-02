import { decodeEventLog, TransactionReceipt } from 'viem';
import { CONTRACT_ABI, BASESCAN_URL } from '../config/contract';

export interface DecodedEncounterEvent {
  user: string;
  personalityId: number;
  timestamp: number;
}

/**
 * Parses the confirmed transaction receipt to extract the EncounterRevealed event.
 * Never guesses or generates random IDs after a blockchain transaction.
 */
export function parseEncounterRevealedEvent(
  receipt: TransactionReceipt
): DecodedEncounterEvent | null {
  if (!receipt || !receipt.logs) return null;

  for (const log of receipt.logs) {
    try {
      const decoded = decodeEventLog({
        abi: CONTRACT_ABI,
        data: log.data,
        topics: log.topics,
      });

      if (decoded.eventName === 'EncounterRevealed') {
        const args = decoded.args as {
          user: string;
          personalityId: bigint;
          timestamp: bigint;
        };

        return {
          user: args.user,
          personalityId: Number(args.personalityId),
          timestamp: Number(args.timestamp) * 1000,
        };
      }
    } catch {
      // Not our event in this log; continue searching
    }
  }

  return null;
}

/**
 * Returns shortened EVM address: 0x1234...5678
 */
export function shortenAddress(address: string | undefined): string {
  if (!address) return '';
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Generates BaseScan transaction link
 */
export function getBaseScanTxUrl(txHash: string): string {
  return `${BASESCAN_URL}/tx/${txHash}`;
}

/**
 * Generates BaseScan address link
 */
export function getBaseScanAddressUrl(address: string): string {
  return `${BASESCAN_URL}/address/${address}`;
}
