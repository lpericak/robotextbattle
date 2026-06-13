# Robot Battle — Claude guide

A turn-based robot fighting game that runs in a web browser. Terminal aesthetic
(green text on black), clickable choices, plays on desktop and mobile. Built in
TypeScript with Vite. This repo was extracted from a larger monorepo to be a
simple, standalone project.

## Who you're working with

The main person you'll help here is **Lucas** — he's a kid and **not a
programmer**. He drives changes by describing what he wants in plain language
("add a robot called Mega Destroyer", "make the Sword cost less"). Your job is
to turn that into code changes and *show him it worked*.

Because he can't read the code to catch a misunderstanding:
- **Confirm scope before doing big or destructive things.** If a request is
  vague or could mean several things, ask one short clarifying question first.
- **Explain what you did in plain English**, not jargon. ("I added a new robot
  called Mega Destroyer that shows up in the Fight menu" — not "patched
  enemies.json".)
- **Always playtest a change** so he can see it working (see *The loop* below).
- Don't break existing saved games or tests.

## The loop (most important part)

Every change should go through this loop so Lucas sees it actually work:

1. **Make the change** (usually editing a JSON file — see *Adding content*).
2. **Run the unit tests:** `npm test` — should stay green (130+ tests).
3. **Playtest it in a real browser** using the Playwright MCP tools:
   - Start the dev server: `npm run dev` (serves at http://127.0.0.1:5173/).
   - Use the Playwright MCP browser tools to open that URL, click through to the
     thing you changed, and confirm it looks right. Take a snapshot/screenshot
     so Lucas can see it.
4. **Tell Lucas what changed**, in plain words.

The Playwright MCP server is already configured for this repo (`.mcp.json`), so
those browser tools are available to you automatically. The terminal renders
clickable choices with `data-testid="choice-<value>"` and text input with
`data-testid="text-input"` — handy selectors when driving the browser.

## Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the game locally at http://127.0.0.1:5173/ |
| `npm test` | Run unit tests (vitest) — fast, run after every change |
| `npm run build` | Type-check + production build into `dist/` |
| `npm run test:e2e` | Playwright browser tests (needs Node ≥18.19 — see *Gotchas*) |

## Git — you handle it, commit and push often

Lucas does **not** use Git, so version control is entirely your responsibility.
For this repo the rules are simple:

- **Work directly on `main`. Do not create branches.** There is no merge
  protection and no PR review — branching just adds steps Lucas can't operate.
- **Commit often** — after each working, playtested change. Small, frequent
  commits with clear plain-English messages (e.g. "Add Mega Destroyer enemy").
- **Push to `main` right after committing** (`git push`), so his work is saved
  to GitHub. Don't leave changes sitting uncommitted.
- Only commit changes that pass `npm test` and that you've playtested.

This is a deliberate, durable instruction from the repo owner for this repo —
you don't need to ask before committing or pushing here.

## How the game is built

```
src/
  engine/     Pure TypeScript game logic. NO browser/DOM code. All state is
              plain JSON-serializable objects. This is where combat math,
              shop rules, leveling, saving, and AI live.
  ui/         The browser layer — renders the terminal, screens, sound.
    screens/  One file per screen (menu, battle, shop, bank, upgrades, settings)
    terminal.ts / terminal.css   The terminal renderer + styling
  data/       *** Game content as JSON — start here for most changes ***
    enemies.json    Every enemy robot
    items.json      Weapons, gear, consumables
    facts.json      "Did you know?" educational facts shown after fights
    config.json     Starting stats and money
spec/         Design docs written before features were built. Good context.
tests/
  unit/       Fast logic tests (vitest)
  e2e/        Browser tests (Playwright)
```

**Design principle:** the engine is pure functions on plain objects, kept
separate from the UI. Combat uses a seedable RNG so tests are deterministic.
See [spec/engine.md](spec/engine.md) and [spec/game-design.md](spec/game-design.md)
for the full design — read them before changing combat or progression.

## Adding content (the easy wins)

Most of what Lucas will want is **new content**, and almost all content lives in
JSON files — no real coding needed. Enemies reference weapons and gear *by
name*, so anything you give an enemy must already exist in `items.json`.

There are skills that walk through the common cases — prefer them:
- **`add-enemy`** — add a new enemy robot to `enemies.json`
- **`add-item`** — add a weapon, gear, or consumable to `items.json`
- **`release`** — bump the version and add a changelog entry
- **`playtest`** — run and drive the game to confirm a change works

If you're editing JSON by hand, match the shape of existing entries exactly and
keep it valid JSON (no trailing commas). After any content edit, run `npm test`
— `tests/unit/data.test.ts` validates the data files.

## Versioning

The version lives in **one place**: `version` in `package.json`. It shows on the
title screen and in the in-game Change Log. When you ship something meaningful,
bump it and add a matching entry to the `CHANGELOG` array in
`src/ui/screens/menu.ts`. Use the `release` skill. Semver:
- **patch** — bug fixes, balance tweaks, new items/enemies
- **minor** — new features (new screen/mechanic)
- **major** — changes that break old saved games

## Gotchas

- **Don't rename save keys.** Saved games live in browser `localStorage` under
  keys starting with `robot-battle-save-` and `robot-battle-sound`. Changing
  these wipes everyone's progress.
- **Keep old saves loading.** If you change the save format, bump the save
  `version` and handle migration (see `src/engine/save.ts`), don't just break it.
- **Node version:** this machine has Node 18.16, but `npm run test:e2e`
  (Playwright's test runner) needs ≥18.19 to load its config. Unit tests, the
  build, and `npm run dev` all work fine on 18.16. To run e2e here, use a newer
  Node, or just playtest manually via the Playwright MCP browser tools instead.
- **This is a standalone copy.** The original lives in a monorepo; don't try to
  reach outside this folder for shared packages — there aren't any.
