import type { Parameter, Recipe, Values } from '../types.js';
import { inRange } from '../logic/brewing.js';
import { element } from './dom.js';
const parameters: readonly {
  key: Parameter;
  label: string;
  icon: string;
  min: number;
  max: number;
}[] = [
  { key: 'temperature', label: 'Temperature', icon: '♨', min: -100, max: 100 },
  { key: 'density', label: 'Density', icon: '≋', min: -80, max: 80 },
  { key: 'magicPower', label: 'Magic Power', icon: '✧', min: 0, max: 160 },
];
export function barsMarkup(): string {
  return parameters
    .map(
      ({
        key,
        label,
        icon,
        min,
        max,
      }) => `<section class="parameter ${key}" data-parameter="${key}">
    <div class="parameter-heading"><h3><span aria-hidden="true">${icon}</span> ${label}</h3><output>0</output></div>
    <div class="meter" role="meter" aria-label="${label}" aria-valuemin="${min}" aria-valuemax="${max}" aria-valuenow="0">
      <span class="meter-fill"></span><span class="target-zone" hidden></span>${min < 0 ? '<span class="zero-line"></span>' : ''}<span class="value-marker"></span>
    </div><div class="meter-scale"><span>${min}</span><span>${min < 0 ? '0' : '80'}</span><span>${max}</span></div>
    <p class="range-label">Target <strong>—</strong></p>
  </section>`,
    )
    .join('');
}
export function updateBars(values: Values, recipe: Recipe | null, tolerance: number): void {
  parameters.forEach(({ key, min, max }) => {
    const root = element(`[data-parameter="${key}"]`);
    const value = values[key];
    const position = (number: number): number => ((number - min) / (max - min)) * 100;
    const zero = position(0);
    const current = position(value);
    const meter = element('.meter', root);
    meter.setAttribute('aria-valuenow', String(value));
    element('output', root).textContent = String(value);
    element('.value-marker', root).style.left = `${current}%`;
    const fill = element('.meter-fill', root);
    fill.style.left = `${Math.min(zero, current)}%`;
    fill.style.width = `${Math.abs(current - zero)}%`;
    const zone = element('.target-zone', root);
    zone.hidden = !recipe;
    if (recipe) {
      const range = recipe[key];
      zone.style.left = `${position(range.min)}%`;
      zone.style.width = `${position(range.max) - position(range.min)}%`;
      element('.range-label strong', root).textContent = `${range.min} to ${range.max}`;
      meter.setAttribute(
        'aria-valuetext',
        `${value}. Target ${range.min} to ${range.max}. Brew tolerance plus or minus ${tolerance}.`,
      );
    } else {
      element('.range-label strong', root).textContent = '—';
      meter.removeAttribute('aria-valuetext');
    }
    root.classList.toggle('in-range', recipe !== null && inRange(value, recipe[key]));
  });
}
