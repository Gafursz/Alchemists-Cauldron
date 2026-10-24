import type { Difficulty } from '../types.js';

export interface DifficultySettings {
  difficulty: Difficulty;
  ingredientCount: number;
  capacity: number;
  startTime: number;
  timeCap: number;
  timeBonus: number;
  lives: number;
  tolerance: number;
  scorePerBrew: number;
  reactionCount: number;
}

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  easy: {
    difficulty: 'easy',
    ingredientCount: 4,
    capacity: 4,
    startTime: 180_000,
    timeCap: 180_000,
    timeBonus: 15_000,
    lives: 5,
    tolerance: 12,
    scorePerBrew: 100,
    reactionCount: 0,
  },

  medium: {
    difficulty: 'medium',
    ingredientCount: 6,
    capacity: 4,
    startTime: 150_000,
    timeCap: 150_000,
    timeBonus: 10_000,
    lives: 3,
    tolerance: 8,
    scorePerBrew: 200,
    reactionCount: 2,
  },

  hard: {
    difficulty: 'hard',
    ingredientCount: 8,
    capacity: 5,
    startTime: 150_000,
    timeCap: 150_000,
    timeBonus: 5_000,
    lives: 3,
    tolerance: 5,
    scorePerBrew: 300,
    reactionCount: 3,
  },
};

export const DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard'];

export function isDifficulty(value: unknown): value is Difficulty {
  return value === 'easy' || value === 'medium' || value === 'hard';
}

export function difficultyName(difficulty: Difficulty): string {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

export const SETTINGS = DIFFICULTY_SETTINGS.medium;
