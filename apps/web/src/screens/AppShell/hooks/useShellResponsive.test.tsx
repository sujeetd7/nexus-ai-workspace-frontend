/**
 * @vitest-environment jsdom
 */

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useShellResponsive } from "./useShellResponsive";

function ResponsiveProbe() {
  const state = useShellResponsive();
  return (
    <div>
      <span data-testid="mode">{state.mode}</span>
      <button type="button" onClick={state.toggleSidebar}>
        toggle
      </button>
      <span data-testid="sidebar-visible">{String(state.sidebarVisible)}</span>
    </div>
  );
}

describe("useShellResponsive", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("1024"),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
  });

  it("reports desktop mode at large breakpoints", () => {
    render(<ResponsiveProbe />);
    expect(screen.getByTestId("mode").textContent).toBe("desktop");
  });

  it("toggles sidebar collapse on desktop", async () => {
    const user = userEvent.setup();
    render(<ResponsiveProbe />);

    expect(screen.getByTestId("sidebar-visible").textContent).toBe("true");
    await user.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.getByTestId("sidebar-visible").textContent).toBe("false");
  });
});
