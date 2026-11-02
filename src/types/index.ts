export type PersonalityCategory =
  | 'Scientists & Inventors'
  | 'Historical Leaders'
  | 'Artists, Writers & Musicians'
  | 'Entrepreneurs & Innovators'
  | 'Sports & Cultural Icons';

export interface Personality {
  id: number; // 1 to 50
  name: string;
  category: PersonalityCategory;
  nationality: string;
  profession: string;
  birthDate: string;
  deathDate: string | null; // null for living figures
  isLiving: boolean;
  biography: string; // 4 to 5 engaging, accurate sentences
  majorAchievements: string[];
  portraitUrl: string;
  imageAttribution: string;
  quote?: string;
}

export interface EncounterRecord {
  id: string;
  personalityId: number;
  timestamp: number;
  isDemo: boolean;
  txHash?: string;
  walletAddress?: string;
}

export type RevealStatus =
  | 'idle'
  | 'selecting'
  | 'waiting_wallet'
  | 'tx_submitted'
  | 'confirming'
  | 'revealed'
  | 'failed';
