// Hooks
import { useHttpAbort } from '@/app/hooks/useHttpAbort';

// Testing
import { renderHook } from '@testing-library/react';

// Vite
import { describe, expect, it } from 'vitest';

describe('useHttpAbort', () => {
  it('returns a fresh, un-aborted AbortController', () => {
    const { result } = renderHook(() => useHttpAbort());

    expect(result.current).toBeInstanceOf(AbortController);
    expect(result.current.signal.aborted).toBe(false);
  });

  it('keeps the same controller across re-renders', () => {
    const { result, rerender } = renderHook(() => useHttpAbort());
    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
  });

  it('aborts the signal on unmount (cancels in-flight requests)', () => {
    const { result, unmount } = renderHook(() => useHttpAbort());
    const { signal } = result.current;

    unmount();

    expect(signal.aborted).toBe(true);
  });
});
