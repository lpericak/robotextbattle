# Robot Battle

A turn-based robot fighting game that runs in your web browser. Name your robot,
buy weapons and gear from the shop, then battle increasingly tough enemies to
earn money and level up. Terminal style — green text on black — and it works on
desktop and phones.

## Play it locally

You need [Node.js](https://nodejs.org/) installed. Then:

```bash
npm install        # one time, installs the tools the game needs
npm run dev        # starts the game
```

Open the link it prints (http://127.0.0.1:5173/) in your browser.

## Making changes

This project is set up so you can change the game by **talking to Claude** — you
describe what you want, Claude makes the change and shows you it working in the
browser. See [CLAUDE.md](CLAUDE.md) for how that works, and the skills in
`.claude/skills/` for common changes like adding a new robot or weapon.

Most of the game's content (enemies, weapons, gear) lives as simple data files
in [`src/data/`](src/data/), so adding new stuff usually doesn't require real
coding.

## Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Play the game locally |
| `npm test` | Run the tests (do this after changes) |
| `npm run build` | Build the final version for the web |

## How it's organized

- `src/engine/` — the game's brain (combat, shop, leveling) — pure logic, no UI
- `src/ui/` — the screens you see and click
- `src/data/` — game content as JSON (enemies, items, facts)
- `spec/` — design notes describing how the game is meant to work
- `tests/` — automated tests that check the game still works

See [CLAUDE.md](CLAUDE.md) for the full guide.
