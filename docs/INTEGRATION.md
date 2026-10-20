# Integrating Story 2

Author: **Gafursz**

The ZIP contains a complete source snapshot in `alchemists-cauldron-story-2/`. Test it in a separate extracted folder before copying into your existing repository. Keep your existing `.git` directory. Do not replace the whole repository folder or copy generated `dist/`, `node_modules/` or `.test-build/` into a commit.

Your recent terminal output showed formatting changes on the local `story-2` branch. Inspect and preserve those before copying. This package adds LF configuration but cannot inspect unpushed Windows changes.

## 1. Inspect your working tree

```bash
cd /c/Users/User/Desktop/alchemists-cauldron
git status
git diff
```

| Command                                        | Meaning and expected result                                | Git impact / mistakes to avoid                                                                             |
| ---------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `cd /c/Users/User/Desktop/alchemists-cauldron` | Changes Git Bash's current folder to your original project | No file edits; do not run later Git commands in the extracted ZIP by mistake                               |
| `git status`                                   | Shows the branch and staged/unstaged/untracked changes     | Read-only; it should identify `story-2` or tell you which branch you are on                                |
| `git diff`                                     | Shows unstaged line-by-line changes                        | Read-only; staged changes require `git diff --cached`; do not assume formatting changes are the only edits |

If there are changes, review them and preserve them using your existing commit/stash workflow before switching branches or copying files. Avoid `git reset --hard`, `git clean`, or blindly overwriting unreviewed work. This guide deliberately does not discard or commit unknown changes for you.

## 2. Create a feature branch from clean Story 2

Once your working tree is clean:

```bash
git switch story-2
git pull --ff-only origin story-2
git switch -c feat/level-1-game
```

| Command                             | Meaning and expected result                                                          | Git impact / mistakes to avoid                                                                                              |
| ----------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `git switch story-2`                | Makes local `story-2` the active branch                                              | Changes checked-out files; inspect local changes first                                                                      |
| `git pull --ff-only origin story-2` | Fetches remote Story 2 and advances local Story 2 only when history can fast-forward | Updates local history without a merge commit; if it rejects divergent history, investigate rather than force-resetting      |
| `git switch -c feat/level-1-game`   | Creates and switches to a feature branch at the current commit                       | Adds a local branch, with no commit or push; if that name exists, inspect it and use `git switch feat/level-1-game` instead |

Copy source, configuration and documentation from the extracted folder into the original repository. Include the dotfiles `.gitattributes`, `.editorconfig`, `.prettierrc.json`, `.prettierignore`, `.gitignore`, `.github/` and the two `.husky/` hook scripts. Preserve `.git` and exclude generated folders.

## 3. Install, verify and inspect

```bash
npm ci
npm run format
npm run check
npm test
npm run dev
```

| Command          | Meaning and expected result                                        | Git impact / mistakes to avoid                                                                        |
| ---------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `npm ci`         | Installs exact lockfile dependencies and prepares Husky inside Git | Replaces local `node_modules`; does not create commits; use the ZIP's matching package and lock files |
| `npm run format` | Applies Prettier and LF line endings                               | Rewrites files; review the diff afterward                                                             |
| `npm run check`  | Runs TypeScript, lint, format check and production build           | Creates ignored build output; stop and fix any reported errors                                        |
| `npm test`       | Runs the included rule/storage tests                               | Creates ignored `.test-build`; successful output shows all tests passing                              |
| `npm run dev`    | Starts the local browser game                                      | No commits; open its URL and press Ctrl+C when finished                                               |

Use the browser to test Start, Brew, Pause, Help and Leaderboard. The README explains the rules.

```bash
git status
git diff --stat
git diff --check
git ls-files --eol README.md src/main.ts
```

| Command                                    | Meaning and expected result                                                                                 | Git impact                                                      |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `git status`                               | Lists precisely which tracked and new files will need review                                                | Read-only                                                       |
| `git diff --stat`                          | Summarizes sizes of tracked changes; untracked files are not included                                       | Read-only                                                       |
| `git diff --check`                         | Reports whitespace errors in the diff; no output means none found                                           | Read-only                                                       |
| `git ls-files --eol README.md src/main.ts` | Reports index/working-copy endings and attributes; after formatting expect `i/lf`, `w/lf` and LF attributes | Read-only; `i/lf` alone does not prove the working copy uses LF |

If existing tracked text still needs normalization, use `git add --renormalize .` only after reviewing all changes. `--renormalize` reapplies text attributes and stages tracked files, including their other modifications; it does not stage new untracked files. Do not use it blindly if you want separate commits.

## 4. Review author and commit coherent changes

```bash
git config user.name "Gafursz"
git config --get user.email
```

- `git config user.name "Gafursz"` sets the author name for this repository only. Future commits use it; old commits are unchanged. It does not set an email.
- `git config --get user.email` reads the configured author email. Use your own verified GitHub/noreply address if you need to configure it; do not copy an invented email. The package author field is not a Git author setting.

Use explicit paths with `git add <path>` to stage reviewed new files and `git add -p` to choose hunks from modified files. Staging prepares the next commit but does not save it to history. `git add -p` does not automatically include untracked files. Keep code/data/UI/docs changes in coherent commits, with working imports and passing checks.

`git diff --cached` displays exactly what is staged. `git commit -m "feat: add basic potion gameplay"` creates a commit from that staged content and invokes the commit-msg hook. Use a message that accurately describes your actual staged group. This ZIP is a snapshot; do not invent a past development history.

## 5. Push and create the feature PR

```bash
git push -u origin feat/level-1-game
```

This uploads the feature branch and sets its upstream tracking branch. Husky runs checks first; fix failures instead of bypassing them. The command publishes commits to GitHub but does not create or merge a PR.

Create the feature PR with **base `story-2`** and **compare `feat/level-1-game`**. Review and merge feature work into Story 2. When the milestone is ready, the **review PR is `story-2` → `story-1`**, and it stays unmerged. Story 3 is later created from Story 2. Use the correct final PR for your actual RS App submission; an intermediate feature PR is not the final submission.

## Still needed for delivery

Public hosting, its README/PR link, a screenshot, actual dates, self-assessment, and the appropriate RS App submission. No branch was pushed and no PR was opened by creating this ZIP.
