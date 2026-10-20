// Level 1 uses Medium only. See docs/IMPLEMENTATION.md for the time-cap ambiguity.
export const SETTINGS = {
  difficulty: 'medium',
  ingredientCount: 6,
  capacity: 4,
  startTime: 150_000,
  timeCap: 150_000,
  timeBonus: 10_000,
  lives: 3,
  tolerance: 8,
  scorePerBrew: 200,
} as const;
