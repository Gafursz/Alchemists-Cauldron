import type { Difficulty, LeaderboardEntry } from '../types.js';

export const LEADERBOARD_KEY = 'alchemists-cauldron:level-1:leaderboard';

const keyFor = (difficulty: Difficulty): string =>
  difficulty === 'medium' ? LEADERBOARD_KEY : `alchemists-cauldron:leaderboard:${difficulty}`;

export function validName(name: string): boolean {
  const value = name.trim();
  return /^[\p{L}\p{N} _-]+$/u.test(value) && value.length >= 2 && value.length <= 15;
}

function validEntry(value: unknown): value is LeaderboardEntry {
  if (!value || typeof value !== 'object') return false;

  const entry = value as Partial<LeaderboardEntry>;

  return (
    typeof entry.name === 'string' &&
    validName(entry.name) &&
    Number.isSafeInteger(entry.score) &&
    Number(entry.score) >= 0 &&
    typeof entry.date === 'number' &&
    Number.isFinite(entry.date)
  );
}

export function rankEntries(entries: readonly LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort((a, b) => b.score - a.score || a.date - b.date).slice(0, 10);
}

export function parseEntries(
  raw: string | null,
  difficulty: Difficulty = 'medium',
): LeaderboardEntry[] {
  if (!raw) return [];

  const data: unknown = JSON.parse(raw);

  if (
    !Array.isArray(data) ||
    !data.every(
      (entry) => validEntry(entry) && (!('difficulty' in entry) || entry.difficulty === difficulty),
    )
  ) {
    throw new Error('Invalid leaderboard data');
  }

  return rankEntries(data);
}

export function qualifies(entries: readonly LeaderboardEntry[], score: number): boolean {
  return entries.length < 10 || score > (entries[9]?.score ?? 0);
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const pad = (value: number): string => String(value).padStart(2, '0');

  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export class Leaderboard {
  entries: LeaderboardEntry[] = [];
  warning = '';

  constructor(readonly difficulty: Difficulty = 'medium') {
    try {
      this.entries = parseEntries(localStorage.getItem(keyFor(difficulty)), difficulty);
    } catch {
      this.warning = 'Saved scores could not be read.';
    }
  }

  private persist(): void {
    try {
      const entries = this.entries.map((entry) => ({
        ...entry,
        difficulty: this.difficulty,
      }));

      localStorage.setItem(keyFor(this.difficulty), JSON.stringify(entries));
      this.warning = '';
    } catch {
      this.warning = 'Browser storage is unavailable.';
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
