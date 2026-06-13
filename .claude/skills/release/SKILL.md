---
name: release
description: Bump the game's version and record what changed. Use when the user wants to "release", "ship", "publish", "make a new version", "bump the version", or finish up a batch of changes. Updates package.json and the in-game changelog.
---

# Cut a new version

The version is shown on the title screen and in the in-game **Change Log**
screen. There are exactly two places to update, and they must agree.

## Steps

1. **Pick the new version number** (semver `MAJOR.MINOR.PATCH`). Look at the
   current `version` in `package.json` and bump:
   - **patch** (0.13.0 → 0.13.1) — bug fixes, balance tweaks, new items/enemies
   - **minor** (0.13.0 → 0.14.0) — new feature (new screen or mechanic)
   - **major** (0.13.0 → 1.0.0) — changes that break old saved games

   If unsure, summarize what changed and suggest a bump for the user to confirm.

2. **Update `package.json`** — change the `version` field. This is the single
   source of truth; nothing else stores the number.

3. **Add a changelog entry** at the **top** of the `CHANGELOG` array in
   `src/ui/screens/menu.ts` (newest first), matching the existing shape:

   ```ts
   {
     version: "0.13.1", date: "2026-06-13", notes: [
       "Added a new enemy: Mega Destroyer (level 8 boss)",
       "Balanced the Sword to cost less energy",
     ],
   },
   ```
   - Use **today's date** in `YYYY-MM-DD`.
   - Write `notes` as short, player-facing bullet points — what a kid would
     notice, not code details.

4. **Verify:** run `npm test`, then **playtest** (use the `playtest` skill):
   start `npm run dev`, open the game, and confirm the title screen shows the new
   version and the Change Log screen lists your new entry at the top. Screenshot
   it for the user.

5. **Tell the user** the new version number and the headline changes.

## Notes

- Don't bump for trivial in-progress edits — release when a batch of changes is
  done and playtested.
- The `version` in `package.json` and the top `CHANGELOG` entry must match, or
  the Change Log won't mark the current version as "(current)".
- This skill does not push to GitHub. If the user wants that, that's a separate
  step (and GitHub auth may need setting up first).
