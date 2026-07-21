// Node
import path from "node:path";

// Helpers
import { getComponentImports } from "./src/app/helpers/auto-imports.helper";

// URL
import { fileURLToPath, URL } from "url";

// Unplugin
import AutoImport from "unplugin-auto-import/vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

// Storybook + Vitest browser integration
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

// Vitest
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

const dirname = fileURLToPath(new URL(".", import.meta.url));

/**
 * @description Standalone (not merged from vite.config.ts) to sidestep a
 * `mergeConfig`/`defineConfig` overload-inference conflict between vite's
 * and vitest's bundled config types. Keep the plugin list here in sync with
 * vite.config.ts's `AutoImport` dirs whenever that changes.
 *
 * Two projects: "unit" (jsdom, what `bun run test` runs) and "storybook"
 * (real Chromium via Playwright, runs every `*.stories.tsx` as a test — see
 * https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon).
 * Kept separate so the fast unit gate never needs a browser installed.
 *
 * KNOWN ISSUE: `bun run test:storybook` currently fails with a CJS/ESM
 * interop error inside `@storybook/addon-vitest`'s own bundled setup file
 * (`aria-query` "does not provide an export named 'elementRoles'") — an
 * upstream bug in this very new addon (10.5.2), not a config mistake here.
 * `bun run storybook` / `bun run build-storybook` (the actual deliverable —
 * browsing and building the stories) both work correctly. Revisit when the
 * addon ships a fix.
 */
export default defineConfig({
  plugins: [
    AutoImport({
      defaultExportByFilename: false,
      dirs: ["src/app/constants", "src/app/helpers", "src/app/hooks"],
      exclude: [/\.stories\.[tj]sx?$/, /node_modules/],
      dts: false,
      imports: [
        // @ts-expect-error - Add global imports here
        ...getComponentImports(),
        // @ts-expect-error - Add global imports here
        "react",
      ],
    }),
    react(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(dirname, "src/app/assets/icons")],
      symbolId: "icon-[dir]-[name]",
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    coverage: {
      provider: "v8",
      // Scope to the logic surface we unit-test — hooks, stores, schemas,
      // the error pipeline, and the stateful base components. Purely
      // presentational base components (AppBaseText/Svg/Wrapper) are
      // story-covered, not unit-covered, and would dilute this signal, so
      // they're deliberately left out of the include glob.
      include: [
        "src/app/hooks/**",
        "src/app/store/**",
        "src/app/components/base/AppBaseToast.tsx",
        "src/app/components/base/AppBaseRouteGuard.tsx",
        "src/app/components/base/AppBaseErrorBoundary.tsx",
        "src/plugins/errorHandler/**",
        "src/modules/**/hooks/**",
        "src/modules/**/schemas/**",
      ],
      // A floor, not a target — its job is to fail the build if coverage
      // silently erodes, not to chase 100%. Raise deliberately as the suite
      // grows. Branches sits lower than the rest on purpose: AppBaseToast's
      // presentational position/type → className switches carry many trivial
      // branches whose per-arm tests would be low-value churn for a template.
      thresholds: {
        statements: 60,
        branches: 55,
        functions: 60,
        lines: 60,
      },
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          globals: true,
          setupFiles: ["./test/setup.ts"],
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
