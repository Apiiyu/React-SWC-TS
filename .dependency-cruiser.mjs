/** @type {import('dependency-cruiser').IConfiguration} */
export default {
  forbidden: [
    {
      name: "no-app-to-modules",
      severity: "error",
      comment:
        "app/ is cross-cutting infrastructure — it must never depend on a feature module. Modules depend on app/, never the reverse (see AppBaseRouteGuard using app/store/session.store, not modules/authentication/store). Exception: app/routes is the composition root — its entire job is wiring the top-level route to a module view.",
      from: { path: "^src/app", pathNot: "^src/app/routes" },
      to: { path: "^src/modules" },
    },
    {
      name: "no-cross-module-imports",
      severity: "error",
      comment:
        "Feature modules must stay independent of each other — share code through app/, don't reach into a sibling module.",
      from: { path: "^src/modules/([^/]+)/" },
      to: {
        path: "^src/modules/([^/]+)/",
        pathNot: "^src/modules/$1/",
      },
    },
    {
      name: "no-circular",
      severity: "error",
      comment:
        "Circular dependencies make modules hard to reason about and can break tree-shaking.",
      from: {},
      to: { circular: true },
    },
    {
      name: "no-orphans",
      severity: "warn",
      comment:
        "A file nothing imports is dead weight — wire it up or delete it. " +
        "NOTE: unplugin-auto-import's generated auto-imports.d.ts declares " +
        "`typeof import('...')` for every auto-imported component, which " +
        "dependency-cruiser counts as a real incoming edge — so a component " +
        "that's auto-import-eligible but never actually rendered anywhere " +
        "will NOT be caught by this rule. Catches genuinely unreferenced " +
        "files (modules/plugins/non-component code) reliably; components " +
        "need an eyeball check.",
      from: {
        orphan: true,
        pathNot: [
          "\\.d\\.ts$",
          "^src/main\\.tsx$",
          "^src/vite-env\\.d\\.ts$",
          "^src/auto-imports\\.d\\.ts$",
        ],
      },
      to: {},
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.app.json" },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default"],
    },
    reporterOptions: {
      archi: {
        collapsePattern: "^(src/app|src/modules/[^/]+|src/plugins/[^/]+)",
      },
    },
  },
};
