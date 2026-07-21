import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

// https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

export default tseslint.config(
  { ignores: ["dist", "storybook-static", "coverage"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      "constructor-super": "error",
      "getter-return": "error",
      "no-async-promise-executor": "error",
      "no-cond-assign": ["error", "always"],
      "no-constant-binary-expression": "error",
      "no-extra-boolean-cast": "error",
      "no-implied-eval": "error",
      "no-iterator": "error",
      "no-labels": "error",
      "no-lone-blocks": "error",
      "no-lonely-if": "error",
      "no-loop-func": "error",
      "no-multi-assign": "error",
      "no-negated-condition": "error",
      "no-nested-ternary": "error",
      "no-new-wrappers": "error",
      "no-param-reassign": "error",
      "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
      "no-self-assign": "error",
      "no-self-compare": "error",
      /**
       * @description Stays off intentionally (typescript-eslint's own
       * guidance): the base `no-undef` rule isn't type-aware, so it
       * false-positives on ambient global types (declare global { interface
       * X {} }) unless `parserOptions.project` enables full typed linting.
       * `tsc -b` (see package.json build/CI) is what actually catches
       * undefined-name errors; a Vitest regression test is what caught the
       * runtime enum bug this repo shipped with — see test/plugins/errorHandler.test.ts.
       */
      "no-undef": "off",
      "no-unexpected-multiline": "error",
      "no-unreachable": "error",
      "no-unsafe-finally": "error",
      "no-unsafe-negation": "error",
      "no-unsafe-optional-chaining": "error",
      "no-useless-catch": "error",
      "no-use-before-define": "error",
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  eslintConfigPrettier,
  storybook.configs["flat/recommended"]
);
