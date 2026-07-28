/**
 * @vitest-environment jsdom
 */

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { SharedUIProvider } from "@nexus/shared-ui";
import { afterEach, describe, expect, it, vi } from "vitest";

import { WEB_ROUTE_PATHS } from "../../../../router/paths";
import { Navigation } from "./Navigation";

function renderNavigation(initialPath = WEB_ROUTE_PATHS.dashboard) {
  return render(
    <SharedUIProvider defaultPreference="light">
      <MemoryRouter initialEntries={[initialPath]}>
        <Navigation />
      </MemoryRouter>
    </SharedUIProvider>,
  );
}

describe("Navigation", () => {
  afterEach(() => {
    cleanup();
  });

  it("marks the active route", () => {
    renderNavigation(WEB_ROUTE_PATHS.dashboard);

    const dashboardLink = screen.getByRole("link", { name: "Dashboard" });
    expect(dashboardLink.getAttribute("aria-current")).toBe("page");
  });

  it("calls onNavigate when a link is pressed", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();

    render(
      <SharedUIProvider defaultPreference="light">
        <MemoryRouter initialEntries={[WEB_ROUTE_PATHS.dashboard]}>
          <Navigation onNavigate={onNavigate} />
        </MemoryRouter>
      </SharedUIProvider>,
    );

    await user.click(screen.getByRole("link", { name: "Profile" }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});
