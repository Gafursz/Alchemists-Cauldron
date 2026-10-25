import { DIFFICULTY_SETTINGS } from '../data/difficulty.js';
import type { Game } from '../state/game.js';
import { element } from './dom.js';

export function installDragDrop(root: HTMLElement, game: Game): void {
  const zone = element('#drop-zone', root);
  let draggedId = '';

  function canDrop(): boolean {
    const settings = DIFFICULTY_SETTINGS[game.state.difficulty];

    return (
      game.state.status === 'playing' &&
      draggedId !== '' &&
      (game.state.stock[draggedId] ?? 0) > 0 &&
      game.state.ingredients.length < settings.capacity
    );
  }

  function reset(): void {
    draggedId = '';
    zone.classList.remove('drop-ready');
    root.querySelector('.dragging')?.classList.remove('dragging');
  }

  root.addEventListener('dragstart', (event) => {
    if (!(event.target instanceof Element)) return;

    const card = event.target.closest<HTMLButtonElement>('[data-ingredient]');

    if (!card || card.disabled || !event.dataTransfer) {
      event.preventDefault();
      return;
    }

    draggedId = card.dataset.ingredient ?? '';

    event.dataTransfer.setData('text/plain', draggedId);
    event.dataTransfer.effectAllowed = 'copy';

    card.classList.add('dragging');
  });

  zone.addEventListener('dragover', (event) => {
    if (!canDrop()) return;

    event.preventDefault();
    zone.classList.add('drop-ready');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('drop-ready');
  });

  zone.addEventListener('drop', (event) => {
    event.preventDefault();

    if (canDrop()) {
      game.add(draggedId);
    }

    reset();
  });

  root.addEventListener('dragend', reset);
}
