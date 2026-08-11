// Stores
import { useThemeStore } from '@/app/store/theme.store';

// Vite
import { describe, expect, it } from 'vitest';

describe('useThemeStore', () => {
  it('defaults to light and toggles to dark and back', () => {
    expect(useThemeStore.getState().theme).toBe('light');

    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe('dark');

    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe('light');
  });
});
