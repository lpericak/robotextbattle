---
name: playtest
description: Run Robot Battle in a real browser and click through it to confirm a change works. Use after making any change, or when the user asks to "test it", "try it", "play it", "show me it working", or "does it work". Drives the game with the Playwright MCP browser tools.
---

# Playtest the game

The point of this skill is to *show* the change working in a real browser, not
just assert that it should. This is the verification half of every change.

## Steps

1. **Run the fast checks first:**
   - `npm test` — unit tests should be green.
   - If you changed TypeScript (not just JSON), also run `npm run build` to catch
     type errors.

2. **Start the dev server:** `npm run dev`. It serves at
   http://127.0.0.1:5555/. (Run it in the background so you can keep working.)

3. **Drive the browser with the Playwright MCP tools** (configured in
   `.mcp.json`). Navigate to http://127.0.0.1:5555/ and click through to whatever
   you changed. Useful facts about the UI:
   - The game is a "terminal" — choices are clickable elements with
     `data-testid="choice-<value>"`.
   - Text entry (like naming your robot) uses `data-testid="text-input"`, then
     press Enter.
   - To start clean, the e2e tests do: open page → `localStorage.clear()` →
     reload → pick a save slot → type a name → Enter.
   - Main-menu choices include `choice-fight`, `choice-shop`, `choice-upgrades`,
     `choice-bank`, `choice-settings`, `choice-quit`.

4. **Verify the specific change:**
   - New enemy → go to **Fight**, confirm it's in the list and its detail screen
     reads correctly.
   - New item → go to **Shop**, confirm it appears at the right level and is
     buyable.
   - Balance/combat change → start a fight and watch the numbers behave.

5. **Take a screenshot or snapshot** so the user can see it with their own eyes,
   and describe what you saw in plain words.

## If the Playwright MCP tools aren't available

They load from `.mcp.json` when a Claude session starts in this repo, after a
one-time approval. If they're missing in the current session, tell the user the
Playwright MCP needs approving/restarting, and meanwhile fall back to a quick
headless check: with the dev server running, you can launch Chromium via the
installed `playwright` package's browser API from a small Node script to read the
page text and confirm it loads without console errors.

## Cleanup

Stop the background dev server when you're done.
