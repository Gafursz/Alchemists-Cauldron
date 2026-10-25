import { DIFFICULTIES, DIFFICULTY_SETTINGS, difficultyName } from '../data/difficulty.js';
import type { GameState } from '../types.js';
import { formatDate, qualifies } from '../storage/leaderboard.js';
import type { Leaderboard } from '../storage/leaderboard.js';
import { escapeHtml } from './dom.js';
export type DialogPage = 'menu' | 'help' | 'pause' | 'game-over' | 'leaderboard' | 'clear';
const heading = (eyebrow: string, title: string): string =>
  `<p class="eyebrow">${eyebrow}</p><h2 id="dialog-title">${title}</h2>`;
export function dialogMarkup(
  page: DialogPage,
  state: GameState,
  board: Leaderboard,
  submitted: boolean,
  canContinue = false,
): string {
  const settings = DIFFICULTY_SETTINGS[state.difficulty];

  const back = '<button class="secondary" data-action="back">Back</button>';
  if (page === 'pause')
    return `${heading('TAKE YOUR TIME', 'A moment of stillness.')}<p>Your potion can wait. The clock is paused and your ingredients are safe.</p><div class="dialog-actions"><button class="primary" data-action="resume" autofocus>Resume Game</button><button class="secondary" data-action="exit">Exit to Menu</button></div><p class="fine-print">Exiting ends this run and returns you to the main menu.</p>`;
  if (page === 'help')
    return `${heading('A SMALL GUIDE TO BIG MAGIC', 'How to brew')}
    <ol class="help-list">
      <li>
        <strong>Read your recipe.</strong>
        Match Temperature, Density and Magic Power.
        The bright green zones show the exact targets.
      </li>

      <li>
        <strong>Add ingredients.</strong>
        Click or drag a card. Hover to see its T, D and M effects.
        Each addition spends one portion.
      </li>

      <li>
        <strong>Watch the mixture.</strong>
        Add up to ${settings.capacity} ingredients.
        Brew accepts ±${settings.tolerance} beyond each target range.
      </li>

      <li>
        <strong>Brew your potion.</strong>
        Success earns ${settings.scorePerBrew} points and up to
        ${settings.timeBonus / 1000} seconds.
        Failure costs one life.
      </li>

      <li>
  <strong>Watch for reactions.</strong>
  Medium has 2 possible reactions and Hard has 3.
  Pour Out clears the cauldron for 10 seconds without losing a life.
</li>

      <li>
        <strong>Keep the magic alive.</strong>
        ${difficultyName(state.difficulty)} begins with
        ${settings.startTime / 1000} seconds and
        ${settings.lives} lives.
      </li>
    </ol>

    <p class="fine-print">
      Difficulty can only be changed from the menu before a run begins.
      Pause freezes the clock.
    </p>

    <div class="dialog-actions">${back}</div>`;
  if (page === 'menu') {
    const difficultyButtons = DIFFICULTIES.map((difficulty) => {
      const optionSettings = DIFFICULTY_SETTINGS[difficulty];
      const selected = difficulty === state.difficulty;

      return `
      <button
        class="secondary difficulty-option${selected ? ' selected' : ''}"
        data-difficulty="${difficulty}"
        aria-pressed="${selected}"
      >
        <strong>${difficultyName(difficulty)}</strong>
        <span>
          ${optionSettings.ingredientCount} ingredients ·
          ${optionSettings.lives} lives ·
          ${optionSettings.startTime / 1000}s ·
          ±${optionSettings.tolerance}
        </span>
      </button>
    `;
    }).join('');

    const continueButton = canContinue
      ? '<button class="primary" data-action="continue">Continue Game</button>'
      : '';

    return `
    ${heading('THE MIDNIGHT POTION LAB', 'Welcome, alchemist.')}

    <p>
      Turn a handful of curious ingredients into something extraordinary.
    </p>

    <div class="menu-rule">
      <span>
        Level 3 · ${difficultyName(state.difficulty)}
      </span>

      <span>
        ${settings.ingredientCount} ingredients ·
        ${settings.lives} lives ·
        ${settings.startTime / 1000}s
      </span>
    </div>

    <div class="difficulty-picker" aria-label="Choose difficulty">
      ${difficultyButtons}
    </div>



    <div class="dialog-actions vertical">
  ${continueButton}

  <button class="primary" data-action="start">
    Start New Game
  </button>

      <button class="secondary" data-action="leaderboard">
        Leaderboard
      </button>

      <button class="secondary" data-action="help">
        How to Play
      </button>

      <button class="text-button" data-action="close">
        Back to the lab
      </button>
    </div>
  `;
  }
  if (page === 'game-over') {
    const entry =
      !submitted && qualifies(board.entries, state.score)
        ? `<form id="score-form" novalidate><label for="player-name">A place in the Top 10. Your name?</label><div class="name-row"><input id="player-name" name="playerName" autocomplete="nickname" placeholder="Your alchemist name" aria-describedby="name-hint name-error" required><button class="secondary" type="submit">Save score</button></div><p id="name-hint" class="fine-print">2–15 characters: letters, digits, spaces, _ or -.</p><p id="name-error" class="form-error" role="alert"></p></form>`
        : `<p class="saved-note">${submitted ? 'Your score has been added to the leaderboard.' : 'Keep experimenting — the Top 10 awaits.'}</p>`;
    return `${heading('EVERY POTION TEACHES SOMETHING', 'Game over')}<p>${state.reason ?? 'Run finished'}</p><div class="final-score"><span>FINAL SCORE</span><strong>${state.score}</strong></div>${entry}<p class="storage-warning">${escapeHtml(board.warning)}</p><div class="dialog-actions"><button class="primary" data-action="start">Play again</button><button class="secondary" data-action="leaderboard">Leaderboard</button><button class="text-button" data-action="exit">Exit to Menu</button></div>`;
  }
  if (page === 'clear')
    return `${heading('A FRESH PAGE', 'Clear the leaderboard?')}<p>This removes all saved scores from this browser. It cannot be undone.</p><div class="dialog-actions"><button class="secondary" data-action="cancel-clear" autofocus>Keep scores</button><button class="danger" data-action="confirm-clear">Clear Leaderboard</button></div>`;
  const rows = board.entries
    .map(
      (entry, index) =>
        `<tr>
        <td>${String(index + 1).padStart(2, '0')}</td>
        <td>${escapeHtml(entry.name)}</td>
        <td>${difficultyName(state.difficulty)}</td>
        <td>${entry.score}</td>
        <td>${formatDate(entry.date)}</td>
      </tr>`,
    )
    .join('');

  return `${heading('THE FINEST IN THE LAB', 'Leaderboard')}
  <p>
    Top 10 · ${difficultyName(state.difficulty)} · Earlier results win ties.
  </p>

  <div class="table-scroll">
    <table>
      <caption class="sr-only">
        Top ten ${difficultyName(state.difficulty)} scores
      </caption>

      <thead>
        <tr>
          <th scope="col">Rank</th>
          <th scope="col">Name</th>
          <th scope="col">Difficulty</th>
          <th scope="col">Score</th>
          <th scope="col">Date</th>
        </tr>
      </thead>

      <tbody>
        ${
          rows ||
          `<tr>
            <td colspan="5" class="empty-table">
              No potions in the history books yet.<br>
              Your first adventure starts here.
            </td>
          </tr>`
        }
      </tbody>
    </table>
  </div>

  <p class="storage-warning">
    ${escapeHtml(board.warning)}
  </p>

  <div class="dialog-actions">
    ${back}

    <button
      class="text-button"
      data-action="clear"
      ${board.entries.length === 0 ? 'disabled' : ''}
    >
      Clear Leaderboard
    </button>
  </div>`;
}
