import type { Difficulty, Recipe } from '../types.js';
type Row = readonly [string, Difficulty, number, number, number, number, number, number];
const rows: readonly Row[] = [
  ['Moon Mist', 'easy', 32, 42, 12, 22, 17, 27],
  ['Root Bloom', 'easy', 2, 12, 24, 34, 15, 25],
  ['Frost Steam', 'easy', 2, 12, 7, 17, 19, 29],
  ['Quiet Swirl', 'easy', -28, -18, 19, 29, 17, 27],
  ['Bright Dew', 'easy', 27, 37, 32, 42, 25, 35],
  ['Snow Dust', 'easy', -16, -6, 28, 38, 29, 39],
  ['Acid Spark', 'medium', 17, 27, 18, 28, 29, 39],
  ['Void Ember', 'medium', 0, 10, 0, 10, 45, 55],
  ['Heavy Acid', 'medium', 0, 10, 29, 39, 25, 35],
  ['Frost Acid', 'medium', -13, -3, 13, 23, 31, 41],
  ['Dusty Void', 'medium', -13, -3, 0, 10, 47, 57],
  ['Dragon Void', 'medium', 25, 35, 1, 11, 55, 65],
  ['Rooted Night', 'medium', -18, -8, 14, 24, 55, 65],
  ['Phoenix Pulse', 'hard', 57, 67, 0, 10, 37, 47],
  ['Slime Crown', 'hard', -5, 5, 45, 55, 3, 13],
  ['Void Flame', 'hard', 25, 35, 0, 10, 60, 70],
  ['Acid Bog', 'hard', 10, 20, 39, 49, 17, 27],
  ['Frozen Ash', 'hard', 27, 37, 0, 10, 39, 49],
  ['Triple Eclipse', 'hard', -20, -10, 19, 29, 60, 70],
  ['Ember Soup', 'hard', 62, 72, 24, 34, 37, 47],
];
export const RECIPES: readonly Recipe[] = rows.map(
  ([name, difficulty, t0, t1, d0, d1, m0, m1]) => ({
    id: name.toLowerCase().replaceAll(' ', '-'),
    name,
    difficulty,
    temperature: { min: t0, max: t1 },
    density: { min: d0, max: d1 },
    magicPower: { min: m0, max: m1 },
  }),
);
export function pickRecipe(difficulty: Difficulty, random = Math.random): Recipe {
  const pool = RECIPES.filter((recipe) => recipe.difficulty === difficulty);
  const recipe = pool[Math.floor(random() * pool.length)];
  if (!recipe) throw new Error('Recipe pool is empty or random source is invalid');
  return recipe;
}
