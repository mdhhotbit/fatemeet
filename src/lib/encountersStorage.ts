import { EncounterRecord } from '../types';

const DEMO_STORAGE_KEY = 'fate_meet_demo_encounters';
const CHAIN_STORAGE_KEY_PREFIX = 'fate_meet_chain_encounters_';

export function getDemoEncounters(): EncounterRecord[] {
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveDemoEncounter(personalityId: number): EncounterRecord {
  const newRecord: EncounterRecord = {
    id: `demo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    personalityId,
    timestamp: Date.now(),
    isDemo: true,
  };

  try {
    const existing = getDemoEncounters();
    const updated = [newRecord, ...existing].slice(0, 100);
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save demo encounter to localStorage', err);
  }

  return newRecord;
}

export function clearDemoEncounters(): void {
  try {
    localStorage.removeItem(DEMO_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear demo encounters', err);
  }
}

export function getChainEncounters(walletAddress?: string): EncounterRecord[] {
  if (!walletAddress) return [];
  try {
    const raw = localStorage.getItem(`${CHAIN_STORAGE_KEY_PREFIX}${walletAddress.toLowerCase()}`);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveChainEncounter(
  walletAddress: string,
  personalityId: number,
  txHash: string
): EncounterRecord {
  const newRecord: EncounterRecord = {
    id: `chain_${txHash}`,
    personalityId,
    timestamp: Date.now(),
    isDemo: false,
    txHash,
    walletAddress: walletAddress.toLowerCase(),
  };

  try {
    const key = `${CHAIN_STORAGE_KEY_PREFIX}${walletAddress.toLowerCase()}`;
    const raw = localStorage.getItem(key);
    const existing: EncounterRecord[] = raw ? JSON.parse(raw) : [];
    // Avoid duplicate txHash
    const updated = [newRecord, ...existing.filter((r) => r.txHash !== txHash)].slice(0, 100);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save chain encounter to localStorage', err);
  }

  return newRecord;
}
