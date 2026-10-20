import test from 'node:test';
import assert from 'node:assert/strict';
import { Game } from '../.test-build/state/game.js';
import { INGREDIENTS } from '../.test-build/data/ingredients.js';
import { RECIPES, pickRecipe } from '../.test-build/data/recipes.js';
import { SETTINGS } from '../.test-build/data/difficulty.js';
import { calculateCauldron, checkBrew, createStock } from '../.test-build/logic/brewing.js';
import { formatTime } from '../.test-build/logic/timer.js';
import {
  Leaderboard,
  parseEntries,
  rankEntries,
  qualifies,
  validName,
} from '../.test-build/storage/leaderboard.js';
function fixture() {
  let now = 0;
  let notifications = 0;
  const game = new Game(
    () => {
      notifications++;
    },
    () => now,
    () => 0,
  );
  return {
    game,
    advance: (ms) => {
      now += ms;
    },
    notifications: () => notifications,
  };
}
test('catalogues contain all prescribed entries and difficulty pools', () => {
  assert.equal(INGREDIENTS.length, 8);
  assert.equal(RECIPES.length, 20);
  assert.equal(RECIPES.filter((r) => r.difficulty === 'medium').length, 7);
  assert.equal(pickRecipe('hard', () => 0).id, 'phoenix-pulse');
  assert.equal(pickRecipe('easy', () => 0.999).id, 'snow-dust');
});
test('stock includes both random endpoints with independent draws', () => {
  let calls = 0;
  const stock = createStock(INGREDIENTS, () => (calls++ % 2 === 0 ? 0 : 0.99999));
  assert.equal(stock['dragon-tears'], 2);
  assert.equal(stock['fairy-dust'], 15);
  assert.equal(calls, 8);
});
test('cauldron sums support repeated ingredients and negative totals', () => {
  assert.deepEqual(calculateCauldron([INGREDIENTS[5], INGREDIENTS[5]]), {
    temperature: -40,
    density: -20,
    magicPower: 80,
  });
});
test('brew accepts inclusive tolerance boundaries and rejects any failed parameter', () => {
  const recipe = pickRecipe('medium', () => 0);
  assert.equal(checkBrew({ temperature: 9, density: 10, magicPower: 21 }, recipe, 8), true);
  assert.equal(checkBrew({ temperature: 35, density: 36, magicPower: 47 }, recipe, 8), true);
  assert.equal(checkBrew({ temperature: 36, density: 36, magicPower: 47 }, recipe, 8), false);
});
test('menu is empty; starting creates only six shelf types with Medium rules', () => {
  const { game } = fixture();
  assert.equal(game.state.status, 'menu');
  assert.equal(game.state.timeLeft, 0);
  assert.equal(game.state.lives, 0);
  assert.deepEqual(game.state.stock, {});
  game.start();
  assert.equal(game.state.timeLeft, 150000);
  assert.equal(game.state.lives, 3);
  assert.equal(Object.keys(game.state.stock).length, 6);
  assert.equal(game.state.recipe.difficulty, 'medium');
});
test('adding consumes stock, preserves order, rejects empty, unknown and unavailable ingredients', () => {
  const { game } = fixture();
  game.start();
  game.add('dragon-tears');
  game.add('fairy-dust');
  game.add('dragon-tears');
  game.add('dragon-tears');
  game.add('phoenix-feather');
  game.add('unknown');
  assert.deepEqual(
    game.state.ingredients.map((i) => i.id),
    ['dragon-tears', 'fairy-dust', 'dragon-tears'],
  );
  assert.equal(game.state.stock['dragon-tears'], 0);
});
test('capacity blocks fifth addition without spending stock', () => {
  const { game } = fixture();
  game.start();
  ['dragon-tears', 'fairy-dust', 'frost-lotus', 'mandrake-root'].forEach((id) => game.add(id));
  game.add('caustic-acid');
  assert.equal(game.state.ingredients.length, 4);
  assert.equal(game.state.stock['caustic-acid'], 2);
});
test('single-ingredient brew is allowed; success awards score without refund and caps time', () => {
  const { game, advance } = fixture();
  game.start();
  advance(2000);
  game.add('caustic-acid');
  game.brew();
  assert.equal(game.state.score, 200);
  assert.equal(game.state.timeLeft, SETTINGS.timeCap);
  assert.equal(game.state.stock['caustic-acid'], 1);
  assert.equal(game.state.ingredients.length, 0);
  assert.equal(game.state.lives, 3);
});
test('failure clears mixture, spends stock and keeps the same recipe', () => {
  const { game } = fixture();
  game.start();
  const recipe = game.state.recipe;
  game.add('dragon-tears');
  game.brew();
  assert.equal(game.state.lives, 2);
  assert.equal(game.state.ingredients.length, 0);
  assert.equal(game.state.recipe, recipe);
  assert.equal(game.state.stock['dragon-tears'], 1);
  game.brew();
  assert.equal(game.state.lives, 2);
});
test('pause blocks actions and resume uses frozen remaining duration', () => {
  const { game, advance } = fixture();
  game.start();
  advance(2250);
  game.pause();
  const paused = globalThis.structuredClone(game.state);
  advance(90000);
  game.add('fairy-dust');
  game.brew();
  game.tick();
  assert.deepEqual(game.state, paused);
  game.resume();
  advance(500);
  game.tick();
  assert.equal(game.state.timeLeft, 147250);
});
test('expired deadline rejects a last-second brew instead of reviving the run', () => {
  const { game, advance } = fixture();
  game.start();
  game.add('caustic-acid');
  advance(150001);
  game.brew();
  assert.equal(game.state.status, 'game-over');
  assert.equal(game.state.score, 0);
  assert.equal(game.state.reason, 'Time is up');
});
test('empty shelf does not end game until cauldron is empty', () => {
  const { game } = fixture();
  game.start();
  game.add('caustic-acid');
  for (const id of Object.keys(game.state.stock)) game.state.stock[id] = 0;
  game.tick();
  assert.equal(game.state.status, 'playing');
  game.brew();
  assert.equal(game.state.reason, 'Out of ingredients');
  assert.equal(game.state.score, 200);
});
test('zero lives ends a run exactly once; ticking after ending does not notify again', () => {
  const { game, notifications } = fixture();
  game.start();
  ['dragon-tears', 'dragon-tears', 'essence-of-the-void'].forEach((id) => {
    game.add(id);
    game.brew();
  });
  assert.equal(game.state.reason, 'No lives remaining');
  const count = notifications();
  game.tick();
  game.tick();
  assert.equal(notifications(), count);
});
test('new game resets finished run; exit restores empty menu', () => {
  const { game } = fixture();
  game.start();
  game.add('caustic-acid');
  game.brew();
  game.start();
  assert.equal(game.state.score, 0);
  assert.equal(game.state.stock['caustic-acid'], 2);
  game.exit();
  assert.equal(game.state.recipe, null);
  assert.equal(game.state.lives, 0);
});
test('leaderboard validates JSON shape, finite scores and names', () => {
  for (const raw of [
    '{',
    '{}',
    '[null]',
    '[{"name":"ok","score":-1,"date":0}]',
    '[{"name":"<img>","score":20,"date":0}]',
  ]) {
    assert.throws(() => parseEntries(raw));
  }
  assert.deepEqual(parseEntries(null), []);
  assert.equal(validName(' Gafursz '), true);
  assert.equal(validName('Али 2'), true);
  assert.equal(validName(' '), false);
  assert.equal(validName('a'), false);
  assert.equal(validName('a'.repeat(16)), false);
  assert.equal(validName('Hi!'), false);
});
test('ties favor earlier results; tenth-place ties do not qualify', () => {
  const entries = Array.from({ length: 12 }, (_, i) => ({ name: `Name${i}`, score: 200, date: i }));
  const ranked = rankEntries(entries.toReversed());
  assert.equal(ranked.length, 10);
  assert.equal(ranked[0].name, 'Name0');
  assert.equal(qualifies(ranked, 200), false);
  assert.equal(qualifies(ranked, 400), true);
});
test('unavailable storage does not crash and preserves scores in memory', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      throw new Error('Denied');
    },
  });
  try {
    const board = new Leaderboard();
    assert.ok(board.warning);
    assert.equal(board.add('Gafursz', 400, 0), true);
    assert.equal(board.entries.length, 1);
    board.clear();
    assert.deepEqual(board.entries, []);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor);
    else delete globalThis.localStorage;
  }
});
test('timer formatting never displays zero prematurely or negative time', () => {
  assert.equal(formatTime(150000), '02:30');
  assert.equal(formatTime(1), '00:01');
  assert.equal(formatTime(-1), '00:00');
});

test('success below the cap adds exactly ten seconds to elapsed-time-derived duration', () => {
  const { game, advance } = fixture();
  game.start();
  advance(60000);
  game.add('caustic-acid');
  game.brew();
  assert.equal(game.state.timeLeft, 100000);
  advance(1250);
  game.tick();
  assert.equal(game.state.timeLeft, 98750);
});
test('pausing after the deadline ends the run instead of creating an expired paused game', () => {
  const { game, advance } = fixture();
  game.start();
  advance(150000);
  game.pause();
  assert.equal(game.state.status, 'game-over');
  assert.equal(game.state.reason, 'Time is up');
  game.resume();
  assert.equal(game.state.status, 'game-over');
});
test('equal score and identical timestamp preserve insertion order', () => {
  const entries = [
    { name: 'First', score: 200, date: 1000 },
    { name: 'Second', score: 200, date: 1000 },
    { name: 'Third', score: 200, date: 1000 },
  ];
  assert.deepEqual(
    rankEntries(entries).map((entry) => entry.name),
    ['First', 'Second', 'Third'],
  );
});
test('valid stored results round-trip and mixed invalid lists are rejected', () => {
  const entries = [{ name: 'Gafursz', score: 600, date: 1792230000000 }];
  assert.deepEqual(parseEntries(JSON.stringify(entries)), entries);
  assert.throws(() =>
    parseEntries(JSON.stringify([...entries, { name: 'Invalid', score: '600', date: 0 }])),
  );
});
