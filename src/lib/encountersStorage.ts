import { EncounterRecord } from '../types';

const LOCAL_STORAGE_KEY = 'fate_meet_encounters';
const CHAIN_STORAGE_KEY_PREFIX = 'fate_meet_chain_encounters_';

export function getLocalEncounters(): EncounterRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem('fate_meet_demo_encounters');
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalEncounter(personalityId: number): EncounterRecord {
  const newRecord: EncounterRecord = {
    id: `enc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    personalityId,
    timestamp: Date.now(),
    isDemo: false,
  };

  try {
    const existing = getLocalEncounters();
    const updated = [newRecord, ...existing].slice(0, 100);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save encounter to localStorage', err);
  }

  return newRecord;
}

export function clearLocalEncounters(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem('fate_meet_demo_encounters');
  } catch (err) {
    console.warn('Failed to clear encounters', err);
  }
}

// Aliases for compatibility
export const getDemoEncounters = getLocalEncounters;
export const saveDemoEncounter = saveLocalEncounter;
export const clearDemoEncounters = clearLocalEncounters;

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
