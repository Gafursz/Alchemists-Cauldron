# Verification record

Author: **Gafursz**

Checked on 17 October 2026. These are development checks, not an official RS School score.

## Tooling

- Dependency installation completed using the committed lockfile.
- Strict TypeScript check passed.
- ESLint passed with zero warnings allowed.
- Prettier check passed.
- Vite production build passed.
- All **22 automated tests** passed with Node's built-in test runner.
- Git diff whitespace check passed.

## Automated logic coverage

The included `npm test` command checks catalogue sizes and difficulty filtering; stock endpoints and independent draws; repeated ingredients and negative sums; inclusive tolerance boundaries; empty startup state; stock consumption and preserved order; blocked fifth additions; single-ingredient success and time cap; failure/empty-brew behavior; frozen pause duration; expired-deadline rejection; empty shelf with a nonempty cauldron; zero-life ending exactly once; new-game/exit resets; malformed saved entries and name validation; stable leaderboard ties; denied localStorage; timer formatting; exact below-cap time bonuses; pause at expiry; insertion order for identical scores/dates; and saved-data round trips.

## Browser walkthrough

The production build was served over HTTP and exercised in headless Chromium **153.0.8010.0**.

Passed:

- Empty initial shelf state, zero score/time and no life icons.
- Starting creates six usable ingredient cards.
- Fairy Dust plus Caustic Acid displays 22 / 23 / 34, with corresponding marker positions on signed bars.
- A successful brew awards 200 points and consumes stock permanently.
- Pause hides and makes the game field inert, freezes duration and resumes correctly.
- The hidden-tab visibility handler opens Pause (tested by dispatching a visibility-change event with hidden state).
- Four additions lock the shelf; failed brewing removes one life.
- Depleted ingredient cards stay disabled and lose their icon.
- Time expiry opens Game Over, invalid names show an error, and a valid result saves once.
- A leaderboard score survives reload.
- Canceling Clear preserves scores; confirming Clear persists an empty list.
- Malformed localStorage is handled without an uncaught exception.
- No horizontal page overflow in menu or active-game states at **375, 390, 600, 768, 900, 1024, 1440 and 1920 px** widths.
- Desktop (1440 px) and narrow-screen (375 px) screenshots were visually inspected.
- Exit restores the empty start state; Help opens correctly.
- Keyboard activation preserves useful focus after depleted cards, full capacity, brewing, Resume and Exit.
- The urgent timer pulse stops while paused.
- No uncaught JavaScript errors occurred during this walkthrough.

These checks used deterministic randomness and a controlled browser clock in the test harness only. Production code uses normal `Math.random()` and `Date.now()`.

## Prior Git-hook checks (16 October 2026)

- The commit-msg script accepted `feat: add ingredient shelf`.
- It rejected an invalid message with a nonzero exit status.
- The pre-push script stopped after simulated lint failure.
- It stopped after simulated formatting failure.
- It completed lint, formatting and type checking when all simulated checks passed.

The unchanged hook scripts were checked with the earlier package; these hook checks were not rerun on 17 October. Those tests ran the hook scripts directly with isolated temporary inputs. No real commit or push was performed. Husky activation in your own repository still depends on installing dependencies there; a source ZIP has no Git history.

## Limits and remaining delivery steps

- The current Windows working directory and any unpushed user changes were not accessed. The baseline was the remote `story-2` commit `36522ac`.
- This is a browser-tested source package, not a public deployment or RS App submission.
- Testing in headless Chromium does not replace a final check in your installed Chrome, on your actual phone and in your hosting environment.
- Only the basic Level 1 game is claimed. Difficulty changes, unfinished-run saves, reactions, tooltips, drag-and-drop, Pour Out and custom shortcuts remain later work.
- The unresolved 120/150-second time-cap contradiction is documented in README and IMPLEMENTATION.md; this build uses 150 seconds.
- Final PR screenshot, deployment URL, actual deadline, self-assessment and unmerged submission PR remain to be completed by the author.
