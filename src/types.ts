export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'menu' | 'playing' | 'paused' | 'game-over';
export type Parameter = 'temperature' | 'density' | 'magicPower';
export interface Values {
  temperature: number;
  density: number;
  magicPower: number;
}
export interface Ingredient extends Values {
  id: string;
  name: string;
  color: string;
}
export interface Range {
  min: number;
  max: number;
}
export interface Recipe {
  id: string;
  name: string;
  difficulty: Difficulty;
  temperature: Range;
  density: Range;
  magicPower: Range;
}
export type EndReason = 'Time is up' | 'No lives remaining' | 'Out of ingredients';
export interface GameState {
  status: GameStatus;
  difficulty: Difficulty;
  score: number;
  timeLeft: number;
  lives: number;
  recipe: Recipe | null;
  ingredients: Ingredient[];
  stock: Record<string, number>;
  reason: EndReason | null;
  feedback: string;
  outcome: 'success' | 'failure' | null;
}
export interface LeaderboardEntry {
  name: string;
  score: number;
  date: number;
}
export interface SavedGame {
  version: 1;
  difficulty: Difficulty;
  score: number;
  timeLeft: number;
  lives: number;
  activeRecipe: Recipe;
  cauldronIngredients: Ingredient[];
  shelfStock: Record<string, number>;
  status: 'playing' | 'paused';
}
