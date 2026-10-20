import './styles/style.css';
import { Game } from './state/game.js';
import { Leaderboard, validName } from './storage/leaderboard.js';
import { renderApp, updateApp } from './ui/app.js';
import { dialogMarkup } from './ui/dialogs.js';
import type { DialogPage } from './ui/dialogs.js';
import { element } from './ui/dom.js';
import type { GameStatus } from './types.js';
const root = element<HTMLDivElement>('#app');
renderApp(root);
const dialog = element<HTMLDialogElement>('#game-dialog');
const board = new Leaderboard();
let page: DialogPage | null = null;
let previousStatus: GameStatus = 'menu';
let submitted = false;
let finishedAt = 0;
const game = new Game(() => {
  updateApp(game.state);
  if (game.state.status === 'game-over' && previousStatus !== 'game-over') {
    finishedAt = Date.now();
    openDialog('game-over');
  }
  previousStatus = game.state.status;
});
function openDialog(next: DialogPage): void {
  page = next;
  element('#dialog-content').innerHTML = dialogMarkup(next, game.state, board, submitted);
  if (!dialog.open) dialog.showModal();
  else element<HTMLElement>('button, input', dialog).focus();
}
function closeDialog(): void {
  page = null;
  dialog.close();
}
function back(): void {
  if (game.state.status === 'paused') openDialog('pause');
  else if (game.state.status === 'game-over') openDialog('game-over');
  else openDialog('menu');
}
function pauseForPanel(): boolean {
  if (game.state.status === 'playing') game.pause();
  return game.state.status !== 'game-over';
}
function focusGameplay(): void {
  if (game.state.status !== 'playing') return;
  const next =
    root.querySelector<HTMLButtonElement>('.ingredient-card:not(:disabled)') ??
    root.querySelector<HTMLButtonElement>('#brew:not(:disabled)');
  next?.focus();
}
root.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const control = event.target.closest<HTMLElement>('[data-action], [data-ingredient]');
  if (!control || (control instanceof HTMLButtonElement && control.disabled)) return;
  if (control instanceof HTMLAnchorElement) event.preventDefault();
  if (control.dataset.ingredient) {
    game.add(control.dataset.ingredient);
    // Keep keyboard users in the game when the focused card becomes disabled.
    if (event.detail === 0 && control instanceof HTMLButtonElement && control.disabled)
      focusGameplay();
    return;
  }
  switch (control.dataset.action) {
    case 'start':
      closeDialog();
      submitted = false;
      game.start();
      if (event.detail === 0) focusGameplay();
      break;
    case 'brew':
      game.brew();
      if (event.detail === 0) focusGameplay();
      break;
    case 'pause':
      game.pause();
      if (game.state.status === 'paused') openDialog('pause');
      break;
    case 'resume':
      closeDialog();
      game.resume();
      if (event.detail === 0) element<HTMLButtonElement>('#pause').focus();
      break;
    case 'exit':
      closeDialog();
      game.exit();
      if (event.detail === 0) element<HTMLButtonElement>('#brew').focus();
      break;
    case 'menu':
      if (pauseForPanel()) openDialog(game.state.status === 'paused' ? 'pause' : 'menu');
      break;
    case 'help':
      if (pauseForPanel()) openDialog('help');
      break;
    case 'leaderboard':
      if (game.state.status === 'playing') {
        if (!pauseForPanel()) break;
      }
      openDialog('leaderboard');
      break;
    case 'back':
      back();
      break;
    case 'close':
      closeDialog();
      break;
    case 'clear':
      openDialog('clear');
      break;
    case 'cancel-clear':
      openDialog('leaderboard');
      break;
    case 'confirm-clear':
      board.clear();
      openDialog('leaderboard');
      break;
  }
});
dialog.addEventListener('cancel', (event) => {
  event.preventDefault();
  if (page === 'help' || page === 'leaderboard') back();
  else if (page === 'clear') openDialog('leaderboard');
  else if (page === 'menu') closeDialog();
});
dialog.addEventListener('submit', (event) => {
  event.preventDefault();
  if (page !== 'game-over' || submitted) return;
  const input = element<HTMLInputElement>('#player-name');
  if (!validName(input.value)) {
    element('#name-error').textContent =
      'Use 2–15 letters, digits, spaces, underscores or hyphens.';
    input.setAttribute('aria-invalid', 'true');
    input.focus();
    return;
  }
  submitted = board.add(input.value, game.state.score, finishedAt);
  openDialog('game-over');
});
function pauseGame(): void {
  game.pause();
  if (game.state.status === 'paused') openDialog('pause');
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden && game.state.status === 'playing') pauseGame();
});
// This schedules clock rendering only. Remaining time always comes from timestamps.
window.setInterval(() => game.tick(), 100);
updateApp(game.state);
