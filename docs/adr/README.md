# Architecture Decision Records

An ADR captures a single architectural decision, its context, and its
consequences — so the _why_ behind a choice survives long after the chat log or
the person who made it is gone.

We use them here for decisions that a newcomer to this template would otherwise
question (or silently "fix" the wrong way): pinned tool versions, where state
lives, why a plugin was kept over its modern-looking replacement.

## Format

Each record is `NNNN-short-title.md`, numbered sequentially, using the template
below. Records are immutable once merged — to reverse a decision, add a new ADR
that supersedes the old one and mark the old one `Superseded by ADR-NNNN`.

## Template

```markdown
# ADR-NNNN: Title

- **Status:** Proposed | Accepted | Superseded by ADR-XXXX
- **Date:** YYYY-MM-DD

## Context

What forces are at play? What problem are we solving?

## Decision

What did we decide to do?

## Consequences

What becomes easier or harder as a result? What do we revisit later?
```

## Index

- [ADR-0001](0001-typescript-pinned-below-7.md) — TypeScript pinned below 7.x
- [ADR-0002](0002-session-state-in-app-not-module.md) — Session state lives in `app/`, not the auth module
- [ADR-0003](0003-keep-vite-plugin-remove-console.md) — Keep `vite-plugin-remove-console` over `esbuild.drop`
