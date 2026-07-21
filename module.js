// Clack
import * as clack from "@clack/prompts";

// Chalk
import chalk from "chalk";

// File System
import fs from "fs";

// Path
import path from "path";

const toKebabCase = (name) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

const toPascalCase = (kebabName) =>
  kebabName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

const writeFile = (filePath, content) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
};

const routerTemplate = (kebabName, pascalName) =>
  `// React
import { lazy } from "react";

// React Router DOM
import { RouteObject } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components -- router file intentionally pairs a lazy component with its ` +
  "`use*Router`" +
  ` hook export
const ${pascalName} = lazy(() =>
  import("../views/${kebabName}-main").then((module) => ({
    default: module.${pascalName},
  }))
);

export const use${pascalName}Router = (): RouteObject[] => {
  return [
    {
      path: "${kebabName}",
      children: [
        {
          path: "",
          element: <${pascalName} />,
        },
      ],
    },
  ];
};
`;

const viewTemplate = (pascalName) => `export const ${pascalName} = () => {
  return <div>${pascalName}</div>;
};
`;

const constantTemplate = () => `export const API = {
  // TODO: add endpoint paths here
} as const;
`;

const interfaceTemplate = () => `// TODO: add interfaces here, e.g.:
// export interface IExampleResponse {
//   id: string;
// }
export {};
`;

const schemaTemplate = (kebabName) => `// Zod
import { z } from "zod";

// TODO: add real fields here
export const ${kebabName.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}Schema = z.object({});
`;

const storeTemplate = (pascalName) => `// Zustand
import { create } from "zustand";

// TODO: replace with real state — an empty interface is rejected by
// @typescript-eslint/no-empty-object-type on purpose, don't disable it
interface I${pascalName}Store {
  _placeholder?: never;
}

export const use${pascalName}Store = create<I${pascalName}Store>()(() => ({}));
`;

const registerRouterInPluginsRouter = (kebabName, pascalName) => {
  const routerPluginPath = path.join("src", "plugins", "router", "router.tsx");
  const content = fs.readFileSync(routerPluginPath, "utf-8");

  if (content.includes(`use${pascalName}Router`)) {
    return false;
  }

  const importLine = `import { use${pascalName}Router } from "@/modules/${kebabName}/router/${kebabName}.router";\n`;
  const withImport = content.replace(
    /(import \{ useRoutes \} from "react-router-dom";\n)/,
    `${importLine}$1`
  );

  const varName = kebabName.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const withHookCall = withImport.replace(
    /(const app = useAppRoutes\(\);\n)/,
    `$1  const ${varName} = use${pascalName}Router();\n`
  );

  const withMergedArray = withHookCall.replace(
    /useRoutes\(\[([^\]]*)\]\)/,
    (_, existingSpread) =>
      `useRoutes([${existingSpread.trim()}, ...${varName}])`
  );

  fs.writeFileSync(routerPluginPath, withMergedArray);
  return true;
};

const main = async () => {
  clack.intro(chalk.bold("Generate a new feature module"));

  const rawName = await clack.text({
    message: "Module name (e.g. billing, userProfile):",
    validate: (value) => {
      if (!value.trim()) return "Module name is required";
      if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(value.trim()))
        return "Use letters and digits only, starting with a letter";
    },
  });

  if (clack.isCancel(rawName)) {
    clack.cancel("Cancelled.");
    process.exit(0);
  }

  const kebabName = toKebabCase(rawName.trim());
  const pascalName = toPascalCase(kebabName);
  const modulePath = path.join("src", "modules", kebabName);

  if (fs.existsSync(modulePath)) {
    clack.cancel(`src/modules/${kebabName} already exists.`);
    process.exit(1);
  }

  const optionalFolders = await clack.multiselect({
    message:
      "Which optional folders does this module need right now? (skip what you don't need yet — an empty scaffold is dead weight, not DX)",
    options: [
      { value: "constants", label: "constants/" },
      { value: "interfaces", label: "interfaces/" },
      { value: "schemas", label: "schemas/ (Zod validation)" },
      { value: "hooks", label: "hooks/ (business logic / services)" },
      {
        value: "store",
        label: "store/ (Zustand — only if there's real local state)",
      },
    ],
    required: false,
  });

  if (clack.isCancel(optionalFolders)) {
    clack.cancel("Cancelled.");
    process.exit(0);
  }

  const needsLocales = await clack.confirm({
    message: "Add an i18n locales/ namespace for this module?",
    initialValue: false,
  });

  if (clack.isCancel(needsLocales)) {
    clack.cancel("Cancelled.");
    process.exit(0);
  }

  const shouldRegisterRouter = await clack.confirm({
    message: "Auto-register the module's router in plugins/router/router.tsx?",
    initialValue: true,
  });

  if (clack.isCancel(shouldRegisterRouter)) {
    clack.cancel("Cancelled.");
    process.exit(0);
  }

  const s = clack.spinner();
  s.start("Scaffolding module");

  writeFile(
    path.join(modulePath, "router", `${kebabName}.router.tsx`),
    routerTemplate(kebabName, pascalName)
  );
  writeFile(
    path.join(modulePath, "views", `${kebabName}-main.tsx`),
    viewTemplate(pascalName)
  );
  writeFile(path.join(modulePath, "components", ".gitkeep"), "");

  if (optionalFolders.includes("constants")) {
    writeFile(
      path.join(modulePath, "constants", `${kebabName}.constant.ts`),
      constantTemplate()
    );
  }
  if (optionalFolders.includes("interfaces")) {
    writeFile(
      path.join(modulePath, "interfaces", `${kebabName}.interface.ts`),
      interfaceTemplate()
    );
  }
  if (optionalFolders.includes("schemas")) {
    writeFile(
      path.join(modulePath, "schemas", `${kebabName}.schema.ts`),
      schemaTemplate(kebabName)
    );
  }
  if (optionalFolders.includes("hooks")) {
    writeFile(path.join(modulePath, "hooks", ".gitkeep"), "");
  }
  if (optionalFolders.includes("store")) {
    writeFile(
      path.join(modulePath, "store", `${kebabName}.store.ts`),
      storeTemplate(pascalName)
    );
  }
  if (needsLocales) {
    writeFile(path.join(modulePath, "locales", "en.json"), "{}\n");
    writeFile(path.join(modulePath, "locales", "id.json"), "{}\n");
  }

  let registered = false;
  if (shouldRegisterRouter) {
    registered = registerRouterInPluginsRouter(kebabName, pascalName);
  }

  s.stop("Module files created.");

  const nextSteps = [
    `Module "${kebabName}" created at src/modules/${kebabName}`,
    registered
      ? "Router registered in src/plugins/router/router.tsx"
      : shouldRegisterRouter
        ? "Router registration skipped (already present)"
        : `Register manually: add \`use${pascalName}Router()\` to src/plugins/router/router.tsx`,
    needsLocales
      ? `Register the "${kebabName}" namespace in src/plugins/i18n/i18n.ts`
      : null,
  ].filter(Boolean);

  clack.outro(chalk.green(nextSteps.join("\n")));
};

main();
