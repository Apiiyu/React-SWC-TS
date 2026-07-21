# ADR-0002: Session state lives in `app/`, not the auth module

- **Status:** Accepted
- **Date:** 2026-07-21

## Context

The `authentication` module owns the login flow, so the instinct is to put the
session store (`accessToken`, `isAuthenticated`) inside it. But `AppBaseRouteGuard`
lives in `app/` and needs to read session state to protect _any_ route — not
just auth routes. If the store lived in `modules/authentication/`, then `app/`
would import from `modules/*`, inverting the dependency direction the whole
template is built on: `modules` may depend on `app`, never the reverse.

This boundary is enforced mechanically by `.dependency-cruiser.mjs`
(`no-app-to-modules`), so a violation fails CI rather than relying on discipline.

## Decision

Session state lives in `src/app/store/session.store.ts`. The `authentication`
module _writes_ to it (on successful login) and `app/`-level guards _read_ from
it, keeping all dependency arrows pointing from `modules` → `app`.

## Consequences

- `AppBaseRouteGuard` and any future cross-cutting concern can read session
  state without importing a feature module.
- "Session" is correctly framed as an app-wide concern, not an auth-feature
  detail — auth is just one writer.
- Feature-specific state (e.g. a login form's local UI state) still belongs in
  the module; only genuinely cross-cutting state graduates to `app/store`.
