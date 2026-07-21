# ADR-0001: TypeScript pinned below 7.x

- **Status:** Accepted
- **Date:** 2026-07-21

## Context

TypeScript 7.x (the native/Go compiler port) is published on npm, and a naive
"use latest" would pull it in. But `typescript-eslint@8.x` — the parser that
powers every lint rule in this repo — declares a peer range of
`typescript >=4.8.4 <6.1.0`. Installing TS 7.x makes ESLint crash on startup
(`TypeError: Cannot read properties of undefined (reading 'Cjs')`), so linting
is completely broken, not just degraded.

## Decision

Pin `typescript` to the 6.0.x line (`6.0.3`) until the linting ecosystem
publishes a release whose peer range admits 7.x.

## Consequences

- `tsc -b` and all ESLint rules work today.
- We forgo the native compiler's speed for now — acceptable, since this is a
  small template where compile time is not the bottleneck.
- Revisit when `typescript-eslint` widens its peer range; Dependabot will keep
  surfacing the available 7.x releases so this doesn't get forgotten.
