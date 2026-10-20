import type { LeaderboardEntry } from '../types.js';
export const LEADERBOARD_KEY = 'alchemists-cauldron:level-1:leaderboard';
export function validName(name: string): boolean {
  const trimmed = name.trim();
  return (
    /^[\p{L}\p{N} _-]+$/u.test(trimmed) && [...trimmed].length >= 2 && [...trimmed].length <= 15
  );
}
function validEntry(value: unknown): value is LeaderboardEntry {
  if (typeof value !== 'object' || value === null) return false;
  return (
    'name' in value &&
    typeof value.name === 'string' &&
    validName(value.name) &&
    'score' in value &&
    typeof value.score === 'number' &&
    Number.isSafeInteger(value.score) &&
    value.score >= 0 &&
    'date' in value &&
    typeof value.date === 'number' &&
    Number.isFinite(value.date) &&
    value.date >= 0 &&
    !Number.isNaN(new Date(value.date).getTime())
  );
}
export function rankEntries(entries: readonly LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort((a, b) => b.score - a.score || a.date - b.date).slice(0, 10);
}
export function parseEntries(raw: string | null): LeaderboardEntry[] {
  if (raw === null) return [];
  const value: unknown = JSON.parse(raw);
  if (!Array.isArray(value) || !value.every(validEntry))
    throw new Error('Invalid leaderboard data');
  return rankEntries(value);
}
export function qualifies(entries: readonly LeaderboardEntry[], score: number): boolean {
  return entries.length < 10 || score > (entries[9]?.score ?? 0);
}
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const pad = (value: number): string => value.toString().padStart(2, '0');
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
export class Leaderboard {
  entries: LeaderboardEntry[] = [];
  warning = '';
  constructor() {
    try {
      this.entries = parseEntries(localStorage.getItem(LEADERBOARD_KEY));
    } catch {
      this.warning =
        'Saved scores could not be read. You can still play and keep scores in this session.';
    }
  }
  private persist(): void {
    try {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(this.entries));
      this.warning = '';
    } catch {
      this.warning =
        'Browser storage is unavailable. These scores will last only for this session.';
    }
  }
  add(name: string, score: number, date: number): boolean {
    if (!validName(name) || !qualifies(this.entries, score)) return false;
    this.entries = rankEntries([...this.entries, { name: name.trim(), score, date }]);
    this.persist();
    return true;
  }
  clear(): void {
    this.entries = [];
    this.persist();
  }
}
