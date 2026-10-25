import { DIFFICULTY_SETTINGS, isDifficulty } from '../data/difficulty.js';
import { INGREDIENTS } from '../data/ingredients.js';
import { RECIPES } from '../data/recipes.js';
import type { Difficulty, GameState, SavedGame } from '../types.js';

export const SAVE_KEY = 'alchemists-cauldron:save:v1';
export const DIFFICULTY_KEY = 'alchemists-cauldron:difficulty';

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function integer(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= min && value <= max;
}

export function parseSave(raw: string | null): SavedGame | null {
  if (!raw) return null;

  const value: unknown = JSON.parse(raw);

  if (!object(value) || value.version !== 1 || !isDifficulty(value.difficulty)) return null;

  const rules = DIFFICULTY_SETTINGS[value.difficulty];

  if (
    (value.status !== 'playing' && value.status !== 'paused') ||
    !integer(value.score, 0, Number.MAX_SAFE_INTEGER) ||
    !integer(value.timeLeft, 1, rules.startTime) ||
    !integer(value.lives, 1, rules.lives)
  ) {
    return null;
  }

  const savedRecipe = value.activeRecipe;

  if (!object(savedRecipe)) return null;

  const recipe = RECIPES.find(
    (item) => item.id === savedRecipe.id && item.difficulty === value.difficulty,
  );

  if (!recipe) return null;

  const available = INGREDIENTS.slice(0, rules.ingredientCount);
  const stock = value.shelfStock;

  if (
    !object(stock) ||
    Object.keys(stock).length !== available.length ||
    !available.every((ingredient) => integer(stock[ingredient.id], 0, 15))
  ) {
    return null;
  }

  if (
    !Array.isArray(value.cauldronIngredients) ||
    value.cauldronIngredients.length > rules.capacity
  ) {
    return null;
  }

  const ingredients = [];

  for (const item of value.cauldronIngredients) {
    if (!object(item)) return null;

    const ingredient = available.find((availableItem) => availableItem.id === item.id);

    if (!ingredient) return null;

    ingredients.push(ingredient);
  }

  if (!ingredients.length && Object.values(stock).every((count) => count === 0)) return null;

  return {
    version: 1,
    difficulty: value.difficulty,
    status: value.status,
    score: value.score,
    timeLeft: value.timeLeft,
    lives: value.lives,
    activeRecipe: structuredClone(recipe),
    cauldronIngredients: structuredClone(ingredients),
    shelfStock: Object.fromEntries(
      available.map((ingredient) => [ingredient.id, Number(stock[ingredient.id])]),
    ),
  };
}

function snapshot(state: GameState): SavedGame | null {
  if ((state.status !== 'playing' && state.status !== 'paused') || !state.recipe) return null;

  return {
    version: 1,
    difficulty: state.difficulty,
    status: state.status,
    score: state.score,
    timeLeft: Math.ceil(state.timeLeft),
    lives: state.lives,
    activeRecipe: structuredClone(state.recipe),
    cauldronIngredients: structuredClone(state.ingredients),
    shelfStock: { ...state.stock },
  };
}

export class GameSave {
  current: SavedGame | null = null;
  warning = '';
  difficulty: Difficulty = 'medium';

  constructor() {
    try {
      const difficulty = localStorage.getItem(DIFFICULTY_KEY);

      if (isDifficulty(difficulty)) this.difficulty = difficulty;

      const raw = localStorage.getItem(SAVE_KEY);

      try {
        this.current = parseSave(raw);
      } catch {
        this.current = null;
      }

      if (raw && !this.current) {
        localStorage.removeItem(SAVE_KEY);
        this.warning = 'Invalid saved game was removed.';
      }
    } catch {
      this.warning = 'Browser storage is unavailable.';
    }
  }

  choose(difficulty: Difficulty): void {
    this.difficulty = difficulty;

    try {
      localStorage.setItem(DIFFICULTY_KEY, difficulty);
    } catch {
      this.warning = 'Browser storage is unavailable.';
    }
  }

  write(state: GameState): void {
    const saved = snapshot(state);

    if (!saved) return;

    this.current = saved;

    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(saved));
      this.warning = '';
    } catch {
      this.warning = 'Browser storage is unavailable.';
    }
  }

  clear(): void {
    this.current = null;

    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {
      this.warning = 'Browser storage is unavailable.';
    }
  }
}
