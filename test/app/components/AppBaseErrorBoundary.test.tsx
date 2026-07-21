import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AppBaseErrorBoundary } from "@/app/components/base/AppBaseErrorBoundary";
import eventBus from "@/plugins/mitt/mitt";

const Boom = () => {
  throw new Error("kaboom");
};

const Safe = () => <div>all good</div>;

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AppBaseErrorBoundary", () => {
  it("renders children when nothing throws", () => {
    render(
      <AppBaseErrorBoundary>
        <Safe />
      </AppBaseErrorBoundary>
    );

    expect(screen.getByText("all good")).toBeInTheDocument();
  });

  it("shows the fallback and dispatches a toast when a child throws", () => {
    // React logs caught render errors to console.error — silence it for a clean run.
    vi.spyOn(console, "error").mockImplementation(() => {});
    const emit = vi.spyOn(eventBus, "emit");

    render(
      <AppBaseErrorBoundary>
        <Boom />
      </AppBaseErrorBoundary>
    );

    expect(emit).toHaveBeenCalledWith(
      "toast",
      expect.objectContaining({ message: "kaboom", type: "DANGER" })
    );
    // Retry button proves the fallback UI rendered.
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("recovers to children after retry when the child no longer throws", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();

    // A child that throws once, then renders fine after retry resets state.
    let shouldThrow = true;
    const Flaky = () => {
      if (shouldThrow) throw new Error("transient");
      return <div>recovered</div>;
    };

    render(
      <AppBaseErrorBoundary>
        <Flaky />
      </AppBaseErrorBoundary>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();

    shouldThrow = false;
    await user.click(screen.getByRole("button"));

    expect(screen.getByText("recovered")).toBeInTheDocument();
  });
});
