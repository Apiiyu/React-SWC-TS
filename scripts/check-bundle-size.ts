/**
 * @description Enforces gzip budgets for production JavaScript chunks. The entry chunk receives
 * more headroom because it carries shared application dependencies; route chunks stay smaller so
 * lazy loading remains meaningful.
 */

// Node Libraries
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @description Directory containing the compressed production assets.
 */
const DIST_ASSETS_DIR = 'dist/assets';

/**
 * @description Gzip budgets in kilobytes for the entry chunk and lazy route chunks.
 */
const BUDGET_KB = {
  default: 60,
  index: 200,
} as const;

/**
 * @description Reads compressed JavaScript assets and returns their size in kilobytes.
 */
function readGzipFiles(): readonly string[] {
  return readdirSync(DIST_ASSETS_DIR).filter((file) => file.endsWith('.js.gz'));
}

/**
 * @description Returns the budget that applies to one generated asset name.
 *
 * @param file The generated compressed asset name.
 */
function budgetFor(file: string): number {
  return file.startsWith('index-') ? BUDGET_KB.index : BUDGET_KB.default;
}

/**
 * @description Checks all compressed JavaScript files and exits non-zero when a budget is exceeded.
 */
function main(): void {
  const files = readGzipFiles();
  let failed = false;

  for (const file of files) {
    const sizeKb = statSync(join(DIST_ASSETS_DIR, file)).size / 1024;
    const budget = budgetFor(file);
    const overBudget = sizeKb > budget;

    if (overBudget) {
      failed = true;
    }

    console.log(
      `${overBudget ? 'OVER BUDGET' : 'OK'.padEnd(11)} ${file.padEnd(40)} ${sizeKb.toFixed(1)}kb / ${budget}kb budget`,
    );
  }

  if (failed) {
    console.error(
      '\nBundle size budget exceeded. Investigate with `ANALYZE=true bun run build` ' +
        '(writes dist/stats.html) before raising a budget in scripts/check-bundle-size.ts.',
    );
    process.exit(1);
  }

  console.log('\nAll chunks within budget.');
}

main();
