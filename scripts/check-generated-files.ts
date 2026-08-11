/**
 * @description Verifies that auto-import declarations have one canonical destination and that
 * the generated ESLint globals are synchronized with the declaration file emitted by Vite.
 * Running this after the build catches stale generated files without adding another generator.
 */

// Node Libraries
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

/**
 * @description Reads a UTF-8 file relative to the repository root.
 *
 * @param file The repository-relative path.
 */
function readProjectFile(file: string): string {
  return readFileSync(resolve(file), 'utf8');
}

/**
 * @description Returns a stable list of drift findings for generated auto-import artifacts.
 */
function findDrift(): string[] {
  const findings: string[] = [];
  const canonicalPath = 'src/app/types/auto-imports.d.ts';
  const stalePath = 'src/auto-imports.d.ts';
  const eslintPath = '.eslintrc-auto-import.json';

  if (!existsSync(resolve(canonicalPath))) {
    findings.push(`${canonicalPath} is missing`);
  }

  if (existsSync(resolve(stalePath))) {
    findings.push(`${stalePath} is a duplicate generated declaration`);
  }

  if (!existsSync(resolve(eslintPath))) {
    findings.push(`${eslintPath} is missing`);
    return findings;
  }

  if (!existsSync(resolve(canonicalPath))) {
    return findings;
  }

  const generated = readProjectFile(canonicalPath);
  const manifest = JSON.parse(readProjectFile(eslintPath)) as {
    globals?: Record<string, boolean>;
  };
  const globals = manifest.globals ?? {};
  const declarations = new Set(
    [...generated.matchAll(/\bconst\s+([A-Za-z_$][\w$]*)\s*:/g)].map((match) => match[1]),
  );

  for (const name of Object.keys(globals)) {
    if (!declarations.has(name)) {
      findings.push(`${eslintPath} declares ${name}, but ${canonicalPath} does not`);
    }
  }

  for (const name of declarations) {
    if (globals[name] !== true) {
      findings.push(`${canonicalPath} declares ${name}, but ${eslintPath} does not`);
    }
  }

  const viteConfig = readProjectFile('vite.config.ts');
  const vitestConfig = readProjectFile('vitest.config.ts');
  const expectedDirectory = 'src/app/constants';

  if (!viteConfig.includes(expectedDirectory) || !vitestConfig.includes(expectedDirectory)) {
    findings.push('Vite and Vitest auto-import directory configuration is out of sync');
  }

  if (!viteConfig.includes('src/app/types/auto-imports.d.ts')) {
    findings.push('Vite does not target the canonical auto-import declaration path');
  }

  if (!viteConfig.includes('eslintrc:') || !viteConfig.includes('enabled: true')) {
    findings.push('Vite does not emit the ESLint auto-import manifest');
  }

  return findings;
}

/**
 * @description Entry point that fails closed when generated auto-import surfaces drift.
 */
function main(): void {
  const findings = findDrift();

  if (findings.length === 0) {
    return;
  }

  process.stderr.write(
    `Generated-file check failed with ${findings.length} finding(s):\n${findings
      .map((finding) => `  ${finding}`)
      .join('\n')}\n`,
  );
  process.exit(1);
}

main();
