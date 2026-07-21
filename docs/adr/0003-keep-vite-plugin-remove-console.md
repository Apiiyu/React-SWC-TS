# ADR-0003: Keep `vite-plugin-remove-console` over `esbuild.drop`

- **Status:** Accepted
- **Date:** 2026-07-21

## Context

The modern one-liner for stripping `console`/`debugger` from a production build
is `esbuild: { drop: ["console", "debugger"] }` in the Vite config — no extra
plugin. We tried it. Under Vite 8 it silently does nothing: Vite 8 defaults to
the Rolldown/Oxc transform pipeline, which ignores esbuild options and prints
`oxc options will be used and esbuild options will be ignored` at build time.
Oxc does not yet expose a `drop_console` equivalent.

## Decision

Keep `vite-plugin-remove-console`, which hooks the transform directly and works
regardless of the underlying pipeline.

Caveat encoded in `vite.config.ts`: this plugin's parser crashes on the only
class component in the repo (`AppBaseErrorBoundary`), so that file is added to
the plugin's `external` list. Its single `console.error` is already gated behind
`import.meta.env.DEV`, which Vite dead-code-eliminates in production anyway, so
excluding it loses nothing.

## Consequences

- Console stripping actually happens in production builds.
- One extra dev dependency, justified until Oxc ships a native drop option.
- Revisit when Vite/Oxc expose `drop` — at that point the plugin and its
  `external` workaround can both be deleted.
