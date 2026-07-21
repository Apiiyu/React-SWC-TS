// Zustand
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

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
      theme: "light",
      toggleTheme: () =>
        set({ theme: get().theme === "light" ? "dark" : "light" }),
    }),
    { name: "theme-storage" }
  )
);
