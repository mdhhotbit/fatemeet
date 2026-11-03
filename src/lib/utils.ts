import { BASESCAN_URL } from '../config/guestbook';

/**
 * Accurately measures UTF-8 byte length using the Web TextEncoder API.
 * Ensures compliance with the smart contract's 280-byte limit.
 */
export function getUtf8ByteLength(text: string): number {
  if (!text) return 0;
  return new TextEncoder().encode(text).length;
}

/**
 * Returns a shortened EVM address (e.g. 0x829A...7c1A)
 */
export function shortenAddress(address?: string): string {
  if (!address) return '';
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Formats a timestamp into an English readable date and time.
 */
export function formatDateTime(timestampMs: number): string {
  if (!timestampMs || isNaN(timestampMs)) return '';
  const date = new Date(timestampMs);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Formats relative time (e.g., "just now", "5m ago", "2h ago", "1d ago")
 */
export function formatRelativeTime(timestampMs: number): string {
  if (!timestampMs) return '';
  const elapsed = Date.now() - timestampMs;
  if (elapsed < 30000) return 'Just now';
  const minutes = Math.floor(elapsed / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDateTime(timestampMs);
}

/**
 * Generates BaseScan transaction link.
 */
export function getBaseScanTxUrl(txHash: string): string {
  return `${BASESCAN_URL}/tx/${txHash}`;
}

/**
 * Generates BaseScan address link.
 */
export function getBaseScanAddressUrl(address: string): string {
  return `${BASESCAN_URL}/address/${address}`;
}

/**
 * Generates a deterministic, pleasant avatar color gradient based on address.
 */
export function getAddressColor(address?: string): { bg: string; text: string } {
  if (!address) return { bg: '#E2E8F0', text: '#0F172A' };
  const clean = address.toLowerCase().replace('0x', '');
  const num = parseInt(clean.slice(0, 6) || '0', 16);
  const hues = [215, 224, 199, 142, 262, 330, 24, 173];
  const hue = hues[num % hues.length];
  return {
    bg: `hsl(${hue}, 85%, 94%)`,
    text: `hsl(${hue}, 80%, 35%)`,
  };
}

export const formatDate = formatDateTime;

export function getInitials(name?: string): string {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

