/**
 * @description Interactive feature-module generator for the React starter. It creates only the
 * folders a feature requests, emits convention-ready JSDoc and imports, and can register the
 * generated route in the composition-root router.
 */
// Clack

// Node Libraries
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

// Third Party Libraries
// Third Party Libraries
import * as clack from '@clack/prompts';
// Chalk
import chalk from 'chalk';

/**
 * @description Optional module folders supported by the generator.
 */
type OptionalFolder = 'constants' | 'interfaces' | 'schemas' | 'hooks' | 'store';

/**
 * @description Converts a user-facing module name into the path-safe kebab-case form.
 *
 * @param name The raw module name entered by the user.
 */
function toKebabCase(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * @description Converts a kebab-case module name into the PascalCase component prefix.
 *
 * @param kebabName The normalized module name.
 */
function toPascalCase(kebabName: string): string {
  return kebabName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * @description Creates parent directories and writes one generated module file.
 *
 * @param filePath Destination path.
 * @param content Generated file contents.
 */
function writeFile(filePath: string, content: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
}

/**
 * @description Produces a lazy route module with a documented public router hook.
 *
 * @param kebabName Normalized module name.
 * @param pascalName Component and hook prefix.
 */
function routerTemplate(kebabName: string, pascalName: string): string {
  return `// React
import { lazy } from 'react';

// React Router DOM
import type { RouteObject } from 'react-router-dom';

// eslint-disable-next-line react-refresh/only-export-components -- router file intentionally pairs a lazy component with its use*Router hook export
const ${pascalName} = lazy(() =>
  import('../views/${kebabName}-main').then((module) => ({
    default: module.${pascalName},
  })),
);

/**
 * @description Returns the route tree owned by the ${kebabName} feature module.
 */
export const use${pascalName}Router = (): RouteObject[] => [
  {
    path: '${kebabName}',
    children: [
      {
        path: '',
        element: <${pascalName} />,
      },
    ],
  },
];
`;
}

/**
 * @description Produces the minimum documented view required for a generated module.
 *
 * @param pascalName Component name.
 */
function viewTemplate(pascalName: string): string {
  return `/**
 * @description Renders the initial ${pascalName} feature screen.
 */
export const ${pascalName} = (): JSX.Element => <div>${pascalName}</div>;
`;
}

/**
 * @description Produces a typed placeholder for module API constants.
 */
function constantTemplate(): string {
  return `/**
 * @description Holds endpoint constants owned by this feature module.
 */
export const API = {} as const;
`;
}

/**
 * @description Produces a documented placeholder for feature data contracts.
 */
function interfaceTemplate(): string {
  return `/**
 * @description Add feature interfaces here when the module receives an external data contract.
 */
export {};
`;
}

/**
 * @description Produces a Zod schema placeholder for feature-boundary validation.
 *
 * @param kebabName Normalized module name.
 */
function schemaTemplate(kebabName: string): string {
  const schemaName = kebabName.replace(/-([a-z])/g, (_, character: string) =>
    character.toUpperCase(),
  );

  return `// Zod
import { z } from 'zod';

/**
 * @description Validates data entering the ${kebabName} feature boundary.
 */
export const ${schemaName}Schema = z.object({});
`;
}

/**
 * @description Produces a documented Zustand placeholder without inventing feature state.
 *
 * @param pascalName Component and store prefix.
 */
function storeTemplate(pascalName: string): string {
  return `// Zustand
import { create } from 'zustand';

/**
 * @description Replace this marker with real state owned by the ${pascalName} feature.
 */
interface I${pascalName}Store {
  _placeholder?: never;
}

/**
 * @description Provides state local to the ${pascalName} feature module.
 */
export const use${pascalName}Store = create<I${pascalName}Store>()(() => ({}));
`;
}

/**
 * @description Registers a generated module router exactly once in the composition root.
 *
 * @param kebabName Normalized module name.
 * @param pascalName Component and hook prefix.
 */
function registerRouterInPluginsRouter(kebabName: string, pascalName: string): boolean {
  const routerPluginPath = join('src', 'plugins', 'router', 'router.tsx');
  const content = readFileSync(routerPluginPath, 'utf8');

  if (content.includes(`use${pascalName}Router`)) {
    return false;
  }

  const importLine = `import { use${pascalName}Router } from '@/modules/${kebabName}/router/${kebabName}.router';\n`;
  const withImport = content.replace(
    /(import \{ useRoutes \} from 'react-router-dom';\n)/,
    `${importLine}$1`,
  );
  const variableName = kebabName.replace(/-([a-z])/g, (_, character: string) =>
    character.toUpperCase(),
  );
  const withHookCall = withImport.replace(
    /(const app = useAppRoutes\(\);\n)/,
    `$1  const ${variableName} = use${pascalName}Router();\n`,
  );
  const withMergedArray = withHookCall.replace(
    /useRoutes\(\[([^\]]*)\]\)/,
    (_, existingSpread: string) => `useRoutes([${existingSpread.trim()}, ...${variableName}])`,
  );

  writeFileSync(routerPluginPath, withMergedArray);
  return true;
}

/**
 * @description Runs the interactive generator and reports the exact follow-up work for the user.
 */
async function main(): Promise<void> {
  clack.intro(chalk.bold('Generate a new feature module'));

  const rawName = await clack.text({
    message: 'Module name (e.g. billing, userProfile):',
    validate: (value) => {
      const normalizedValue = value ?? '';

      if (!normalizedValue.trim()) return 'Module name is required';
      if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(normalizedValue.trim())) {
        return 'Use letters and digits only, starting with a letter';
      }

      return undefined;
    },
  });

  if (clack.isCancel(rawName)) {
    clack.cancel('Cancelled.');
    return;
  }

  const kebabName = toKebabCase(rawName.trim());
  const pascalName = toPascalCase(kebabName);
  const modulePath = join('src', 'modules', kebabName);

  if (existsSync(modulePath)) {
    clack.cancel(`src/modules/${kebabName} already exists.`);
    process.exitCode = 1;
    return;
  }

  const optionalFolders = await clack.multiselect({
    message:
      "Which optional folders does this module need right now? (skip what you don't need yet)",
    options: [
      { value: 'constants', label: 'constants/' },
      { value: 'interfaces', label: 'interfaces/' },
      { value: 'schemas', label: 'schemas/ (Zod validation)' },
      { value: 'hooks', label: 'hooks/ (business logic / services)' },
      { value: 'store', label: 'store/ (Zustand — only if there is real local state)' },
    ],
    required: false,
  });

  if (clack.isCancel(optionalFolders)) {
    clack.cancel('Cancelled.');
    return;
  }

  const needsLocales = await clack.confirm({
    message: 'Add an i18n locales/ namespace for this module?',
    initialValue: false,
  });

  if (clack.isCancel(needsLocales)) {
    clack.cancel('Cancelled.');
    return;
  }

  const shouldRegisterRouter = await clack.confirm({
    message: "Auto-register the module's router in plugins/router/router.tsx?",
    initialValue: true,
  });

  if (clack.isCancel(shouldRegisterRouter)) {
    clack.cancel('Cancelled.');
    return;
  }

  const spinner = clack.spinner();
  spinner.start('Scaffolding module');

  writeFile(
    join(modulePath, 'router', `${kebabName}.router.tsx`),
    routerTemplate(kebabName, pascalName),
  );
  writeFile(join(modulePath, 'views', `${kebabName}-main.tsx`), viewTemplate(pascalName));
  writeFile(join(modulePath, 'components', '.gitkeep'), '');

  const selectedFolders = optionalFolders as OptionalFolder[];

  if (selectedFolders.includes('constants')) {
    writeFile(join(modulePath, 'constants', `${kebabName}.constant.ts`), constantTemplate());
  }
  if (selectedFolders.includes('interfaces')) {
    writeFile(join(modulePath, 'interfaces', `${kebabName}.interface.ts`), interfaceTemplate());
  }
  if (selectedFolders.includes('schemas')) {
    writeFile(join(modulePath, 'schemas', `${kebabName}.schema.ts`), schemaTemplate(kebabName));
  }
  if (selectedFolders.includes('hooks')) {
    writeFile(join(modulePath, 'hooks', '.gitkeep'), '');
  }
  if (selectedFolders.includes('store')) {
    writeFile(join(modulePath, 'store', `${kebabName}.store.ts`), storeTemplate(pascalName));
  }
  if (needsLocales) {
    writeFile(join(modulePath, 'locales', 'en.json'), '{}\n');
    writeFile(join(modulePath, 'locales', 'id.json'), '{}\n');
  }

  let registered = false;

  if (shouldRegisterRouter) {
    registered = registerRouterInPluginsRouter(kebabName, pascalName);
  }

  spinner.stop('Module files created.');

  let routerMessage: string;

  if (registered) {
    routerMessage = 'Router registered in src/plugins/router/router.tsx';
  } else if (shouldRegisterRouter) {
    routerMessage = 'Router registration skipped (already present)';
  } else {
    routerMessage = `Register manually: add use${pascalName}Router() to src/plugins/router/router.tsx`;
  }

  const nextSteps = [
    `Module "${kebabName}" created at src/modules/${kebabName}`,
    routerMessage,
    needsLocales ? `Register the "${kebabName}" namespace in src/plugins/i18n/i18n.ts` : null,
  ].filter((step): step is string => step !== null);

  clack.outro(chalk.green(nextSteps.join('\n')));
}

await main();
