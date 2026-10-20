# Alchemist's Cauldron — Story 2

**Author: Gafursz** · **Design: Midnight Potion Lab**

A playable Level 1 alchemy game written in vanilla TypeScript, CSS and inline SVG. Combine ingredients, match three target ranges and brew potions before time, lives or stock run out.

## Agreed project mapping

| Branch                       | Scope                                                 | Review PR                 |
| ---------------------------- | ----------------------------------------------------- | ------------------------- |
| `story-1`                    | Precondition: repository, tooling and technical setup | `story-1` → `main`        |
| **`story-2` (this package)** | **Level 1: US 1.1–1.6, the basic playable game**      | **`story-2` → `story-1`** |
| `story-3`                    | Level 2 and Level 3 additions                         | `story-3` → `story-2`     |

This is the project's agreed branch plan. The assignment's generic branch instructions do not explicitly map all four development stages to three branches. User stories such as US 1.2 are feature identifiers, not branch names. Gameplay difficulties (Easy/Medium/Hard) are separate from development levels.

The remote `story-2` baseline was setup commit `36522ac61794685a62bfe6cb632cbc1636d7c278`. This package integrates the earlier Level 1 implementation into its correctly named Story 2 delivery, adds Windows line-ending configuration and improves keyboard focus. It does not include Level 2 difficulty selection or save/continue.

## Run locally

Use Node.js 22.12+ in the 22.x line, or a newer supported LTS release, with npm.

```bash
npm ci
npm run dev
```

- `npm ci` installs the exact locked development dependencies into `node_modules`. It also initializes Husky when run inside a Git repository. It does not commit or push files. Run it from the folder containing `package.json`.
- `npm run dev` starts Vite. Open the local URL it prints (normally http://localhost:5173). Keep the terminal open while playing; Ctrl+C stops the server. It does not modify Git history.

Do not double-click `index.html`; the project uses TypeScript modules and needs an HTTP server. Extract into a separate folder first so you can inspect it before integrating it into your existing repository.

## Controls and game rules

- **Start Game:** generates six Medium ingredient stocks, each independently 2–15, chooses a random Medium recipe and starts at 150 seconds with three lives.
- **Ingredient card:** click/tap, or focus with Tab and activate with Enter/Space. T, D and M show Temperature, Density and Magic Power. Every addition consumes one portion. Repeat ingredients are allowed; addition order is preserved.
- **Cauldron:** holds up to four ingredients. Full capacity blocks the shelf. A zero-stock card keeps its position and zero badge but loses its icon and cannot be focused or activated.
- **Bars:** show exact ingredient sums. Temperature and Density have centered zero lines and support negative values. Bright green zones and glow indicate the literal recipe ranges. Brewing also accepts ±8 outside each target range.
- **Brew Potion:** enabled with at least one ingredient. Success gives 200 points and up to 10 seconds, clears the mixture and selects a new recipe. Failure removes one life, clears the mixture and keeps the recipe. Ingredients are never refunded or replenished after brewing.
- **Pause:** stops the clock and conceals/blocks the field. Resume continues the same run. Switching away from the tab pauses automatically. Exit to Menu abandons the run.
- **Game over:** occurs at zero time, zero lives, or when both shelf and cauldron are empty. Play again starts fresh.
- **Leaderboard:** qualifying results accept a 2–15 character name using letters, digits, spaces, underscores and hyphens. Top 10 persists in localStorage; earlier results win score ties. Clearing requires an in-app confirmation.

Reloading abandons an unfinished run in this milestone. Only the leaderboard persists. Auto-save and Continue Game belong to Story 3 / Level 2.

## Completed scope

| User story | Delivered                                                                                                       |
| ---------- | --------------------------------------------------------------------------------------------------------------- |
| US 1.1     | Full eight-item catalogue, six active shelf ingredients, random limited stock, ordered cauldron, capacity rules |
| US 1.2     | Pure sums, negative values, signed bars, current markers, target zones, transitions and in-range glow           |
| US 1.3     | All 20 recipes, Medium filtering, recipe panel/counter, success/failure checks and rewards                      |
| US 1.4     | Timestamp-derived clock, shrinking time bar, urgent pulse, lives, ending reasons and replay                     |
| US 1.5     | Manual/hidden-tab pause, frozen time, hidden/inert field, resume and exit                                       |
| US 1.6     | Validated local Top-10, name entry, tie ordering, dates, confirmed clearing and storage error handling          |

All interface controls are DOM elements. Artwork is separate inline SVG; no flattened generated screenshot, framework, game engine, icon library or runtime animation package is used. Layout adapts to 375–1920 px, and CSS respects reduced-motion preferences.

## Checks and production build

| Command                | Purpose / expected result                                                                         | Git impact                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `npm run check`        | Runs type checking, ESLint, Prettier check and production build; exits successfully when all pass | Does not commit; regenerates ignored `dist/`               |
| `npm test`             | Compiles source into ignored `.test-build/` and runs Node's built-in regression tests             | No commits or tracked generated files                      |
| `npm run format`       | Rewrites supported source/config/docs with Prettier and LF endings                                | May modify tracked files; review changes before committing |
| `npm run format:check` | Reports formatting errors without rewriting files                                                 | Read-only                                                  |
| `npm run build`        | Type-checks and builds the browser application into `dist/`                                       | Generated output is ignored                                |
| `npm run preview`      | Serves the existing production build over HTTP                                                    | No commits; requires a build first                         |

The ZIP includes `dist/` for convenience, but `.gitignore` excludes it from commits. Dependencies and `.git` history are not included. When installing the extracted ZIP outside a Git repository, Husky may report that `.git` is unavailable; initialize it by running `npm ci` inside your existing repository after integration.

## Windows line endings

`.gitattributes` declares LF endings for text files, `.prettierrc.json` explicitly sets `endOfLine: lf`, and `.editorconfig` asks editors to save UTF-8/LF files. This makes Git Bash/Windows and other environments agree. Do not change your global Git configuration for this package. Instructions for reviewing and normalizing existing files are in `docs/INTEGRATION.md`.

## Explanation and next steps

- `docs/IMPLEMENTATION.md`: what changed, why, file responsibilities and behavior.
- `docs/INTEGRATION.md`: safe integration, every terminal command explained, and branch/PR targets.
- `docs/VERIFICATION.md`: actual checks and known delivery limits.

[RS School assignment](https://github.com/rolling-scopes-school/qualifying-stage/blob/main/tasks/game-alchemists-cauldron/README.md)

Story 2 has been pushed to GitHub and the final `story-2` → `story-1`
review Pull Request is open and intentionally unmerged. Public deployment
and RS App submission remain to be completed.
