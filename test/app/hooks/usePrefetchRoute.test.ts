import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

import { usePrefetchRoute } from "@/app/hooks/usePrefetchRoute";

describe("usePrefetchRoute", () => {
  it("returns hover/focus/touch handlers that all trigger the chunk loader", () => {
    const load = vi.fn(() => Promise.resolve({}));
    const { result } = renderHook(() => usePrefetchRoute(load));

    result.current.onMouseEnter();
    result.current.onFocus();
    result.current.onTouchStart();

    expect(load).toHaveBeenCalledTimes(3);
  });

  it("swallows a rejected chunk load so it never surfaces to the user", async () => {
    const load = vi.fn(() => Promise.reject(new Error("network")));
    const { result } = renderHook(() => usePrefetchRoute(load));

    // Must not throw synchronously nor reject — the real navigation retries.
    expect(() => result.current.onMouseEnter()).not.toThrow();
    await Promise.resolve();

    expect(load).toHaveBeenCalledTimes(1);
  });
});
