import { describe, expect, it } from "vitest";
import { act } from "react";
import { render, screen } from "@testing-library/react";

import { AppBaseToast } from "@/app/components/base/AppBaseToast";
import { ToastPosition, ToastType } from "@/app/constants/toast.constant";
import eventBus from "@/plugins/mitt/mitt";

describe("AppBaseToast", () => {
  it("renders nothing before any toast event fires (regression: used to always render an empty toast)", () => {
    const { container } = render(<AppBaseToast />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders a toast dispatched over the event bus (proves the pipeline is actually wired, not dead code)", () => {
    render(<AppBaseToast />);

    act(() => {
      eventBus.emit("toast", {
        isOpen: true,
        message: "Something broke",
        type: ToastType.DANGER,
        position: ToastPosition.TOP_RIGHT,
      });
    });

    expect(screen.getByText("Something broke")).toBeInTheDocument();
  });

  it("hides again after the close button is clicked", async () => {
    const { container } = render(<AppBaseToast />);

    act(() => {
      eventBus.emit("toast", {
        isOpen: true,
        message: "Something broke",
        type: ToastType.DANGER,
        position: ToastPosition.TOP_RIGHT,
      });
    });

    act(() => {
      screen.getByRole("button", { name: "Close" }).click();
    });

    expect(container).toBeEmptyDOMElement();
  });
});
