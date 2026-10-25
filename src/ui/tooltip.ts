import { INGREDIENTS } from '../data/ingredients.js';
import type { GameState } from '../types.js';
import { escapeHtml, signed } from './dom.js';

export function installTooltip(root: HTMLElement, state: () => GameState): void {
  const tooltip = document.createElement('div');

  tooltip.className = 'ingredient-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;

  root.append(tooltip);

  function hide(): void {
    tooltip.hidden = true;
  }

  function show(card: HTMLElement): void {
    if (state().status !== 'playing') {
      hide();
      return;
    }

    const ingredient = INGREDIENTS.find((item) => item.id === card.dataset.ingredient);

    if (!ingredient) return;

    tooltip.innerHTML = `
      <strong>${escapeHtml(ingredient.name)}</strong>
      <span>Temperature ${signed(ingredient.temperature)}</span>
      <span>Density ${signed(ingredient.density)}</span>
      <span>Magic Power ${signed(ingredient.magicPower)}</span>
    `;

    tooltip.hidden = false;

    const cardBox = card.getBoundingClientRect();
    const tooltipBox = tooltip.getBoundingClientRect();
    const gap = 8;

    let left = cardBox.right + gap;
    let top = cardBox.top;

    if (left + tooltipBox.width > window.innerWidth) {
      left = cardBox.left - tooltipBox.width - gap;
    }

    if (top + tooltipBox.height > window.innerHeight) {
      top = cardBox.bottom - tooltipBox.height;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  root.querySelectorAll<HTMLElement>('[data-ingredient]').forEach((card) => {
    card.addEventListener('pointerenter', () => show(card));
    card.addEventListener('pointerleave', hide);
    card.addEventListener('focus', () => show(card));
    card.addEventListener('blur', hide);
  });
}
