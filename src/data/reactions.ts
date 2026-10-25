import { DIFFICULTY_SETTINGS } from './difficulty.js';
import { calculateCauldron } from '../logic/brewing.js';
import type { Difficulty, Ingredient, Values } from '../types.js';

export interface Reaction {
  id: string;
  name: string;
  message: string;
  timePenalty?: number;
  lifeLoss?: number;
  clearCauldron?: boolean;
  isActive: (ingredients: readonly Ingredient[]) => boolean;
  apply: (values: Values) => Values;
}

function hasIngredients(ingredients: readonly Ingredient[], required: readonly string[]): boolean {
  return required.every((id) => ingredients.some((ingredient) => ingredient.id === id));
}

export const REACTIONS: readonly Reaction[] = [
  {
    id: 'bubbling',
    name: 'Bubbling',
    message: 'Magic Power +50%, 10 seconds lost.',
    timePenalty: 10_000,

    isActive: (ingredients) => hasIngredients(ingredients, ['fairy-dust', 'caustic-acid']),

    apply: (values) => ({
      ...values,
      magicPower: Math.round(values.magicPower * 1.5),
    }),
  },

  {
    id: 'solar-frost',
    name: 'Solar Frost',
    message: 'Temperature reset to 0 and Density increased by 20%.',

    isActive: (ingredients) => hasIngredients(ingredients, ['dragon-tears', 'frost-lotus']),

    apply: (values) => ({
      ...values,
      temperature: 0,
      density: Math.round(values.density * 1.2),
    }),
  },

  {
    id: 'volatile-mix',
    name: 'Volatile Mix',
    message: 'One life lost and the cauldron was cleared.',
    lifeLoss: 1,
    clearCauldron: true,

    isActive: (ingredients) =>
      hasIngredients(ingredients, ['phoenix-feather', 'essence-of-the-void']),

    apply: (values) => values,
  },
];

export function reactionsFor(difficulty: Difficulty): readonly Reaction[] {
  return REACTIONS.slice(0, DIFFICULTY_SETTINGS[difficulty].reactionCount);
}

export function newlyActiveReactions(
  before: readonly Ingredient[],
  after: readonly Ingredient[],
  difficulty: Difficulty,
): readonly Reaction[] {
  return reactionsFor(difficulty).filter(
    (reaction) => !reaction.isActive(before) && reaction.isActive(after),
  );
}

export function calculateReactionValues(
  ingredients: readonly Ingredient[],
  difficulty: Difficulty,
): Values {
  const baseValues = calculateCauldron(ingredients);

  return reactionsFor(difficulty)
    .filter((reaction) => reaction.isActive(ingredients))
    .reduce((values, reaction) => reaction.apply(values), baseValues);
}
