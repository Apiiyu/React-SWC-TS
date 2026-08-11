// Constants
import { ToastPosition, ToastType } from '@/app/constants/toast.constant';

// Hooks
import { useToast } from '@/app/hooks/useToast';

// Mitt
import eventBus from '@/plugins/mitt/mitt';

// Testing
import { renderHook } from '@testing-library/react';

// Vite
import { describe, expect, it, vi, afterEach } from 'vitest';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useToast', () => {
  it("emits a 'toast' event with the given message and type", () => {
    const emit = vi.spyOn(eventBus, 'emit');
    const { result } = renderHook(() => useToast());

    result.current.showToast({ message: 'Saved', type: ToastType.SUCCESS });

    expect(emit).toHaveBeenCalledWith('toast', {
      isOpen: true,
      message: 'Saved',
      type: ToastType.SUCCESS,
      position: ToastPosition.TOP_RIGHT,
    });
  });

  it('defaults position to TOP_RIGHT but honors an explicit position', () => {
    const emit = vi.spyOn(eventBus, 'emit');
    const { result } = renderHook(() => useToast());

    result.current.showToast({
      message: 'Oops',
      type: ToastType.DANGER,
      position: ToastPosition.BOTTOM_LEFT,
    });

    expect(emit).toHaveBeenCalledWith(
      'toast',
      expect.objectContaining({ position: ToastPosition.BOTTOM_LEFT }),
    );
  });
});
