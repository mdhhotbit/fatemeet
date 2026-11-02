import { decodeEventLog, TransactionReceipt } from 'viem';
import { CONTRACT_ABI, BASESCAN_URL } from '../config/contract';

export interface DecodedSelectionEvent {
  user: string;
  selectionNumber?: number;
  personalityId?: number;
  timestamp: number;
}

/**
 * Parses the confirmed transaction receipt to extract the GM event on Base Mainnet.
 */
export function parseSelectionReceipt(
  receipt: TransactionReceipt
): DecodedSelectionEvent | null {
  if (!receipt || !receipt.logs) return null;

  for (const log of receipt.logs) {
    try {
      const decoded = decodeEventLog({
        abi: CONTRACT_ABI,
        data: log.data,
        topics: log.topics,
      });

      if (decoded.eventName === 'GM') {
        const args = decoded.args as {
          sender: string;
          timestamp: bigint;
        };

        return {
          user: args.sender,
          timestamp: Number(args.timestamp) * 1000,
        };
      }
    } catch {
      // Continue to next log
    }
  }

  return null;
}

/**
 * Generates personality ID (1-50) using the confirmed Base transaction hash as entropy.
 * CRITICAL PRIVACY FEATURE: Keeps the chosen personality strictly OFF-CHAIN so the public
 * blockchain ledger never records or exposes individual selections.
 */
export function derivePersonalityIdFromTxHash(txHash: string): number {
  if (!txHash) return Math.floor(Math.random() * 50) + 1;
  const clean = txHash.toLowerCase().replace(/^0x/, '');
  // Take last 8 hex digits
  const seedSlice = clean.slice(-8);
  const intVal = parseInt(seedSlice, 16);
  if (isNaN(intVal)) return Math.floor(Math.random() * 50) + 1;
  return (intVal % 50) + 1;
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

// Backward compatibility alias
export const parseEncounterRevealedEvent = parseSelectionReceipt;
