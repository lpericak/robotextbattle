---
name: play
description: Open Robot Battle so the user can play or test it. Use whenever the user asks to play, test, run, start, open, launch, or "try" the game, or says things like "let me play", "I want to play", "can I see it", "open the game", "boot it up". Ensures the dev server is running and opens the game in the browser via the Playwright MCP.
---

# Play / open the game

When the user wants to play or test the game, get it on screen for them with as
little fuss as possible. Two parts: make sure the dev server is up, then open the
game in the browser using the Playwright MCP tools.

## Steps

1. **Check if the dev server is already running** on port 5555:

   ```bash
   curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5555/
   ```

   - `200` → it's already running, skip to step 3.
   - anything else (connection refused / no output) → start it in step 2.

2. **Start the dev server in the background** (so it keeps running and you can
   keep working):

   ```bash
   npm run dev
   ```

   Run it as a background process, then wait ~2-3 seconds and re-check with the
   curl above until you get `200`. The game serves at http://127.0.0.1:5555/.

3. **Open the game in the browser with the Playwright MCP tools.** Use the
   `mcp__playwright__*` tools (configured in `.mcp.json`):
   - `browser_navigate` → http://127.0.0.1:5555/
   - `browser_snapshot` (and/or `browser_take_screenshot`) so the user can see
     the game. Show them the title screen.

4. **Hand it over / drive it.** If the user just wants to play, leave the game
   open and let them tell you what to click — then use `browser_click` /
   `browser_type` on their behalf (choices are `data-testid="choice-<value>"`,
   text entry is `data-testid="text-input"` then Enter). If they wanted to test a
   specific change, click through to that part and confirm it looks right (see
   the `playtest` skill for what to verify per kind of change).

## If the Playwright MCP tools aren't available

The `mcp__playwright__*` tools load when a Claude session starts in this repo,
after a one-time approval prompt. If you don't see them in the current session:
- Tell the user (in plain words) they need to approve the "Playwright" tool when
  Claude asks, or restart Claude in this folder once so it loads.
- As a fallback so they're not blocked, you can still confirm the game runs:
  with the dev server up, launch Chromium via the installed `playwright`
  package's browser API from a small Node script, read the page, and report /
  screenshot what you see.

## Keep it kid-friendly

The person playing may be a kid. Keep messages short and plain ("The game's
open — click a slot to start a new game!"). Don't dump technical output on them.

## Cleanup

If you started the dev server just to show something quickly and you're done,
you can stop it. If the user is actively playing, leave it running.
