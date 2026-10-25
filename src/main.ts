import { isDifficulty } from './data/difficulty.js';
import { Game } from './state/game.js';
import { Leaderboard, validName } from './storage/leaderboard.js';
import { GameSave } from './storage/save.js';
import './styles/style.css';
import type { GameStatus } from './types.js';
import { renderApp, updateApp } from './ui/app.js';
import { dialogMarkup } from './ui/dialogs.js';
import type { DialogPage } from './ui/dialogs.js';
import { element } from './ui/dom.js';
import { installDragDrop } from './ui/drag.js';
import { installTooltip } from './ui/tooltip.js';

const root = element<HTMLDivElement>('#app');
renderApp(root);

const dialog = element<HTMLDialogElement>('#game-dialog');

const boards = {
  easy: new Leaderboard('easy'),
  medium: new Leaderboard('medium'),
  hard: new Leaderboard('hard'),
};

const save = new GameSave();

let page: DialogPage | null = null;
let previousStatus: GameStatus = 'menu';
let submitted = false;
let finishedAt = 0;

const game = new Game(() => {
  updateApp(game.state);

  if (game.state.status === 'playing' || game.state.status === 'paused') {
    save.write(game.state);
  }

  if (game.state.status === 'game-over' && previousStatus !== 'game-over') {
    save.clear();
    finishedAt = Date.now();
    open('game-over');
  }

  previousStatus = game.state.status;
});

const board = (): Leaderboard => boards[game.state.difficulty];

game.selectDifficulty(save.current?.difficulty ?? save.difficulty);

function open(next: DialogPage): void {
  page = next;

  element('#dialog-content').innerHTML = dialogMarkup(
    next,
    game.state,
    board(),
    submitted,
    Boolean(save.current),
  );

  if (!dialog.open) dialog.showModal();
}

function close(): void {
  page = null;
  dialog.close();
}

function pause(): boolean {
  if (game.state.status === 'playing') {
    game.pause();
  }

  return game.state.status !== 'game-over';
}

root.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;

  const control = event.target.closest<HTMLElement>(
    '[data-action], [data-ingredient], [data-difficulty]',
  );

  if (!control || (control instanceof HTMLButtonElement && control.disabled)) return;

  if (control instanceof HTMLAnchorElement) {
    event.preventDefault();
  }

  const difficulty = control.dataset.difficulty;

  if (difficulty) {
    if (game.state.status === 'menu' && isDifficulty(difficulty)) {
      game.selectDifficulty(difficulty);
      save.choose(difficulty);
      open('menu');
    }

    return;
  }

  const ingredient = control.dataset.ingredient;

  if (ingredient) {
    game.add(ingredient);
    return;
  }

  switch (control.dataset.action) {
    case 'start':
      save.clear();
      close();
      submitted = false;
      game.start();
      break;

    case 'continue':
      if (save.current) {
        game.restore(save.current);
        open('pause');
      }
      break;

    case 'brew':
      game.brew();
      break;

    case 'pour':
      game.pourOut();
      break;

    case 'pause':
      game.pause();

      if (game.state.status === 'paused') {
        open('pause');
      }
      break;

    case 'resume':
      close();
      game.resume();
      break;

    case 'exit':
      save.clear();
      close();
      game.exit();
      break;

    case 'menu':
      if (pause()) {
        open(game.state.status === 'paused' ? 'pause' : 'menu');
      }
      break;

    case 'help':
    case 'leaderboard':
      if (pause()) {
        open(control.dataset.action);
      }
      break;

    case 'back':
      open(
        game.state.status === 'paused'
          ? 'pause'
          : game.state.status === 'game-over'
            ? 'game-over'
            : 'menu',
      );
      break;

    case 'close':
      close();
      break;

    case 'clear':
      open('clear');
      break;

    case 'cancel-clear':
      open('leaderboard');
      break;

    case 'confirm-clear':
      board().clear();
      open('leaderboard');
      break;
  }
});

dialog.addEventListener('cancel', (event) => {
  event.preventDefault();

  if (page === 'clear') {
    open('leaderboard');
  } else if (page === 'menu') {
    close();
  } else {
    open(
      game.state.status === 'paused'
        ? 'pause'
        : game.state.status === 'game-over'
          ? 'game-over'
          : 'menu',
    );
  }
});

dialog.addEventListener('submit', (event) => {
  event.preventDefault();

  if (page !== 'game-over' || submitted) return;

  const input = element<HTMLInputElement>('#player-name');

  if (!validName(input.value)) {
    element('#name-error').textContent =
      'Use 2–15 letters, digits, spaces, underscores or hyphens.';

    input.focus();
    return;
  }

  submitted = board().add(input.value, game.state.score, finishedAt);

  open('game-over');
});

document.addEventListener('keydown', (event) => {
  const target = event.target;

  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  ) {
    return;
  }

  if (game.state.status !== 'playing') return;

  const key = event.key.toLowerCase();

  if (/^[1-8]$/.test(key)) {
    const cards = root.querySelectorAll<HTMLButtonElement>('[data-ingredient]:not([hidden])');

    const card = cards[Number(key) - 1];

    if (card && !card.disabled) {
      event.preventDefault();
      card.click();
    }

    return;
  }

  if (key === 'b') {
    event.preventDefault();
    game.brew();
  }

  if (key === 'o') {
    event.preventDefault();
    game.pourOut();
  }

  if (key === 'p') {
    event.preventDefault();
    game.pause();
    open('pause');
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && game.state.status === 'playing') {
    game.pause();
    open('pause');
  }
});

installDragDrop(root, game);
installTooltip(root, () => game.state);

window.setInterval(() => game.tick(), 100);

updateApp(game.state);
