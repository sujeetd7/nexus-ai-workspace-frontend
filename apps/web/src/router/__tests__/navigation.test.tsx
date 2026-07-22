/**
 * @vitest-environment jsdom
 */

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suspense, type ReactElement } from "react";
import {
  createMemoryRouter,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import { SharedUIProvider } from "@nexus/shared-ui";
import { INFRASTRUCTURE_ROUTES, ROUTE_IDS } from "@nexus/shared-types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { applyNavigationDecision } from "../guards";
import { createAppRouteObjects } from "../createAppRouteObjects";
import { WEB_ROUTE_PATHS } from "../paths";
import { publicRoutes } from "../routes";

function renderRouter(initialEntry = "/") {
  const router = createMemoryRouter(createAppRouteObjects(), {
    initialEntries: [initialEntry],
  });

  return {
    router,
    ...render(
      <SharedUIProvider defaultPreference="light">
        <RouterProvider router={router} />
      </SharedUIProvider>,
    ),
  };
}

describe("web navigation foundation", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the root shell and home route outlet", async () => {
    renderRouter("/");

    expect(screen.getByTestId("application-shell")).toBeTruthy();
    expect(screen.getByTestId("application-shell-header")).toBeTruthy();
    expect(screen.getByTestId("application-shell-main")).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByTestId("home-page")).toBeTruthy();
    });
  });

  it("renders the catch-all not-found route for unknown paths", async () => {
    renderRouter("/does-not-exist");

    await waitFor(() => {
      expect(screen.getByTestId("not-found-page")).toBeTruthy();
    });
  });

  it("supports direct navigation to the home path", async () => {
    renderRouter(WEB_ROUTE_PATHS.home);

    await waitFor(() => {
      expect(screen.getByTestId("home-page")).toBeTruthy();
    });
  });

  it("keeps route IDs aligned with shared catalog paths", () => {
    const home = publicRoutes.find((route) => route.id === ROUTE_IDS.HOME);
    expect(home?.path).toBe(INFRASTRUCTURE_ROUTES[ROUTE_IDS.HOME].webPath);
    expect(WEB_ROUTE_PATHS.notFound).toBe(
      INFRASTRUCTURE_ROUTES[ROUTE_IDS.NOT_FOUND].webPath,
    );
  });

  it("applies generic navigation guard decisions without auth logic", () => {
    expect(applyNavigationDecision({ allowed: true })).toEqual({
      allow: true,
    });
    expect(
      applyNavigationDecision({
        allowed: false,
        reason: "injected-block",
        redirectTo: ROUTE_IDS.HOME,
      }),
    ).toEqual({
      allow: false,
      reason: "injected-block",
      redirectTo: ROUTE_IDS.HOME,
    });
  });

  it("exposes skip-to-content accessibility affordance", async () => {
    renderRouter("/");

    await waitFor(() => {
      expect(screen.getByTestId("home-page")).toBeTruthy();
    });

    const skip = screen.getByRole("link", { name: "Skip to content" });
    expect(skip.getAttribute("href")).toBe("#main-content");
    expect(document.getElementById("main-content")).toBeTruthy();
  });

  it("renders route-level error fallback for route execution failures", async () => {
    function Boom(): ReactElement {
      throw new Error("route boom");
    }

    function ErrorProbe(): ReactElement {
      const error = useRouteError();
      return (
        <div data-testid="route-error-probe">
          {error instanceof Error ? error.message : "error"}
        </div>
      );
    }

    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: (
            <Suspense fallback={<div>loading</div>}>
              <Boom />
            </Suspense>
          ),
          errorElement: <ErrorProbe />,
        },
      ],
      { initialEntries: ["/"] },
    );

    render(
      <SharedUIProvider defaultPreference="light">
        <RouterProvider router={router} />
      </SharedUIProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("route-error-probe").textContent).toContain(
        "route boom",
      );
    });
  });

  it("renders the application RouteErrorFallback component", async () => {
    const { RouteErrorFallback } = await import("../../pages/errors");

    function Boom(): ReactElement {
      throw new Error("shell boom");
    }

    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <Boom />,
          errorElement: <RouteErrorFallback />,
        },
      ],
      { initialEntries: ["/"] },
    );

    render(
      <SharedUIProvider defaultPreference="light">
        <RouterProvider router={router} />
      </SharedUIProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("route-error")).toBeTruthy();
    });

    await userEvent.click(
      screen.getByRole("button", { name: "Return to home" }),
    );
  });
});
