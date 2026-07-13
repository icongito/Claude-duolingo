/**
 * Self-hosts the Monaco editor's AMD bundle under public/ so the code-step
 * editor never depends on the jsdelivr CDN being reachable. Regenerated on
 * every `pnpm install` via the postinstall script — the copied folder is
 * gitignored, not committed.
 */
import { cpSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const monacoDir = path.dirname(require.resolve("monaco-editor/package.json"));
const src = path.join(monacoDir, "min", "vs");
const dest = fileURLToPath(new URL("../public/monaco-editor/vs", import.meta.url));

cpSync(src, dest, { recursive: true });
console.log(`Copied Monaco editor assets to ${dest}`);
