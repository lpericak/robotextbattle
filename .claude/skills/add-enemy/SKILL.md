---
name: add-enemy
description: Add a new enemy robot to Robot Battle. Use when the user wants a new opponent, monster, boss, or robot to fight (e.g. "add a robot called X", "make a new enemy", "I want to fight a dragon-bot"). Edits src/data/enemies.json and playtests it.
---

# Add an enemy robot

Enemies are defined entirely in `src/data/enemies.json`. No code changes needed.

## Steps

1. **Get the basics from the user** (ask briefly if missing): the enemy's name,
   roughly how tough it should be (which decides its `level`), and any flavor
   (what it looks like, its story). Keep it fun — this game is for kids.

2. **Check the building blocks exist.** An enemy's `weapons` and `gear` must
   already exist in `src/data/items.json` (referenced by exact name). If the
   user wants a brand-new weapon, add it first with the `add-item` skill.

3. **Add an entry** to the `enemies` object in `src/data/enemies.json`, matching
   the shape of existing entries:

   ```json
   "Mega Destroyer": {
     "level": 8,
     "weapons": ["Sword", "Sawed-off Shotgun"],
     "gear": ["Steel Armor", "Big Battery"],
     "consumables": [],
     "reward": 400,
     "expReward": 8,
     "description": "A towering war machine that shakes the arena floor.",
     "appearance": "Three meters of welded scrap with glowing red eyes...",
     "backstory": "Used to be a vending machine. Holds a grudge.",
     "challengeName": "The Annihilator"
   }
   ```

   Field guide:
   - `level` — difficulty. The Fight menu tags it Easy/Fair/Hard/Deadly relative
     to the player's level, and `reward`/`expReward` should scale with it (look
     at neighboring enemies for sensible numbers).
   - `weapons`, `gear` — arrays of names that exist in `items.json`. `consumables`
     is usually `[]`.
   - `reward` (money) and `expReward` (XP) — compare to similar-level enemies.
   - `description` (short), `appearance` (flavor for the detail screen),
     `backstory` (fun lore), `challengeName` (alternate name in challenge mode).

4. **Keep it valid JSON** — no trailing comma after the last entry.

5. **Verify:** run `npm test` (this includes `data.test.ts`, which validates the
   data files). Then **playtest** — start `npm run dev` and use the Playwright
   MCP browser tools to open the game, go to Fight, and confirm the new enemy
   appears in the list and its detail screen looks right. Use the `playtest`
   skill. Take a screenshot to show the user.

6. **Tell the user in plain words** what you added and that it showed up in the
   Fight menu.

7. **Bump the version.** A new enemy is a change to the game itself, so invoke
   the `bump-version` skill (a patch bump) to update the version and patch notes
   automatically — don't wait to be asked.

## Notes

- Balance: a brand-new enemy that's way stronger or weaker than its level
  suggests will feel unfair. Mirror the stats of existing enemies at that level.
