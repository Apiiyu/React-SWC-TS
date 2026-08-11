# AGENTS.md - React SWC Starter

This repository is a reusable React/Vite starter, so a shortcut here becomes a default in every
project forked from it. `AGENT_RULES.md` is authoritative. `CLAUDE.md` contains toolchain detail
and command guidance.

## Read first

Read `AGENT_RULES.md`, then `CLAUDE.md`, then the module or configuration being changed. Never
claim a gate is green without the command output that proves it.

## Non-negotiable rules

1. Use the pinned Bun and Node toolchain; run package scripts through `bun run`.
2. Do not weaken coverage, architecture, lint, import, bundle, browser, or security gates.
3. Keep `src/app` independent from `src/modules`; sibling modules do not import each other.
4. Keep views thin and put behavior in hooks, schemas, constants, and stores.
5. Add meaningful JSDoc `@description` blocks to source declarations.
6. Run `bun run format:imports` instead of hand-maintaining import group headers.
7. Treat `src/app/types/auto-imports.d.ts` as generated and canonical.
8. Verify browser behavior with an actual Chromium run, not only a static build.

## Core verification

```bash
bun run lint:check
bunx tsc -b --pretty false
bun run format:check
bun run docs:check
bun run dep:check
bun run test:coverage
bun run build
bun run auto-imports:check
bun run size
bun run build-storybook
```

Install Chromium and run `bun run test:storybook` plus `bun run test:e2e` for browser coverage.
