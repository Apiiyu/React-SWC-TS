# CLAUDE.md

Repository guidance for Claude Code and other coding agents.

`AGENT_RULES.md` is the authoritative one-page policy. `AGENTS.md` is the condensed agent
briefing. Keep all three documents aligned with the commands and behavior that actually run.

## Toolchain

- Bun `1.3.12`, pinned by `packageManager`.
- Node `24.11.0`, pinned by `.nvmrc` and the `engines` range.
- TypeScript `6.x`, React `19.x`, Vite `8.x`, Vitest `4.x`, and Storybook `10.x`.
- The repository uses ESM and Vite's bundler module resolution.

Use `bun` and `bunx`; do not use npm or npx. Do not use bare `bun test` or `bun build` when a
package script exists.

## Commands

```bash
# Static quality
bun run lint:check
bunx tsc -b --pretty false
bun run format:check
bun run docs:check
bun run format:imports -- --check
bun run lint:conventions
bun run dep:check

# Tests and artifacts
bun run test
bun run test:coverage
bun run build
bun run size
bun run build-storybook
bun run auto-imports:check

# Browser verification
bunx playwright install chromium
bun run test:storybook
bun run test:e2e

# Development and scaffolding
bun run start:dev
bun run storybook
bun run generate:module
bun run dep:graph
```

## Code conventions

**JSDoc is a gate.** Every authored class, interface, type alias, function, method, and
module-scope declaration in `src/` carries a meaningful JSDoc block with an `@description` tag.
Generated auto-import declarations and Vite ambient declarations are exempt. Run
`bun run lint:conventions` to check this rule.

**Imports are deterministic.** Run `bun run format:imports` after changing imports. Groups and
imports sort A-Z according to `scripts/sort-imports.ts`; side-effect imports stay first. Use
`import type` for symbols used only as types.

**Architecture is feature-based.** `src/app/` is cross-cutting infrastructure. It must not import
feature modules. Modules can use app infrastructure but cannot import sibling modules. `app/routes`
is the composition root and may assemble feature routes.

**Views are thin.** Keep transport, mutation, validation, and state logic in hooks, schemas,
constants, and stores. Do not import the HTTP client directly from a view.

**Generated auto-imports have one home.** Vite emits `src/app/types/auto-imports.d.ts` and the
ESLint manifest at `.eslintrc-auto-import.json`. Never edit either generated file by hand. Run
`bun run auto-imports:check` after changing auto-import configuration.

## Testing and security

Unit tests use Vitest and React Testing Library. Storybook tests use Vitest's real Chromium
provider. Application E2E tests use Playwright against the production preview build. Tests must
exercise both success and failure behavior for changed boundaries and must not emit React warnings.

Public environment values are validated by Zod. Never put credentials in `VITE_*` variables,
source, fixtures, logs, or documentation. SonarQube is optional until `SONAR_ENABLED`,
`SONAR_TOKEN`, and `SONAR_HOST_URL` are configured; the workflow skips cleanly otherwise.

## Completion evidence

Do not say that a gate passes because code inspection suggests it should. Run the gate, read its
output, and report the command, exit status, and counts. If a live dependency is unavailable,
report it as deferred instead of hiding the failure.
