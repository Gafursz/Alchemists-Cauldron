# Story 2 implementation: what changed and why

Author: **Gafursz**

## Scope

The starting repository contained tooling and a static introductory page. This package replaces that placeholder with a working basic game, US 1.1–1.6. It keeps the existing Vite/TypeScript toolchain and builds on the `story-2` setup snapshot at `36522ac`.

This is a design interpretation of the selected **Midnight Potion Lab** concept. The generated full-screen reference is not used as a background or flattened interface. All controls are real DOM elements; the ingredient art and cauldron are individual inline SVG drawings. It has the chosen violet panels, cyan potion, illustrated ingredients and coral Brew button, but is not a pixel-for-pixel recreation of the raster mockup.

## Main changes

| Change                                                  | Why it was made                                                        | What the player/developer gains                                                         |
| ------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Exact eight-ingredient and 20-recipe catalogues         | RS School prescribes these numbers and ordering                        | Reliable game data, with future difficulty pools already present                        |
| One game-state class                                    | Prevent independent controls from changing rules differently           | All add, brew, pause and end actions pass through the same checks                       |
| Independent random stock of 2–15                        | Inventory is a limited resource, not infinite buttons                  | Each addition spends a portion; depleted cards stay in position and become disabled     |
| Ordered four-item cauldron                              | Preserve addition order and enforce capacity                           | Clear slot history and a highlighted full counter; no unsupported remove buttons        |
| Pure calculation/range functions                        | Keep mathematics separate from markup                                  | Correct negative totals and meaningful boundary tests                                   |
| Timestamp deadline                                      | Counting timer ticks drifts when the browser is busy                   | Remaining time is derived from actual elapsed time; pause freezes duration              |
| One guarded game-over transition                        | Several end conditions can happen at once                              | A single stable ending screen, without duplicate submissions                            |
| Real pause modal plus hidden/inert game field           | Players must not interact or study the mixture while paused            | Timer stops; shelf, recipe and cauldron are concealed and blocked                       |
| Validated, guarded localStorage                         | JSON can be damaged and browsers can deny storage                      | The game continues; scores remain in memory if persistence fails, with a visible notice |
| Stable Top-10 ranking and Unicode-aware name validation | Earlier results must win score ties and invalid names must be rejected | Predictable ranking, safe text rendering and local-time date labels                     |
| CSS/SVG interface with native buttons and dialogs       | Meet the vanilla TypeScript and individual-element rules               | A themed game with keyboard focus, touch-sized controls and no runtime dependencies     |
| Responsive layouts                                      | The task covers 375–1920 px                                            | Three desktop columns, tablet rearrangement and a stacked mobile layout                 |
| Author metadata                                         | Requested attribution                                                  | Gafursz appears in package metadata, HTML metadata and footer                           |

## File-by-file reading order

1. `src/types.ts`: describes the objects used throughout the project.
2. `src/data/ingredients.ts`, `recipes.ts`, `difficulty.ts`: supplies fixed data and rules.
3. `src/logic/brewing.ts`: adds ingredient values and checks expanded recipe ranges.
4. `src/state/game.ts`: owns the run. Start creates stock; Add consumes it; Brew changes score/lives; Pause and Resume adjust time.
5. `src/storage/leaderboard.ts`: validates names and saved entries, sorts results and catches storage failures.
6. `src/ui/app.ts` and `bars.ts`: renders the state. Bars remain mounted so CSS transitions can animate their positions.
7. `src/ui/art.ts` and `src/styles/style.css`: defines separate SVG illustrations and the visual design.
8. `src/ui/dialogs.ts`: builds Help, Menu, Pause, Game Over and Leaderboard dialogs.
9. `src/main.ts`: connects actions and manages focus/dialog transitions. The 100 ms interval only updates the clock; visual effects use CSS.

## Important design and rule decisions

- **Fixed Medium rules:** 6 available ingredients, 4 slots, 150 seconds, 3 lives, ±8 tolerance, +200 points and +10 seconds. Difficulty selection is Level 2.
- **Time cap:** the assignment conflicts (120 vs 150). This package uses 150, following US 1.4. Change `SETTINGS.timeCap` if the task authors clarify otherwise. Choosing a 120 cap would need care to avoid decreasing a run that still has more than 120 seconds.
- **Bar ranges:** Temperature uses -100..100, Density -80..80 and Magic 0..160. These cover every possible four-ingredient Medium sum; signed axes keep zero centered. Bright green bands show literal recipe targets, and help text separately explains brew tolerance.
- **Recipe selection:** random from Medium only, without stock-aware filtering or repeat prevention because neither is specified. Late recipes may be impossible with depleted inventory.
- **No refund or remove action:** failed brews also consume ingredients. The mockup's individual removal icons are deliberately absent.
- **No unfinished-run persistence:** reloading abandons the current run in Level 1. The leaderboard persists; save/continue belongs to Level 2.
- **Date formatting:** results use the device's local time in DD.MM.YYYY HH:MM format. Ranking uses stored timestamps and stable order for exact ties.
- **Storage failures:** an invalid stored list is discarded for this session; a future successful save replaces it. Denied writes retain session scores and show a notice.
- **Screen-reader behavior:** meaningful buttons have full names and stat labels; bars expose current values; feedback is announced without announcing every timer tick.

## Changes since the earlier ZIP

The earlier archive was named story-1 even though it contained Level 1 gameplay. The agreed mapping now places that gameplay in Story 2. This package reuses the working game and corrects the delivery name, scope descriptions and integration targets; it does not pretend those features were newly implemented twice.

Additional fixes:

- Explicit LF settings in `.gitattributes`, `.prettierrc.json` and `.editorconfig` address Windows formatting differences.
- Keyboard activation transfers focus to an available ingredient, or Brew when the cauldron fills, if the previously focused ingredient becomes disabled. After a keyboard brew, focus returns to an available action. Keyboard Resume returns focus to Pause; Exit returns focus to Start Game.
- The urgent countdown pulse is active only while playing; pausing freezes the number and stops the pulse.
- New regression tests cover exact time bonuses below the cap, pause at the expiry boundary, equal-score/equal-date ordering and saved leaderboard round trips.
- Generated Husky wrappers, dependencies and compiled test output are excluded from the ZIP; npm prepares hooks in the real repository.

## Branch and delivery boundaries

For this project: Story 1 = setup; Story 2 = Level 1; Story 3 = Levels 2 and 3. Feature PRs for this package target `story-2`. The Story 2 review PR targets `story-1` and stays unmerged. Follow your actual RS App assignment when selecting the final submission link.

Follow `INTEGRATION.md` for safe copy instructions and command explanations. Your local Windows working tree and any uncommitted changes were not edited remotely.

The 120/150-second time-cap ambiguity remains documented. A public deployment, final PR metadata and RS App submission are still required outside this ZIP.
