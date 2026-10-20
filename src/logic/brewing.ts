import type { Ingredient, Range, Recipe, Values } from '../types.js';
export function calculateCauldron(ingredients: readonly Ingredient[]): Values {
  return ingredients.reduce(
    (values, ingredient) => ({
      temperature: values.temperature + ingredient.temperature,
      density: values.density + ingredient.density,
      magicPower: values.magicPower + ingredient.magicPower,
    }),
    { temperature: 0, density: 0, magicPower: 0 },
  );
}
export function inRange(value: number, range: Range, tolerance = 0): boolean {
  return value >= range.min - tolerance && value <= range.max + tolerance;
}
export function checkBrew(values: Values, recipe: Recipe, tolerance: number): boolean {
  return (
    inRange(values.temperature, recipe.temperature, tolerance) &&
    inRange(values.density, recipe.density, tolerance) &&
    inRange(values.magicPower, recipe.magicPower, tolerance)
  );
}
export function createStock(
  ingredients: readonly Ingredient[],
  random = Math.random,
): Record<string, number> {
  return Object.fromEntries(ingredients.map(({ id }) => [id, Math.floor(random() * 14) + 2]));
}
