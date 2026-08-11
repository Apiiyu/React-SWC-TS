// Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * @description Supported visual themes for the application shell.
 */
export type Theme = 'light' | 'dark';

/**
 * @description State and actions exposed by the application theme store.
 */
interface IThemeStore {
  theme: Theme;
  toggleTheme: () => void;
}

/**
 * @description Example global store — the boilerplate's `dark:` Tailwind
 * classes (see AppBaseToast) had no toggle wired to them; this is that wire.
 */
export const useThemeStore = create<IThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
    }),
    { name: 'theme-storage' },
  ),
);
