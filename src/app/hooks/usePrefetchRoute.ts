// React
import { useCallback } from 'react';

/**
 * @description A lazy chunk loader — the exact `() => import("...")` thunk a
 * route's `lazy()` call wraps. Re-invoking it after the chunk is already in
 * flight is a no-op: the browser/Vite dedupes the module request.
 */
type ChunkLoader = () => Promise<unknown>;

/**
 * @description Warms a lazy-route chunk before the user commits to navigating,
 * so the Suspense fallback never flashes on links they clearly intend to click.
 *
 * Pair a route's own lazy loader with this and spread the returned handlers
 * onto the <Link>/<a>. The loader must be the SAME thunk the route's `lazy()`
 * uses (import the module factory from the module's router), otherwise you warm
 * a different chunk than the one that renders.
 *
 * @example
 *   const prefetch = usePrefetchRoute(() => import("@/modules/dashboard/views/dashboard-main"));
 *   <Link to="/dashboard" {...prefetch}>Dashboard</Link>
 */
export const usePrefetchRoute = (load: ChunkLoader) => {
  const prefetch = useCallback(() => {
    // Fire-and-forget: a failed prefetch must never surface to the user — the
    // real navigation will retry and surface the error through Suspense/router.
    void load().catch(() => {});
  }, [load]);

  return {
    onMouseEnter: prefetch,
    onFocus: prefetch,
    onTouchStart: prefetch,
  };
};
