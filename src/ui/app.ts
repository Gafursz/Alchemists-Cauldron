import { SETTINGS } from '../data/difficulty.js';
import { INGREDIENTS } from '../data/ingredients.js';
import { calculateCauldron } from '../logic/brewing.js';
import { formatTime } from '../logic/timer.js';
import type { GameState } from '../types.js';
import { barsMarkup, updateBars } from './bars.js';
import { cauldronArt, ingredientArt, logoArt } from './art.js';
import { element, signed } from './dom.js';
export function renderApp(root: HTMLElement): void {
  root.innerHTML = `<div class="app-shell">
    <header class="topbar"><a class="brand" href="#" aria-label="Alchemist's Cauldron home" data-action="menu">${logoArt}<span>Alchemist’s <strong>Cauldron</strong></span></a>
      <div class="run-status"><div class="score-box"><span class="status-icon" aria-hidden="true">✧</span><div><span class="small-label">Score</span><output id="score">0</output></div></div>
      <div class="time-box"><span class="status-icon clock-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 6v6l4 2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></span><div><span class="small-label">Time</span><output id="time">00:00</output></div><div class="time-track"><span id="time-fill"></span></div></div>
      <div id="lives" class="lives" aria-label="No active game"></div></div>
      <nav class="toolbar" aria-label="Game controls"><button class="icon-button" data-action="help"><span aria-hidden="true">?</span>Help</button><button class="icon-button" data-action="menu"><span aria-hidden="true">☰</span>Menu</button><button class="icon-button" id="pause" data-action="pause" hidden><span aria-hidden="true">Ⅱ</span>Pause</button></nav>
    </header>
    <div class="page-intro"><div><p class="eyebrow">THE MIDNIGHT POTION LAB</p><h1>A little magic starts here.</h1></div><span class="difficulty-tag"><span></span> Medium <i>·</i> Level 1</span></div>
    <main id="play-field" class="game-grid">
      <section class="shelf-panel panel" aria-labelledby="shelf-title"><div class="panel-heading"><h2 id="shelf-title">Your ingredients</h2><span class="muted">THE SHELF</span></div>
        <div id="shelf" class="shelf-grid"></div><p id="shelf-note" class="panel-note">Your shelf fills when a new game begins.</p></section>
      <section class="brew-panel" aria-label="Cauldron and brewing"><div class="scene"><div class="arch"><span class="moon"></span><span class="star star-one">✦</span><span class="star star-two">✧</span><span class="star star-three">·</span><div class="window-line"></div></div><div class="scene-halo"></div><div class="candle candle-one"></div><div class="candle candle-two"></div><div id="pot" class="pot">${cauldronArt}</div><span class="scene-spark spark-one">✧</span><span class="scene-spark spark-two">✦</span></div>
        <div class="mixture-wrap"><p id="mixture-label" class="mixture-label">Your cauldron is waiting</p><ol id="mixture" class="mixture" aria-label="Ingredients in addition order"></ol></div>
        <button id="brew" class="primary brew-button" data-action="start"><span aria-hidden="true">✧</span> <span id="brew-text">Start Game</span></button>
        <p id="feedback" class="feedback" role="status" aria-live="polite">A little curiosity. A touch of magic.</p>
      </section>
      <aside class="recipe-column"><section class="recipe-panel panel" aria-labelledby="recipe-name"><div class="panel-heading"><h2>Recipe</h2><span class="muted">YOUR NEXT POTION</span></div><div class="recipe-hero"><div><p class="eyebrow">BREW SOMETHING BRILLIANT</p><h2 id="recipe-name">A mystery awaits</h2></div><div class="recipe-bottle">${logoArt}</div></div><div id="recipe-ranges" class="recipe-ranges"><div><span>Temperature</span><strong>—</strong></div><div><span>Density</span><strong>—</strong></div><div><span>Magic Power</span><strong>—</strong></div></div><p id="counter" class="counter">Ingredients: 0 / 4</p></section>
      <section class="parameters-panel panel"><div class="panel-heading"><h2>Current parameters</h2><span aria-hidden="true">◈</span></div>${barsMarkup()}<p class="tolerance-note"><span class="legend-dot"></span> Green zone = recipe target<br><span class="tolerance-indent">Brew accepts a tolerance of ±8.</span></p></section></aside>
    </main><footer class="footer"><span>Made with a little magic <span aria-hidden="true">✦</span> Gafursz</span><button class="text-button" data-action="leaderboard">♜ Leaderboard</button><span>Vanilla TypeScript · RS School</span></footer>
    <dialog id="game-dialog" aria-labelledby="dialog-title"><div id="dialog-content"></div></dialog>
  </div>`;
  element('#shelf').innerHTML = INGREDIENTS.slice(0, SETTINGS.ingredientCount)
    .map(
      (
        ingredient,
      ) => `<button class="ingredient-card" data-ingredient="${ingredient.id}" disabled style="--ingredient-color:${ingredient.color}">
    <span class="stock-badge" aria-hidden="true"><small>Stock</small><b>0</b></span><span class="ingredient-art">${ingredientArt(ingredient.id)}</span><span class="ingredient-name">${ingredient.name}</span>
    <span class="ingredient-stats"><span><small>T</small>${signed(ingredient.temperature)}</span><span><small>D</small>${signed(ingredient.density)}</span><span><small>M</small>${signed(ingredient.magicPower)}</span></span></button>`,
    )
    .join('');
}
let lastSignature = '';
let lastOutcome: GameState['outcome'] = null;
export function updateApp(state: GameState): void {
  element('#score').textContent = String(state.score);
  element('#time').textContent = formatTime(state.timeLeft);
  element('#time-fill').style.width = `${(state.timeLeft / SETTINGS.startTime) * 100}%`;
  element('.time-box').classList.toggle(
    'urgent',
    state.timeLeft > 0 && state.timeLeft < 15_000 && state.status === 'playing',
  );
  const signature = JSON.stringify([
    state.status,
    state.score,
    state.lives,
    state.recipe?.id,
    state.ingredients.map(({ id }) => id),
    state.stock,
    state.feedback,
  ]);
  if (signature === lastSignature) return;
  lastSignature = signature;
  const menu = state.status === 'menu';
  const playing = state.status === 'playing';
  const field = element('#play-field');
  field.classList.toggle('obscured', state.status === 'paused');
  field.inert = state.status === 'paused' || state.status === 'game-over';
  element('.app-shell').classList.toggle('is-menu', menu);
  element('#pause').hidden = !playing;
  element('#lives').innerHTML = menu
    ? '<span class="small-label">Ready to brew?</span>'
    : Array.from(
        { length: SETTINGS.lives },
        (_, index) =>
          `<span aria-hidden="true" class="heart ${index >= state.lives ? 'lost' : ''}">♥</span>`,
      ).join('');
  element('#lives').setAttribute(
    'aria-label',
    menu ? 'No active game' : `${state.lives} lives remaining`,
  );
  INGREDIENTS.slice(0, SETTINGS.ingredientCount).forEach((ingredient) => {
    const button = element<HTMLButtonElement>(`[data-ingredient="${ingredient.id}"]`);
    const stock = state.stock[ingredient.id] ?? 0;
    button.disabled = !playing || stock === 0 || state.ingredients.length >= SETTINGS.capacity;
    button.classList.toggle('empty', stock === 0);
    button.classList.toggle('unstarted', menu);
    element('.stock-badge b', button).textContent = String(stock);
    button.setAttribute(
      'aria-label',
      `${ingredient.name}. Temperature ${signed(ingredient.temperature)}, Density ${signed(ingredient.density)}, Magic Power ${signed(ingredient.magicPower)}. Stock ${stock}.`,
    );
  });
  element('#shelf-note').textContent = menu
    ? 'Your shelf fills when a new game begins.'
    : 'Each addition uses one portion. Ingredients are not refunded.';
  element('#recipe-name').textContent = state.recipe?.name ?? 'A mystery awaits';
  const ranges = element('#recipe-ranges').querySelectorAll('strong');
  (['temperature', 'density', 'magicPower'] as const).forEach((key, index) => {
    const range = state.recipe?.[key];
    const label = ranges[index];
    if (label) label.textContent = range ? `${range.min} – ${range.max}` : '—';
  });
  const counter = element('#counter');
  counter.textContent = `Ingredients: ${state.ingredients.length} / ${SETTINGS.capacity}`;
  counter.classList.toggle('full', state.ingredients.length === SETTINGS.capacity);
  element('#mixture-label').textContent = menu
    ? 'Your cauldron is waiting'
    : state.ingredients.length
      ? 'YOUR MIXTURE · ADDED IN ORDER'
      : 'Add a little something magical';
  element('#mixture').innerHTML = Array.from({ length: SETTINGS.capacity }, (_, index) => {
    const ingredient = state.ingredients[index];
    return ingredient
      ? `<li class="mixture-item"><span class="slot-number">${index + 1}</span>${ingredientArt(ingredient.id)}<span>${ingredient.name}</span></li>`
      : `<li class="mixture-slot" aria-label="Empty slot ${index + 1}"><span aria-hidden="true">✧</span></li>`;
  }).join('');
  const brew = element<HTMLButtonElement>('#brew');
  brew.dataset.action = menu ? 'start' : 'brew';
  brew.disabled = !menu && (!playing || state.ingredients.length === 0);
  element('#brew-text').textContent = menu ? 'Start Game' : 'Brew Potion';
  const feedback = element('#feedback');
  if (feedback.textContent !== state.feedback) feedback.textContent = state.feedback;
  feedback.dataset.outcome = state.outcome ?? '';
  const pot = element('#pot');
  pot.classList.toggle('has-ingredients', state.ingredients.length > 0);
  if (state.outcome !== lastOutcome) {
    pot.classList.remove('brew-success', 'brew-failure');
    if (state.outcome) {
      void pot.offsetWidth;
      pot.classList.add(`brew-${state.outcome}`);
    }
    lastOutcome = state.outcome;
  }
  updateBars(calculateCauldron(state.ingredients), state.recipe);
}
