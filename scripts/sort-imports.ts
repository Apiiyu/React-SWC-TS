/**
 * @description Rewrites TypeScript and TSX import blocks into deterministic, labelled groups.
 * Labels are sorted A-Z, imports inside each group sort by module path and first binding, and
 * side-effect imports remain at the top because their position can affect runtime behavior.
 * `--check` reports drift without modifying files for CI and pre-commit use.
 */

// Node Libraries
import { globSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, relative, resolve } from 'node:path';
import process from 'node:process';

// TypeScript
import ts from 'typescript';

/**
 * @description Third-party package prefixes and their repository-facing import labels. Longer
 * prefixes are matched first so scoped packages can opt into a more specific group.
 */
const PACKAGE_LABELS: readonly (readonly [string, string])[] = [
  ['@hookform', 'React Hook Form'],
  ['@storybook', 'Storybook'],
  ['@tanstack', 'TanStack'],
  ['@testing-library', 'Testing'],
  ['@vitejs', 'Vite'],
  ['@vitest', 'Vitest'],
  ['axios', 'Axios'],
  ['fast-glob', 'Fast Glob'],
  ['i18next', 'i18n'],
  ['mitt', 'Mitt'],
  ['node:', 'Node Libraries'],
  ['react-dom', 'React'],
  ['react-i18next', 'i18n'],
  ['react-router-dom', 'React Router DOM'],
  ['react', 'React'],
  ['react-hook-form', 'React Hook Form'],
  ['typescript', 'TypeScript'],
  ['unplugin-auto-import', 'Vite'],
  ['vite-plugin', 'Vite'],
  ['vite', 'Vite'],
  ['zod', 'Zod'],
  ['zustand', 'Zustand'],
];

/**
 * @description File suffixes that communicate the responsibility of a local import.
 */
const SUFFIX_LABELS: Readonly<Record<string, string>> = {
  constant: 'Constants',
  constants: 'Constants',
  hook: 'Hooks',
  hooks: 'Hooks',
  helper: 'Helpers',
  helpers: 'Helpers',
  interface: 'Interfaces',
  interfaces: 'Interfaces',
  route: 'Routes',
  routes: 'Routes',
  router: 'Routers',
  schema: 'Schemas',
  schemas: 'Schemas',
  store: 'Stores',
  stores: 'Stores',
};

/**
 * @description Folder fallbacks for local paths whose filenames do not carry a responsibility
 * suffix.
 */
const FOLDER_LABELS: Readonly<Record<string, string>> = {
  app: 'App',
  assets: 'Assets',
  base: 'Components',
  components: 'Components',
  common: 'Components',
  constants: 'Constants',
  hooks: 'Hooks',
  i18n: 'i18n',
  interfaces: 'Interfaces',
  axios: 'Axios',
  errorHandler: 'Plugins',
  mitt: 'Mitt',
  modules: 'Modules',
  plugins: 'Plugins',
  reactQuery: 'TanStack',
  routes: 'Routes',
  schemas: 'Schemas',
  store: 'Stores',
  test: 'Testing',
  types: 'Types',
  views: 'Views',
};

/**
 * @description Lookup tables avoid inherited object properties being mistaken for labels.
 */
const SUFFIX_LABEL_LOOKUP = new Map(Object.entries(SUFFIX_LABELS));

/**
 * @description Lookup table for folder-based local import labels.
 */
const FOLDER_LABEL_LOOKUP = new Map(Object.entries(FOLDER_LABELS));

/**
 * @description Existing group headers that may use lowercase names or legacy wording. They are
 * removed before the canonical labels are emitted, while explanatory comments remain attached.
 */
const GROUP_HEADERS = new Set(
  [
    ...PACKAGE_LABELS.map(([, label]) => label),
    ...Object.values(SUFFIX_LABELS),
    ...Object.values(FOLDER_LABELS),
    'axios',
    'components',
    'helpers',
    'hooks',
    'i18n',
    'images',
    'mitt',
    'node',
    'plugins',
    'react hook form',
    'react router dom',
    'react query',
    'routes',
    'schemas',
    'store',
    'tanstack query',
    'unplugin libraries',
    'url',
    'vite libraries',
  ].map((label) => label.toLowerCase()),
);

/**
 * @description Detects local aliases and relative paths supported by the project.
 *
 * @param specifier The module specifier from an import declaration.
 */
function isLocalSpecifier(specifier: string): boolean {
  return specifier.startsWith('.') || specifier.startsWith('@/');
}

/**
 * @description Identifies group headers owned by this formatter while leaving explanatory
 * comments attached to their imports.
 *
 * @param line The complete comment line.
 */
function isGroupHeader(line: string): boolean {
  const header = line
    .trim()
    .replace(/^\/\/\s*/, '')
    .toLowerCase();

  return GROUP_HEADERS.has(header);
}

/**
 * @description Finds the semantic group label for a module specifier.
 *
 * @param specifier The module specifier from an import declaration.
 */
function labelFor(specifier: string): string {
  if (!isLocalSpecifier(specifier)) {
    const matches = PACKAGE_LABELS.filter(([prefix]) => specifier.startsWith(prefix)).sort(
      (a, b) => b[0].length - a[0].length,
    );

    return matches[0]?.[1] ?? 'Third Party Libraries';
  }

  const normalized = specifier.startsWith('@/') ? specifier.slice(2) : specifier;
  const file = basename(normalized).replace(/\.(tsx?|jsx?)$/, '');
  const suffix = file.split('.').at(-1);
  const bySuffix = suffix === undefined ? undefined : SUFFIX_LABEL_LOOKUP.get(suffix);

  if (bySuffix !== undefined) {
    return bySuffix;
  }

  const segments = normalized.split('/').filter((segment) => segment !== '.' && segment !== '..');
  const folder = segments.at(-2);
  const byFolder = folder === undefined ? undefined : FOLDER_LABEL_LOOKUP.get(folder);

  return byFolder ?? 'Modules';
}

/**
 * @description Returns the first binding introduced by an import for deterministic tie-breaking.
 * Side-effect imports return an empty string and are handled separately.
 *
 * @param node The import declaration to inspect.
 */
function firstBindingOf(node: ts.ImportDeclaration): string {
  const clause = node.importClause;

  if (clause === undefined) {
    return '';
  }

  if (clause.name !== undefined) {
    return clause.name.text;
  }

  const bindings = clause.namedBindings;

  if (bindings !== undefined && ts.isNamespaceImport(bindings)) {
    return bindings.name.text;
  }

  if (bindings !== undefined && ts.isNamedImports(bindings)) {
    return bindings.elements[0]?.name.text ?? '';
  }

  return '';
}

/**
 * @description Builds the replacement range for the import block in one source file.
 *
 * @param source Parsed source file.
 * @param text Complete source text.
 */
function buildImportBlock(
  source: ts.SourceFile,
  text: string,
): { start: number; end: number; block: string } | null {
  const imports = source.statements.filter(ts.isImportDeclaration);

  if (imports.length === 0) {
    return null;
  }

  const first = imports[0];
  const above = ts.getLeadingCommentRanges(text, first.pos) ?? [];
  const kept = above.filter((range) => !isGroupHeader(text.slice(range.pos, range.end)));
  const hoisted = new Set(kept.map((range) => range.pos));
  const groups = new Map<string, { key: string; text: string }[]>();
  const sideEffects: string[] = [];

  for (const node of imports) {
    const specifier = (node.moduleSpecifier as ts.StringLiteral).text;
    const leading = (ts.getLeadingCommentRanges(text, node.pos) ?? [])
      .filter((range) => !hoisted.has(range.pos))
      .map((range) => text.slice(range.pos, range.end))
      .filter((comment) => !isGroupHeader(comment));
    const entry = {
      key: `${specifier} ${firstBindingOf(node)}`,
      text: [...leading, text.slice(node.getStart(source), node.end)].join('\n'),
    };

    if (node.importClause === undefined) {
      sideEffects.push(entry.text);
      continue;
    }

    const label = labelFor(specifier);
    groups.set(label, [...(groups.get(label) ?? []), entry]);
  }

  const grouped = [...groups.keys()]
    .sort((a, b) => a.localeCompare(b, 'en'))
    .map((label) => {
      const sorted = [...(groups.get(label) ?? [])].sort((a, b) =>
        a.key.localeCompare(b.key, 'en'),
      );

      return [`// ${label}`, ...sorted.map((entry) => entry.text)].join('\n');
    })
    .join('\n\n');
  const block = [sideEffects.join('\n'), grouped].filter(Boolean).join('\n\n');
  const start = above.length > 0 ? above[0].pos : first.getStart(source);
  const preserved = kept.map((range) => text.slice(range.pos, range.end)).join('\n');
  const prefix = preserved.length > 0 ? `${preserved}\n\n` : '';

  return {
    start,
    end: imports.at(-1)?.end ?? first.end,
    block: `${prefix}${block}`,
  };
}

/**
 * @description Rewrites one file while leaving all non-import text byte-for-byte unchanged.
 *
 * @param filePath The file path used for TypeScript parsing.
 * @param text Original file contents.
 */
function rewrite(filePath: string, text: string): string {
  const source = ts.createSourceFile(
    filePath,
    text,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const result = buildImportBlock(source, text);

  if (result === null) {
    return text;
  }

  const head = text.slice(0, result.start).replace(/\s+$/, '');
  const separator = head.length > 0 ? '\n\n' : '';

  return `${head}${separator}${result.block}${text.slice(result.end)}`;
}

/**
 * @description Entry point for normal formatting and read-only `--check` verification.
 */
function main(): void {
  const args = process.argv.slice(2);
  const checkOnly = args.includes('--check');
  const explicit = args.filter((arg) => !arg.startsWith('--'));
  const files =
    explicit.length > 0
      ? explicit
      : [
          ...globSync('src/**/*.ts'),
          ...globSync('src/**/*.tsx'),
          ...globSync('test/**/*.ts'),
          ...globSync('test/**/*.tsx'),
        ];
  const offenders: string[] = [];

  for (const file of files.filter((candidate) => !candidate.endsWith('.d.ts'))) {
    const absolute = resolve(file);
    const original = readFileSync(absolute, 'utf8');
    const updated = rewrite(absolute, original);

    if (original === updated) {
      continue;
    }

    if (checkOnly) {
      offenders.push(relative(process.cwd(), absolute));
      continue;
    }

    writeFileSync(absolute, updated);
  }

  if (offenders.length > 0) {
    process.stderr.write(
      `Import groups are not sorted in ${offenders.length} file(s):\n${offenders
        .map((file) => `  ${file}`)
        .join('\n')}\nRun \`bun run format:imports\` to fix.\n`,
    );
    process.exit(1);
  }
}

main();
