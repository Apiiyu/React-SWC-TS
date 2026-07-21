---
"react-swc-ddd-ts": minor
---

Optimize the starter across DX, performance, workflow, and architecture habits.

**Developer experience**

- Interactive module generator (`bun generate:module`) that scaffolds only the folders a module actually needs and auto-registers its router.
- Storybook with a11y + docs addons and stories for the base components; `AppBaseErrorBoundary` global error boundary wired to the toast pipeline.
- VSCode workspace settings, recommended extensions, and code snippets for the module conventions.

**Performance**

- React Compiler enabled (auto-memoization).
- Build-time image optimization + a WebP `<picture>` pattern for the hero, self-hosted fonts via `@fontsource` (no render-blocking Google Fonts `@import`), and route-chunk prefetch on hover/focus.
- Hard bundle-size budget gate (`bun run size`) and opt-in bundle analysis (`bun run analyze`).

**Workflow**

- Changesets for versioning/changelog, Dependabot, issue/PR templates, CODEOWNERS, CONTRIBUTING, and CODE_OF_CONDUCT.
- CI extended to run typecheck, lint, format, dep-check, coverage, size budget, and Storybook build.

**Architecture habits**

- `dependency-cruiser` enforces module boundaries (`app/` never imports `modules/`, no cross-module imports, no cycles) — in CI and the pre-push hook.
- Coverage threshold gate scoped to the logic surface, ADR folder documenting the non-obvious decisions.
