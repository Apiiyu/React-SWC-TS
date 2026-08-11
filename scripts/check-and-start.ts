/**
 * @description Runs the strict development lint gate before starting Vite. This keeps the local
 * development entrypoint aligned with CI and avoids relying on a globally resolved npm command.
 */
// Chalk

// Node Libraries
import { execFileSync } from 'node:child_process';

// Third Party Libraries
// Third Party Libraries
import chalk from 'chalk';

/**
 * @description Runs the local Bun executable with inherited terminal output.
 *
 * @param args Arguments passed to Bun.
 */
function runBun(args: readonly string[]): void {
  execFileSync('bun', args, { stdio: 'inherit' });
}

/**
 * @description Validates the source and starts the Vite development server only when validation
 * succeeds.
 */
function main(): void {
  try {
    console.log(chalk.blue('Running strict lint...'));
    runBun(['run', 'lint:check']);
    console.log(chalk.green('Lint passed. Starting the app...'));
    runBun(['x', 'vite']);
  } catch {
    console.error(chalk.red('Lint failed. Fix the issues before starting the app.'));
    process.exitCode = 1;
  }
}

main();
