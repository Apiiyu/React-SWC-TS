/**
 * @description Central registry of lazy-route chunk loaders.
 *
 * WHY THIS LIVES IN app/routes: prefetching a route means loading another
 * module's chunk. If a feature module imported a sibling module's view
 * directly (e.g. dashboard → authentication) it would violate the
 * no-cross-module-imports boundary (see .dependency-cruiser.mjs). app/routes
 * is the composition root — the one layer allowed to reach into modules — so
 * the cross-module knowledge is centralized here, and feature modules only
 * ever import loaders from app/ (a legal modules → app dependency).
 *
 * Each loader MUST be the same `() => import(...)` thunk the module's own
 * router wraps in `lazy()`, so prefetch warms exactly the chunk that renders.
 *
 * Only list chunks that some OTHER module prefetches. A module never needs to
 * prefetch its own view (it's already loaded once rendered), and self-listing
 * would create an import cycle: registry → view → (view prefetches sibling) →
 * registry. The dashboard view, for instance, is the landing chunk and is not
 * listed here for exactly that reason.
 */
export const routeLoaders = {
  authenticationLogin: () => import('@/modules/authentication/views/authentication-login-main'),
} as const;

/**
 * @description Names of route loaders that can be requested by feature navigation.
 */
export type RouteLoaderKey = keyof typeof routeLoaders;
