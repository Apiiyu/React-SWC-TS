import { describe, expect, it, vi } from "vitest";
import type { AxiosError } from "axios";

// i18n must be initialized before errorHandler calls i18n.t()
import "@/plugins/i18n/i18n";

import { handleHttpError } from "@/plugins/errorHandler/errorHandler";
import { ToastType } from "@/app/constants/toast.constant";
import eventBus from "@/plugins/mitt/mitt";

describe("handleHttpError", () => {
  it(
    "emits a 'toast' event with a real ToastType value " +
      "(regression: the old ambient .d.ts enum type-checked but threw at runtime)",
    async () => {
      const onToast = vi.fn();
      eventBus.on("toast", onToast);

      const error = {
        response: { status: 401, data: {} },
      } as AxiosError<{ message?: string }>;

      await expect(handleHttpError(error)).rejects.toBe(error);

      // i18n defaults to "id" (see src/plugins/i18n/i18n.ts `lng`)
      expect(onToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ToastType.DANGER,
          message: "Tidak Diotorisasi",
        })
      );

      eventBus.off("toast", onToast);
    }
  );

  it("uses the server-provided message when present", async () => {
    const onToast = vi.fn();
    eventBus.on("toast", onToast);

    const error = {
      response: { status: 400, data: { message: "Email is invalid" } },
    } as AxiosError<{ message?: string }>;

    await expect(handleHttpError(error)).rejects.toBe(error);

    expect(onToast).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Email is invalid" })
    );

    eventBus.off("toast", onToast);
  });
});
