// Zustand
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ISessionStore {
  accessToken: string | null;
  isAuthenticated: boolean;
  setSession: (accessToken: string) => void;
  clearSession: () => void;
}

/**
 * @description App-level session state — deliberately not owned by the
 * `authentication` feature module, so app-level components (e.g.
 * AppBaseRouteGuard) can depend on it without reaching into a module
 * (modules may depend on app/, never the reverse).
 */
export const useSessionStore = create<ISessionStore>()(
  persist(
    (set) => ({
      accessToken: null,
      isAuthenticated: false,
      setSession: (accessToken) => set({ accessToken, isAuthenticated: true }),
      clearSession: () => set({ accessToken: null, isAuthenticated: false }),
    }),
    { name: "session-storage" }
  )
);
