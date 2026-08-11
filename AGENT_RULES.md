# Agent Rules

> Read this before touching code. These rules outrank plans and repository prose when they
> conflict. A claim is not complete until the command that proves it has run.

## Rule 0 - Evidence, not belief

No task is marked complete without fresh command output. Use the smallest probe that proves the
claim and include its exit status and relevant counts in the handoff or pull request.

## Rule 1 - Use the repository toolchain

Use `bun` and `bunx`, never npm or npx commands. Use `bun run <script>` for package scripts. Use
the Node version in `.nvmrc` and the Bun version in `package.json`; do not rely on the runner's
global runtime.

## Rule 2 - Never weaken a gate

Do not lower coverage thresholds, widen bundle budgets, remove dependency-cruiser rules, disable
the JSDoc/import checks, hide warnings, or delete a failing test. Fix the source or record a
concrete, approved reason for a deliberate change.

## Rule 3 - Preserve React boundaries

`src/app/` is shared infrastructure and must not import feature modules. Feature modules must not
reach into sibling modules. Views render; hooks own behavior; schemas validate boundaries; stores
hold state only when it is genuinely shared or feature-local.

## Rule 4 - Generated files have one source of truth

Auto-import declarations are generated at `src/app/types/auto-imports.d.ts`. Never hand-edit them,
never create a second declaration file, and run `bun run auto-imports:check` after changing import
configuration.

## Rule 5 - Browser verification must run in a browser

A Storybook build is not a browser test. Install Chromium explicitly with `bunx playwright install
chromium` when needed, then run `bun run test:storybook` or `bun run test:e2e`. Do not claim browser
coverage when the test output reports zero browser executions.

## Rule 6 - Keep public data safe

Do not commit secrets, private tokens, or real personal data. Validate external responses with Zod
or an equivalent runtime schema. Do not add new authentication persistence without documenting and
testing the security trade-off.

## Rule 7 - Documentation follows reality

When package versions, scripts, or known behavior changes, update README, CONTRIBUTING, and the
agent documents in the same change. If documentation contradicts a fresh command result, stop and
correct the documentation before proceeding.

## Definition of Done

- `bun run lint:check`, `bunx tsc -b --pretty false`, and `bun run format:check` pass.
- `bun run dep:check`, `bun run test:coverage`, and `bun run build` pass.
- `bun run auto-imports:check`, `bun run size`, and `bun run build-storybook` pass.
- `bun run test:storybook` and `bun run test:e2e` pass when Chromium is installed.
- JSDoc uses a meaningful `@description`; imports are canonical and type-only where applicable.
- No gate was weakened and the final report includes fresh output for every claimed result.
