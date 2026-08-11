// Helpers
import { getComponentImports } from './src/app/helpers/auto-imports.helper.ts';

// Node Libraries
import path from 'node:path';

// Storybook
// Storybook + Vitest browser integration
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

// Third Party Libraries
// Third Party Libraries
import { fileURLToPath, URL } from 'url';

// Vite
import react from '@vitejs/plugin-react-swc';
// Unplugin
import AutoImport from 'unplugin-auto-import/vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { defaultExclude, defineConfig } from 'vitest/config';

// Vitest
import { playwright } from '@vitest/browser-playwright';

const dirname = fileURLToPath(new URL('.', import.meta.url));

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
 * Browser tests require the pinned Chromium binary. CI installs it explicitly;
 * local contributors can run `bunx playwright install chromium` once before
 * invoking `bun run test:storybook`.
 */
export default defineConfig({
  plugins: [
    AutoImport({
      defaultExportByFilename: false,
      dirs: ['src/app/constants', 'src/app/helpers', 'src/app/hooks'],
      exclude: [/\.stories\.[tj]sx?$/, /node_modules/],
      dts: false,
      imports: [
        // @ts-expect-error - Add global imports here
        ...getComponentImports(),
        // @ts-expect-error - Add global imports here
        'react',
      ],
    }),
    react({ disableOxcRecommendation: true }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(dirname, 'src/app/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    // Storybook's Vitest addon consumes the CommonJS aria-query package through the ESM build
    // of Testing Library. Pre-bundling both packages gives Rolldown a stable named-export map.
    include: ['@testing-library/dom', 'aria-query'],
  },
  test: {
    onConsoleLog(log) {
      // The error-boundary story intentionally throws; keep that fixture from polluting the
      // browser gate while allowing every unrelated console error to remain visible.
      return !log.includes('Simulated render error') && !log.includes('ThrowingChild');
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      // Scope to the logic surface we unit-test — hooks, stores, schemas,
      // the error pipeline, and the stateful base components. Purely
      // presentational base components (AppBaseSvg/Wrapper) are
      // story-covered, not unit-covered, and would dilute this signal, so
      // they're deliberately left out of the include glob.
      include: [
        'src/app/hooks/**',
        'src/app/store/**',
        'src/app/components/base/AppBaseToast.tsx',
        'src/app/components/base/AppBaseRouteGuard.tsx',
        'src/app/components/base/AppBaseErrorBoundary.tsx',
        'src/plugins/errorHandler/**',
        'src/modules/**/hooks/**',
        'src/modules/**/schemas/**',
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
          name: 'unit',
          environment: 'jsdom',
          exclude: [...defaultExclude, 'e2e/**'],
          globals: true,
          setupFiles: ['./test/setup.ts'],
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
            tags: { skip: ['skip'] },
          }),
        ],
        test: {
          name: 'storybook',
          exclude: [...defaultExclude, 'e2e/**'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
