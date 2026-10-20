import { SETTINGS } from '../data/difficulty.js';
import { INGREDIENTS } from '../data/ingredients.js';
import { pickRecipe } from '../data/recipes.js';
import { calculateCauldron, checkBrew, createStock } from '../logic/brewing.js';
import { remainingTime } from '../logic/timer.js';
import type { GameState } from '../types.js';
function initialState(): GameState {
  return {
    status: 'menu',
    score: 0,
    timeLeft: 0,
    lives: 0,
    recipe: null,
    ingredients: [],
    stock: {},
    reason: null,
    feedback: 'A little curiosity. A touch of magic.',
    outcome: null,
  };
}
export class Game {
  state: GameState = initialState();
  private deadline = 0;
  constructor(
    private readonly changed: () => void,
    private readonly now = Date.now,
    private readonly random = Math.random,
  ) {}
  start(): void {
    this.state = {
      ...initialState(),
      status: 'playing',
      timeLeft: SETTINGS.startTime,
      lives: SETTINGS.lives,
      recipe: pickRecipe(SETTINGS.difficulty, this.random),
      stock: createStock(INGREDIENTS.slice(0, SETTINGS.ingredientCount), this.random),
      feedback: 'Choose an ingredient to begin your potion.',
    };
    this.deadline = this.now() + this.state.timeLeft;
    this.changed();
  }
  exit(): void {
    this.state = initialState();
    this.changed();
  }
  private sync(): void {
    if (this.state.status !== 'playing') return;
    this.state.timeLeft = remainingTime(this.deadline, this.now());
    this.checkEnd();
  }
  private checkEnd(): void {
    if (this.state.status !== 'playing') return;
    const reason =
      this.state.timeLeft <= 0
        ? 'Time is up'
        : this.state.lives <= 0
          ? 'No lives remaining'
          : this.state.ingredients.length === 0 &&
              Object.values(this.state.stock).every((stock) => stock === 0)
            ? 'Out of ingredients'
            : null;
    if (reason) {
      this.state.reason = reason;
      this.state.status = 'game-over';
    }
  }
  tick(): void {
    if (this.state.status !== 'playing') return;
    this.sync();
    this.changed();
  }
  add(id: string): void {
    this.sync();
    const ingredient = INGREDIENTS.slice(0, SETTINGS.ingredientCount).find(
      (item) => item.id === id,
    );
    if (
      this.state.status === 'playing' &&
      ingredient &&
      (this.state.stock[id] ?? 0) > 0 &&
      this.state.ingredients.length < SETTINGS.capacity
    ) {
      this.state.stock[id] = (this.state.stock[id] ?? 0) - 1;
      this.state.ingredients.push(ingredient);
      this.state.outcome = null;
      this.state.feedback =
        this.state.ingredients.length === SETTINGS.capacity
          ? 'Cauldron full. Time to brew!'
          : `${ingredient.name} added. Watch the target zones.`;
    }
    this.changed();
  }
  brew(): void {
    this.sync();
    if (this.state.status === 'playing' && this.state.recipe && this.state.ingredients.length > 0) {
      const success = checkBrew(
        calculateCauldron(this.state.ingredients),
        this.state.recipe,
        SETTINGS.tolerance,
      );
      this.state.outcome = success ? 'success' : 'failure';
      if (success) {
        this.state.score += SETTINGS.scorePerBrew;
        this.state.timeLeft = Math.min(SETTINGS.timeCap, this.state.timeLeft + SETTINGS.timeBonus);
        this.deadline = this.now() + this.state.timeLeft;
        this.state.recipe = pickRecipe(SETTINGS.difficulty, this.random);
        this.state.feedback = 'Beautifully brewed! +200 points. Time bonus applied.';
      } else {
        this.state.lives -= 1;
        this.state.feedback = 'Not quite the right mix. One life lost — try this recipe again.';
      }
      this.state.ingredients = [];
      this.checkEnd();
    }
    this.changed();
  }
  pause(): void {
    this.sync();
    if (this.state.status === 'playing') this.state.status = 'paused';
    this.changed();
  }
  resume(): void {
    if (this.state.status !== 'paused') return;
    this.deadline = this.now() + this.state.timeLeft;
    this.state.status = 'playing';
    this.changed();
  }
}
