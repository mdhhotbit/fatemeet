import { PERSONALITIES } from '../data/personalities';
import { Personality } from '../types';

/**
 * Returns a randomly selected personality for Demo Mode.
 * Optionally avoids immediately repeating the current ID to make repeated clicks exciting.
 */
export function getRandomPersonality(excludeId?: number): Personality {
  let candidates = PERSONALITIES;
  if (excludeId && PERSONALITIES.length > 1) {
    candidates = PERSONALITIES.filter((p) => p.id !== excludeId);
  }
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

/**
 * Retrieves a personality by ID (1 to 50)
 */
export function getPersonalityById(id: number): Personality | undefined {
  return PERSONALITIES.find((p) => p.id === id);
}
