/**
 * @description Keeps the public starter documentation synchronized with package scripts, pinned
 * versions, and the Bun-only workflow. It deliberately checks only user-facing documents rather
 * than historical session artifacts or the ISA's baseline evidence.
 */

// Node Libraries
import { readFileSync } from 'node:fs';
import process from 'node:process';

/**
 * @description User-facing documents that must not drift from the current starter contract.
 */
const DOCUMENTS: readonly string[] = [
  'README.md',
  'CONTRIBUTING.md',
  'CLAUDE.md',
  'AGENTS.md',
  'AGENT_RULES.md',
  '.changeset/dx-perf-workflow-habits.md',
  '.github/ISSUE_TEMPLATE/bug_report.yml',
];

/**
 * @description Reads one repository file.
 *
 * @param file The repository-relative document path.
 */
function readDocument(file: string): string {
  return readFileSync(file, 'utf8');
}

/**
 * @description Finds stale commands or version claims in the documented workflow.
 */
function findDrift(): string[] {
  const findings: string[] = [];
  const packageJson = JSON.parse(readDocument('package.json')) as {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    packageManager: string;
  };
  const readme = readDocument('README.md');

  for (const file of DOCUMENTS) {
    const content = readDocument(file);

    for (const stale of ['bun start:dev', 'bun generate:module', '8.1.5', '19.2.7', '10.5.2']) {
      if (content.includes(stale)) {
        findings.push(`${file} contains stale claim: ${stale}`);
      }
    }
  }

  const expectedVersions = [
    ['Vite', packageJson.devDependencies.vite],
    ['React', packageJson.dependencies.react],
    ['TypeScript', packageJson.devDependencies.typescript],
  ] as const;

  for (const [name, version] of expectedVersions) {
    if (!readme.includes(version)) {
      findings.push(`README.md does not mention ${name} ${version}`);
    }
  }

  const packageManagerVersion = packageJson.packageManager.split('@').at(-1);

  if (packageManagerVersion === undefined || !readme.includes(packageManagerVersion)) {
    findings.push(`README.md does not document ${packageJson.packageManager}`);
  }

  return findings;
}

/**
 * @description Entry point that fails closed when documented commands or versions drift.
 */
function main(): void {
  const findings = findDrift();

  if (findings.length === 0) {
    return;
  }

  process.stderr.write(
    `Documentation check failed with ${findings.length} finding(s):\n${findings
      .map((finding) => `  ${finding}`)
      .join('\n')}\n`,
  );
  process.exit(1);
}

main();
