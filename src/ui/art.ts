const drawings: Record<string, string> = {
  'dragon-tears':
    '<path d="M53 10C48 30 25 43 25 63a28 28 0 0 0 56 0C81 44 61 28 53 10Z" fill="#459ce7" stroke="#b1edff" stroke-width="2"/><path d="m53 21-15 40 15 24 15-24Z" fill="#9be5ff"/><path d="m53 21 0 64 15-24Z" fill="#4bb8f8"/><path d="M30 74c-5-6-8-11-9-16-2 8-10 14-10 20a10 10 0 0 0 19-4Z" fill="#6dd6ff"/><path d="m81 25 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#d4f7ff"/>',
  'fairy-dust':
    '<path d="M38 25h25v17c0 6 18 11 18 29 0 16-13 23-30 23S21 87 21 71c0-18 17-23 17-29Z" fill="#754f9c" stroke="#f8c4fa" stroke-width="2"/><path d="M28 65q24-14 46 0v10c-2 18-42 18-46 0Z" fill="#db7dc5"/><rect x="35" y="16" width="31" height="13" rx="4" fill="#cf9e85"/><path d="M34 47q-10 10-8 20" stroke="#fff0ff" stroke-width="4" stroke-linecap="round"/><g fill="#ffe7fe"><path d="m50 53 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/><circle cx="65" cy="77" r="3"/><circle cx="39" cy="80" r="2"/><path d="m79 28 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z"/></g>',
  'frost-lotus':
    '<path d="M50 91Q8 83 8 49q27 1 42 42Z" fill="#79b5e6"/><path d="M50 91q42-8 42-42-27 1-42 42Z" fill="#79b5e6"/><path d="M50 90Q18 68 24 25q27 15 26 65Z" fill="#b2dafa"/><path d="M50 90q32-22 26-65Q49 40 50 90Z" fill="#b2dafa"/><path d="M50 91Q25 54 50 8q25 46 0 83Z" fill="#e1f6ff"/><path d="m50 25-9 37 9 22 9-22Z" fill="#a0d7ff"/><path d="M16 83q34 25 68 0" fill="none" stroke="#7cc2db" stroke-width="3"/>',
  'mandrake-root':
    '<path d="M48 36Q20 39 21 12q27-1 27 24Z" fill="#82b278"/><path d="M52 39Q51 10 81 10q2 24-29 29Z" fill="#9acc88"/><path d="M50 37Q38 14 46 4q20 8 4 33Z" fill="#689b64"/><path d="M36 40q16-13 29 1l5 29-9 12 9 14-10-2-13-15-13 17-9 0 11-21-7-12Z" fill="#d7a77e" stroke="#f0c79c" stroke-width="2"/><path d="m31 48-14 17m49-15 15 14" stroke="#cfa078" stroke-width="8" stroke-linecap="round"/><path d="m37 54 7 1m10 0 7-1m-17 12q5 4 10 0" stroke="#66464a" stroke-width="3" stroke-linecap="round"/>',
  'caustic-acid':
    '<path d="M40 17h20v26l24 34q10 17-10 17H26Q6 94 16 77l24-34Z" fill="#596d60" stroke="#d7f6bd" stroke-width="2"/><path d="m30 64-12 17q-4 9 9 9h46q13 0 9-9L70 64q-20 8-40 0Z" fill="#b9e875"/><rect x="36" y="11" width="28" height="10" rx="3" fill="#b48c70"/><path d="M43 30v15L27 69" stroke="#f0ffe0" stroke-width="4" stroke-linecap="round"/><circle cx="58" cy="77" r="5" fill="#e8ffb5"/><circle cx="40" cy="82" r="3" fill="#f3ffd8"/><circle cx="56" cy="56" r="3" fill="#d0fa9c"/>',
  'essence-of-the-void':
    '<circle cx="50" cy="51" r="34" fill="#412770"/><circle cx="50" cy="51" r="22" fill="#13102f"/><g fill="none" stroke-linecap="round"><path d="M17 56C4 15 69 0 82 35S52 102 25 79" stroke="#a48aff" stroke-width="7"/><path d="M73 21C23 5 6 70 40 84s62-22 40-42" stroke="#7d58d9" stroke-width="6"/><path d="M31 68c-18-30 33-48 37-16" stroke="#d0b1ff" stroke-width="4"/></g><g fill="#e5caff"><circle cx="18" cy="23" r="2"/><circle cx="85" cy="78" r="3"/><path d="m84 8 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z"/></g>',
};
export function ingredientArt(id: string): string {
  return `<svg viewBox="0 0 100 104" aria-hidden="true" focusable="false">${drawings[id] ?? '<circle cx="50" cy="50" r="30" fill="currentColor"/>'}</svg>`;
}
export const logoArt = `<svg viewBox="0 0 48 54" aria-hidden="true"><path d="M17 6h14v15l10 17q6 11-8 11H15Q1 49 7 38l10-17Z" fill="#9b83ed" stroke="#ded2ff" stroke-width="2"/><path d="M12 33q12 7 24 0l5 9q0 5-8 5H15q-8 0-8-5Z" fill="#6ee3e9"/><path d="M15 5h18" stroke="#f5c797" stroke-width="5" stroke-linecap="round"/><path d="m24 30 2 4 4 2-4 2-2 4-2-4-4-2 4-2Z" fill="white"/></svg>`;
export const cauldronArt = `<svg class="cauldron-art" viewBox="0 0 520 440" role="img" aria-label="A moon-decorated cauldron with glowing cyan potion">
<defs><radialGradient id="potion-glow"><stop stop-color="#5aeaf3" stop-opacity=".26"/><stop offset="1" stop-color="#5aeaf3" stop-opacity="0"/></radialGradient><linearGradient id="pot-body" x2=".8" y2="1"><stop stop-color="#575275"/><stop offset=".42" stop-color="#34334e"/><stop offset="1" stop-color="#202137"/></linearGradient><linearGradient id="potion" y2="1" x2="0"><stop stop-color="#68f2ec"/><stop offset="1" stop-color="#329fbd"/></linearGradient><linearGradient id="rim" x2="0" y2="1"><stop stop-color="#7e769f"/><stop offset="1" stop-color="#34324d"/></linearGradient></defs>
<ellipse cx="260" cy="260" rx="250" ry="170" fill="url(#potion-glow)"/>
<g class="steam" fill="none" stroke="#7fe8f2" stroke-width="6" stroke-linecap="round"><path d="M223 171c-35-35 31-46 3-79"/><path d="M265 160c-24-31 39-49 12-91"/><path d="M305 174c-23-24 27-39 10-65"/></g>
<g class="bubbles" fill="#94fcf2"><circle cx="195" cy="164" r="5"/><circle cx="326" cy="150" r="7"/><circle cx="291" cy="117" r="3"/></g>
<ellipse cx="260" cy="393" rx="162" ry="20" fill="#0d0d21" opacity=".6"/>
<path d="m161 353-13 38q0 9 13 4l24-32m152-10 13 38q0 9-13 4l-24-32" fill="#49445f" stroke="#212034" stroke-width="4"/>
<path d="M130 235c-74-52-67 82 9 56m251-56c74-52 67 82-9 56" fill="none" stroke="#29283e" stroke-width="25"/>
<path d="M128 231c-64-40-56 70 8 54m256-54c64-40 56 70-8 54" fill="none" stroke="#6e6585" stroke-width="8"/>
<path d="M120 215q-15 37-8 78c9 68 58 98 148 98s139-30 148-98q7-41-8-78Z" fill="url(#pot-body)" stroke="#222139" stroke-width="4"/>
<path d="M139 257q-8 57 29 88" fill="none" stroke="#77718d" stroke-opacity=".45" stroke-width="9" stroke-linecap="round"/>
<ellipse cx="260" cy="218" rx="154" ry="52" fill="#28263e" stroke="url(#rim)" stroke-width="15"/>
<ellipse class="liquid" cx="260" cy="218" rx="140" ry="39" fill="url(#potion)"/>
<g class="ripples" fill="none" stroke="#b8fffa" stroke-width="3"><ellipse cx="260" cy="218" rx="104" ry="23"/><path d="M209 211q75-24 98 6t-81 9"/><ellipse cx="260" cy="219" rx="24" ry="5"/></g>
<path d="M113 222q147 86 294 0" fill="none" stroke="#766c93" stroke-width="9"/>
<path d="M276 291a35 35 0 1 0 18 53 31 31 0 0 1-18-53Z" fill="#e7ba8a"/>
<g fill="#b9a1d4"><path d="m203 287 4 10 10 4-10 4-4 10-4-10-10-4 10-4Zm128 19 4 10 10 4-10 4-4 10-4-10-10-4 10-4Z"/><circle cx="215" cy="350" r="3"/><circle cx="308" cy="275" r="3"/></g>
</svg>`;
