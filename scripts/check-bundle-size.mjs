// Node
import fs from "node:fs";
import path from "node:path";

const DIST_ASSETS_DIR = "dist/assets";

// Gzip size budgets, in KB. The main entry chunk carries React, TanStack
// Query, React Hook Form, Zod, i18next, Zustand, axios, and React Router —
// deliberately given more headroom than a route-level lazy chunk.
const BUDGET_KB = {
  index: 200,
  default: 60,
};

if (!fs.existsSync(DIST_ASSETS_DIR)) {
  console.error(`${DIST_ASSETS_DIR} not found — run \`bun run build\` first.`);
  process.exit(1);
}

const gzFiles = fs
  .readdirSync(DIST_ASSETS_DIR)
  .filter((file) => file.endsWith(".js.gz"));

let failed = false;

for (const file of gzFiles) {
  const sizeKb = fs.statSync(path.join(DIST_ASSETS_DIR, file)).size / 1024;
  const budget = file.startsWith("index-")
    ? BUDGET_KB.index
    : BUDGET_KB.default;
  const overBudget = sizeKb > budget;

  if (overBudget) failed = true;

  console.log(
    `${overBudget ? "OVER BUDGET" : "OK".padEnd(11)} ${file.padEnd(40)} ${sizeKb.toFixed(1)}kb / ${budget}kb budget`
  );
}

if (failed) {
  console.error(
    "\nBundle size budget exceeded. Investigate with `ANALYZE=true bun run build` " +
      "(writes dist/stats.html) before raising a budget in scripts/check-bundle-size.mjs."
  );
  process.exit(1);
}

console.log("\nAll chunks within budget.");
