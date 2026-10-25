# Alchemist's Cauldron

**Author: Gafursz**

A responsive browser game built with vanilla TypeScript, CSS and inline SVG for the RS School qualifying stage.

Mix ingredients, manage limited stock, match recipe parameters, trigger chemical reactions and brew potions before time or lives run out.

## Live Demo

**GitHub Pages:**  
https://gafursz.github.io/Alchemists-Cauldron/

## Features

The project implements the complete **Level 3 — Full Game** scope.

### Core Gameplay

- Random recipe selection
- Limited ingredient stock
- Temperature, Density and Magic Power parameters
- Recipe target ranges and tolerance
- Score system
- Countdown timer
- Lives
- Pause and resume
- Automatic pause when the browser tab becomes hidden
- Game-over flow
- Top-10 leaderboard
- Custom in-app dialogs

### Difficulty Modes

Three difficulty levels are available:

| Difficulty | Ingredients | Capacity |  Time | Lives | Tolerance | Score | Time Bonus | Reactions |
| ---------- | ----------: | -------: | ----: | ----: | --------: | ----: | ---------: | --------: |
| Easy       |           4 |        4 | 180 s |     5 |       ±12 |   100 |      +15 s |         0 |
| Medium     |           6 |        4 | 150 s |     3 |        ±8 |   200 |      +10 s |         2 |
| Hard       |           8 |        5 | 150 s |     3 |        ±5 |   300 |       +5 s |         3 |

The selected difficulty controls shelf size, cauldron capacity, time, lives, tolerance, score rewards, time bonuses, recipes and reactions.

### Save & Continue

The current unfinished run is automatically saved to `localStorage`.

Saved data includes:

- difficulty
- score
- remaining time
- lives
- active recipe
- cauldron ingredients
- shelf stock
- game status

When a valid unfinished save exists, **Continue Game** restores it in a paused state.

Broken saved data is validated and removed safely instead of crashing the application.

### Drag & Drop

Ingredients can be:

- clicked normally
- operated with the keyboard
- dragged into the cauldron

The cauldron highlights during a valid drag.

Dragging is blocked when:

- the game is paused
- ingredient stock is 0
- the cauldron is full

### Ingredient Tooltips

Level 3 ingredient cards show only:

- icon
- name
- stock

Hovering or focusing a card displays:

- Temperature
- Density
- Magic Power

Positive values use `+` and negative values use `−`.

The tooltip automatically changes position near the right and bottom edges of the viewport.

### Chemical Reactions

Easy has no reactions, Medium enables two and Hard enables three.

Implemented reactions:

#### Bubbling

**Fairy Dust + Caustic Acid**

- Magic Power +50%
- removes 10 seconds once

#### Solar Frost

**Dragon Tears + Frost Lotus**

- Temperature becomes 0
- Density increases by 20%

#### Volatile Mix

**Phoenix Feather + Essence of the Void**

- loses 1 life
- clears the cauldron

Reactions are stored in a typed reaction configuration and fire only when they change from inactive to active.

### Pour Out

The **Pour Out** action:

- clears the whole cauldron
- costs 10 seconds
- does not remove a life
- does not refund ingredient stock
- is disabled when the cauldron is empty

### Visual Feedback

The game includes CSS-based visual effects:

- successful brew animation
- failed brew animation
- explosion effect
- screen shake
- floating ingredient icons
- animated potion
- smooth parameter bars
- target-zone glow
- low-time warning

Decorative animations are implemented with CSS rather than JavaScript timers.

### Keyboard Controls

During an active game:

| Key   | Action                           |
| ----- | -------------------------------- |
| `1–8` | Add the corresponding ingredient |
| `B`   | Brew Potion                      |
| `O`   | Pour Out                         |
| `P`   | Pause                            |

Game shortcuts are disabled on the menu, pause screen and game-over screen.

Shortcuts are also ignored while the player is typing.

Normal browser keyboard behavior such as Tab, Enter and Space continues to work on buttons and form controls.

## Ingredient Catalogue

| Ingredient          | Temperature | Density | Magic Power |
| ------------------- | ----------: | ------: | ----------: |
| Dragon Tears        |         +25 |      +8 |         +10 |
| Fairy Dust          |         +12 |      +9 |         +12 |
| Frost Lotus         |         −18 |      +4 |         +14 |
| Mandrake Root       |          −5 |     +20 |          +8 |
| Caustic Acid        |         +10 |     +14 |         +22 |
| Essence of the Void |         −20 |     −10 |         +40 |
| Phoenix Feather     |         +50 |     −10 |         +30 |
| Toad Slime          |          +5 |     +30 |           0 |

Each available ingredient starts a new game with a random stock from **2 to 15**.

Using an ingredient reduces its stock by one. Used ingredients are never refunded after Brew or Pour Out.

## Game Over

A run ends when:

- time reaches 0
- all lives are lost
- the shelf is empty and the cauldron is empty

A qualifying score can be saved to the difficulty-specific Top-10 leaderboard.

Leaderboard names accept 2–15 characters using letters, digits, spaces, `_` and `-`.

Earlier results stay ahead when scores are equal.

## Responsive Design

The game is designed for the required range of **375 px to 1920 px**.

The layout adapts for:

- desktop
- landscape tablet
- portrait tablet
- mobile

Desktop and supported tablet layouts are optimized so the main gameplay sections fit within the available viewport without unnecessary page scrolling.

## Technologies

- TypeScript
- HTML
- CSS
- Inline SVG
- Vite
- ESLint
- Prettier
- Husky
- GitHub Actions
- GitHub Pages

No frontend framework, CSS framework, game engine or runtime UI library is used.

## Project Structure

```text
src/
├── assets/
├── data/
│   ├── difficulty.ts
│   ├── ingredients.ts
│   ├── reactions.ts
│   └── recipes.ts
├── logic/
│   ├── brewing.ts
│   └── timer.ts
├── state/
│   └── game.ts
├── storage/
│   ├── leaderboard.ts
│   └── save.ts
├── styles/
│   └── style.css
├── ui/
│   ├── app.ts
│   ├── art.ts
│   ├── bars.ts
│   ├── dialogs.ts
│   ├── dom.ts
│   ├── drag.ts
│   └── tooltip.ts
└── main.ts
```

Game rules and state logic are kept separate from DOM rendering.

## Run Locally

Requirements:

- Node.js 22 or newer
- npm

Clone the repository and install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite.

## Quality Checks

Run the complete project check:

```bash
npm run check
```

This runs:

1. TypeScript type checking
2. ESLint
3. Prettier validation
4. Vite production build

Format the project with:

```bash
npm run format
```

Build the production version with:

```bash
npm run build
```

Preview the production build locally with:

```bash
npm run preview
```

## RS School Scope

Implemented cumulative scope:

- Precondition — repository and technical setup
- Level 1 — US 1.1 to US 1.6
- Level 2 — US 2.1 and US 2.2
- Level 3 — US 3.1 to US 3.6

### Level 3

- US 3.1 — Drag & Drop
- US 3.2 — Ingredient Tooltip
- US 3.3 — Chemical Reactions
- US 3.4 — Pour Out
- US 3.5 — Visual Feedback
- US 3.6 — Keyboard Shortcuts

## Repository Workflow

Development uses story and feature branches.

Final story Pull Requests are intentionally left open for RS School cross-check:

```text
story-1 → main
story-2 → story-1
story-3 → story-2
```

Feature Pull Requests are merged into their corresponding story branch.

## Author

**Gafursz**

Built for the RS School qualifying stage.
