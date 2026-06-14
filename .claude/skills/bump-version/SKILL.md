---
name: bump-version
description: Automatically bump the game's version and write patch notes whenever the GAME ITSELF changes — a new/edited enemy, item, weapon, balance tweak, new mechanic or screen, or any gameplay behavior change. Invoke this PROACTIVELY at the end of any such change WITHOUT being asked (e.g. after "make my bow do 900 damage", "add a robot", "make the sword cheaper"). Do NOT wait for the user to say "release" or "bump the version". Skip only for non-gameplay changes (dev server, build config, docs, tests, skills).
---

# Auto-bump the version + write patch notes

This runs **automatically** after any change to the game itself. Lucas should
never have to ask for it — if you just changed how the game plays, you bump the
version as part of finishing the job.

## When to run (and when not to)

**Run it** when the change affects what a player sees or how the game plays:
- new or edited enemy / item / weapon / gear / consumable (`src/data/*.json`)
- balance tweaks (damage, cost, level, stats)
- new mechanic, screen, or rule (`src/engine/**`, `src/ui/**`)

**Skip it** for changes that aren't "the game itself":
- dev server / hosting / ports, build config, CI
- docs (README, CLAUDE.md), tests, or `.claude/` skills & hooks

If you're unsure whether a change is player-facing, lean toward bumping — a stray
patch note is harmless; a missing one means the changelog drifts from reality.

## Steps

1. **Pick the bump** from the current `version` in `package.json` (semver
   `MAJOR.MINOR.PATCH`):
   - **patch** (0.13.0 → 0.13.1) — new item/enemy, balance tweak, bug fix.
   - **minor** (0.13.0 → 0.14.0) — a new feature: a new screen or mechanic.
   - **major** (0.13.0 → 1.0.0) — anything that **breaks old saved games**
     (changed save format/keys). When in doubt about saves, see `src/engine/save.ts`.

   Decide automatically; don't ask Lucas unless it's genuinely ambiguous between
   minor and major (i.e. saves might break).

2. **Update `package.json`** — set the `version` field. This is the single
   source of truth for the number.

3. **Add a changelog entry** at the **top** of the `CHANGELOG` array in
   `src/ui/screens/menu.ts` (newest first), matching the existing shape:

   ```ts
   {
     version: "0.13.1", date: "2026-06-14", notes: [
       "New weapon: the Bow (needs Arrows as ammo)",
       "New enemy: Dud Bot — a big punching bag with a tiny stick",
     ],
   },
   ```
   - Use **today's date** in `YYYY-MM-DD`.
   - `notes` are short, **player-facing** bullets — what a kid would notice
     ("the Bow now hits way harder!"), not code details.
   - The `version` here **must equal** `package.json`, or the Change Log won't
     tag it "(current)".

4. **Validate:** run `npm test` (stays green), then quickly confirm in the
   browser (Playwright MCP, or the `playtest` skill) that the title screen shows
   the new version and the Change Log lists the new entry on top.

5. **Commit & push** (this repo works directly on `main`, commit/push often):
   `git add -A && git commit -m "Release vX.Y.Z: <headline>" && git push`.

6. **Tell Lucas in plain words**: the new version number and the headline change.

## Notes

- One bump can cover one coherent change. If Lucas asks for several things in a
  row, it's fine to bump once at the end with all the notes.
- A `PostToolUse` hook (`.claude/hooks/gameplay-version-reminder.mjs`) nudges you
  to run this after editing gameplay files — it's a safety net, not a substitute
  for invoking the skill.
