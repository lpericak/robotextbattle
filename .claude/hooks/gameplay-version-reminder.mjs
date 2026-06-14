#!/usr/bin/env node
// PostToolUse hook: when an Edit/Write/MultiEdit touches a GAMEPLAY file, remind
// Claude to bump the game version + patch notes (the `bump-version` skill) before
// finishing. This is the enforcement layer so it happens automatically, without
// Lucas having to ask.
//
// Safe by design: on any uncertainty it stays silent (exit 0, no output), so a
// schema change or odd input never blocks or spams the session.

import { readFileSync } from "node:fs";

function readStdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

let path = "";
try {
  const input = JSON.parse(readStdin() || "{}");
  const ti = input.tool_input ?? {};
  path = ti.file_path ?? ti.path ?? ti.notebook_path ?? "";
} catch {
  process.exit(0); // couldn't parse — say nothing
}

if (!path) process.exit(0);

// Normalize to a repo-relative-ish form for matching.
const p = path.replaceAll("\\", "/");

// Gameplay = the game itself. Content data + engine + UI screens.
const isGameplay =
  /\/src\/data\/.+\.json$/.test(p) ||
  /\/src\/engine\//.test(p) ||
  /\/src\/ui\//.test(p);

// Not "the game itself" — never remind for these even if under src or elsewhere.
const isExcluded =
  /\/tests?\//.test(p) ||
  /\/\.claude\//.test(p) ||
  /\/scripts\//.test(p) ||
  /\.(md|test\.ts|spec\.ts)$/.test(p) ||
  /(package\.json|package-lock\.json|tsconfig.*\.json|vite\.config\.|playwright\.config\.)/.test(p);

if (!isGameplay || isExcluded) process.exit(0);

const reminder =
  "You just edited a gameplay file (" +
  p.split("/src/")[1]?.replace(/^/, "src/") +
  "). Before finishing this turn, invoke the `bump-version` skill to bump the " +
  "version in package.json + add a player-facing patch note in " +
  "src/ui/screens/menu.ts (CHANGELOG), then commit & push. Do this automatically — " +
  "don't wait to be asked. Skip only if this change isn't player-facing.";

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      additionalContext: reminder,
    },
  }),
);
process.exit(0);
