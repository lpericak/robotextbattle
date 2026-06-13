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

## How to open the game

The game lives at **http://localhost:5173/** — bookmark that link in your
browser to jump straight to it.

**The catch:** that link only works while the game is *running*. The game runs
when `npm run dev` is going (or when you ask Claude to **"Play"**, which starts
it for you). So the routine is:

1. Ask Claude to **"Play"** (or run `npm run dev` yourself). This starts the
   game server.
2. Open the bookmark — **http://localhost:5173/** — and play.

If you click the bookmark and the page says it *can't connect*, the game just
isn't running yet. Ask Claude to "Play" and try the bookmark again.

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
