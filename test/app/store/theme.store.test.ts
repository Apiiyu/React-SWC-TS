import { describe, expect, it } from "vitest";

import { useThemeStore } from "@/app/store/theme.store";

describe("useThemeStore", () => {
  it("defaults to light and toggles to dark and back", () => {
    expect(useThemeStore.getState().theme).toBe("light");

    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe("dark");

    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe("light");
  });
});
