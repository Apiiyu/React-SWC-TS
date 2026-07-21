// Helpers
import { getComponentImports } from "./src/app/helpers/auto-imports.helper";

// Path
import path from "path";

// URL
import { fileURLToPath, URL } from "url";

// Unplugin libraries
/**
 * @description Vite plugin to automatically import files from a directory.
 * @see https://github.com/antfu/unplugin-auto-import
 */
import AutoImport from "unplugin-auto-import/vite";

// Vite libraries
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

/**
 * @description `@vitejs/plugin-react-swc` has no hook for the React
 * Compiler (a Babel AST pass) — it only speaks SWC. This runs a Babel pass
 * scoped to just `babel-plugin-react-compiler` (parsing TSX via
 * `@babel/preset-typescript`) BEFORE SWC's own transform, per React
 * Compiler's documented recipe for SWC-based setups. `enforce: "pre"`
 * (vite-plugin-babel's default) guarantees the ordering regardless of
 * array position.
 * @see https://react.dev/learn/react-compiler
 */
import babel from "vite-plugin-babel";

/**
 * @description Vite plugin to minify svg files
 * @see https://github.com/vbenjs/vite-plugin-svg-icons
 */
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

/**
 * @description Vite plugin to compress the build output using vite-plugin-compression.
 * @see https://github.com/vbenjs/vite-plugin-compression
 */
import viteCompression from "vite-plugin-compression";

/**
 * @description Strips console/debugger from the production build.
 * @see https://github.com/xiaoxian521/vite-plugin-remove-console
 * NOTE: Vite 8 defaults to the Rolldown/Oxc pipeline, whose transform/minify
 * options don't yet expose a `drop_console` equivalent — esbuild's
 * `esbuild.drop` is silently ignored under that pipeline (verified via a
 * runtime "oxc options will be used, esbuild options ignored" warning), so
 * this plugin is still the reliable option today.
 * NOTE 2: this plugin's parser crashes on AppBaseErrorBoundary specifically
 * (the only class component in the codebase — verified via a reproducible
 * `.find is not a function` crash in Storybook's build). Excluded below;
 * its one `console.error` is already gated behind `import.meta.env.DEV`,
 * which Vite dead-code-eliminates in production regardless.
 */
import removeConsole from "vite-plugin-remove-console";

/**
 * @description Bundle composition report, opt-in via `ANALYZE=true bun run build`
 * (writes dist/stats.html) — see also `bun run size` for the hard CI budget gate.
 * @see https://github.com/btd/rollup-plugin-visualizer
 */
import { visualizer } from "rollup-plugin-visualizer";

/**
 * @description Compresses raster/SVG assets at build time via sharp/svgo.
 * Replaces the old `unplugin-imagemin` (deprecated squoosh mode). Doesn't
 * generate alternate formats on its own — see hero.png/hero.webp in
 * modules/dashboard for the manual WebP + `<picture>` pattern to follow
 * for other above-the-fold images.
 * @see https://github.com/FatehAK/vite-plugin-image-optimizer
 */
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      // Enable auto import by filename for default module exports under directories
      defaultExportByFilename: false,

      // Auto import for module exports under directories
      // by default it only scan one level of modules under the directory
      dirs: ["src/app/constants", "src/app/helpers", "src/app/hooks"],

      // Storybook CSF files always explicitly import their component — auto-
      // injecting the same global import on top of that produced a duplicate
      // declaration that crashed Storybook's (rolldown-based) build.
      // AppBaseErrorBoundary.tsx is excluded too: the plugin's self-file
      // detection misfires on its `export class` declaration and injects a
      // self-referential import into its own definition file. It's used in
      // exactly one place (AppCommonEntryPoint), imported explicitly there.
      exclude: [
        /\.stories\.[tj]sx?$/,
        /node_modules/,
        /AppBaseErrorBoundary\.tsx$/,
      ],

      // Filepath to generate corresponding .d.ts file.
      // Defaults to './auto-imports.d.ts' when `typescript` is installed locally.
      // Set `false` to disable.
      dts: "src/app/types/auto-imports.d.ts",

      // Generate corresponding .eslintrc-auto-import.json file.
      // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
      eslintrc: {
        enabled: true,
      },

      // global imports to register
      imports: [
        // @ts-expect-error - Add global imports here
        ...getComponentImports(),
        // @ts-expect-error - Add global imports here
        "react",
      ],

      // Include auto-imported packages in Vite's `optimizeDeps` options
      // Recommend to enable
      viteOptimizeDeps: true,
    }),
    createSvgIconsPlugin({
      // Specify the icon folder to be cached
      iconDirs: [path.resolve(process.cwd(), "src/app/assets/icons")],

      // Specify symbolId format
      symbolId: "icon-[dir]-[name]",
    }),
    babel({
      include: /src\/.*\.tsx?$/,
      exclude: [/\.stories\.tsx?$/, /node_modules/],
      babelConfig: {
        presets: [
          ["@babel/preset-typescript", { isTSX: true, allExtensions: true }],
        ],
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    react(),
    removeConsole({
      external: ["src/app/components/base/AppBaseErrorBoundary.tsx"],
    }),
    viteCompression(),
    ViteImageOptimizer({
      png: { quality: 85 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 80 },
      svg: {
        multipass: true,
      },
    }),
    process.env.ANALYZE &&
      visualizer({
        filename: "dist/stats.html",
        gzipSize: true,
        brotliSize: true,
      }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
