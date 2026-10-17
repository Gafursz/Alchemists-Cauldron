# Alchemist's Cauldron

An alchemy-themed TypeScript browser game for the RS School qualifying stage.

**Game goal:** add ingredients to a cauldron, balance Temperature, Density, and Magic Power, and brew potions while time, lives, and ingredient stock are limited.

## Current implementation

- [x] Project folder structure and a preliminary responsive start page
- [x] Strict TypeScript and Vite configuration
- [x] ESLint and Prettier configuration
- [x] Husky commit-msg and pre-push hook scripts
- [x] Pull Request template
- [ ] Level 1 gameplay: shelf, cauldron, bars, recipes, timer, pause, leaderboard
- [ ] Level 2 gameplay: difficulty selection and auto-save
- [ ] Level 3 gameplay: drag-and-drop, tooltips, reactions, pour out, effects, shortcuts

The current interface is a **setup placeholder**, not yet a playable game. A full implementation will replace it during Level 1.

## Requirements

- Node.js compatible with Vite 7 (Node.js 20.19+ or 22.12+)
- npm and Git

## Getting started

```bash
npm install
npm run dev
```

Open the address printed by Vite in your terminal.

## Quality checks and production build

```bash
npm run typecheck
npm run lint
npm run format
npm run format:check
npm run build
npm run preview
```

`npm run check` runs the type check, lint, format check, and build together.

After `npm install` runs inside a Git repository, the `prepare` script configures Husky. The `commit-msg` hook validates the commit message pattern. The `pre-push` hook runs linting, formatting, and TypeScript checks.

## Project structure

- `src/data/` — catalogue, recipes, difficulty, and reactions
- `src/logic/` — pure gameplay functions
- `src/state/` — game state and actions
- `src/storage/` — game saves and leaderboards
- `src/ui/` — DOM rendering and interactions
- `src/styles/` — responsive native CSS
- `src/assets/` — individual game assets, if needed

## Controls

Gameplay controls will be documented as the game is implemented. The current starter has no gameplay controls.

## Deployment

A public deployment link will be added after configuring hosting. The Vite build uses relative asset paths to support hosting under a GitHub Pages project subpath.

## Source task

[RS School Alchemist's Cauldron requirements](https://github.com/rolling-scopes-school/qualifying-stage/blob/main/tasks/game-alchemists-cauldron/README.md)
