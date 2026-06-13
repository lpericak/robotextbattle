---
name: add-item
description: Add a new weapon, gear, or consumable to Robot Battle. Use when the user wants a new weapon, armor, battery, upgrade item, potion, healing item, ammo, or anything buyable in the shop (e.g. "add a laser gun", "make a stronger armor", "add a healing potion"). Edits src/data/items.json and playtests it.
---

# Add an item (weapon / gear / consumable)

All items live in `src/data/items.json`, split into three sections: `weapons`,
`gear`, and `consumables`. Add the new item under the right section, matching the
shape of existing entries. No code changes needed.

First figure out which kind of item the user means:
- **Weapon** — something the robot attacks with (sword, gun, laser).
- **Gear** — passive equipment that boosts stats (armor, battery, chip). Also
  includes **ammo** (stackable, consumed when a weapon fires).
- **Consumable** — a single-use item (repair kit, grenade) used during a fight.

## Weapon

```json
"Laser Cannon": {
  "level": 6,
  "damage": 18,
  "moneyCost": 450,
  "energyCost": 6,
  "accuracy": 95,
  "hands": 2,
  "description": "Fires a searing beam. Needs two hands and a lot of power."
}
```
- `level` — the player level needed to buy it in the shop.
- `damage`, `energyCost`, `accuracy` (hit chance vs dodge), `hands` (1 or 2 —
  the robot has limited hands), `moneyCost`.

## Gear (stat boosts and armor)

```json
"Diamond Armor": {
  "level": 15,
  "moneyCost": 5000,
  "healthBonus": 80,
  "defenceBonus": 12,
  "category": "Armor",
  "description": "Nearly indestructible. Very shiny."
}
```
Bonus fields are optional — include only the ones that apply:
`healthBonus`, `defenceBonus`, `attackBonus`, `energyBonus`, `dodgeBonus`,
`handsBonus`, `moneyBonus` (percent more money from wins). `category` is a label
like `"Armor"`, `"Battery"`, `"Chip"`. Gear does **not** stack (one of each).

Ammo is gear that's stackable and tied to a weapon:
```json
"Plasma Cell": {
  "level": 6, "moneyCost": 40, "stackable": true, "maxStack": 60,
  "category": "Ammo", "description": "Ammo for the Laser Cannon. Max 60."
}
```

## Consumable

```json
"Mega Repair Kit": {
  "level": 5,
  "moneyCost": 80,
  "healthRestore": 30,
  "maxStack": 10,
  "useText": "You slap on a Mega Repair Kit and patch up fast!",
  "description": "Restores a big chunk of health. Max 10."
}
```
Common effect fields: `healthRestore`, damage effects, or dodge reduction — copy
the closest existing consumable for the exact field names.

## Steps

1. Decide weapon vs gear vs consumable; ask the user for anything missing.
2. Add the entry under the right section, matching existing shape. Keep numbers
   in line with similar-level items so the shop stays balanced.
3. **Valid JSON** — no trailing comma after the last entry in a section.
4. Run `npm test` (validates `items.json` via `data.test.ts`).
5. **Playtest** with the `playtest` skill: `npm run dev`, then use Playwright MCP
   to open the game, enter the Shop, and confirm the item appears (at the right
   level) and can be bought. Screenshot it for the user.
6. Explain in plain words what you added and where it shows up.

If a new weapon needs ammo, add both the weapon and its ammo gear.
