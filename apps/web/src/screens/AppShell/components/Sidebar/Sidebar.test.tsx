/**
 * @vitest-environment jsdom
 */

import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { SharedUIProvider } from "@nexus/shared-ui";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createAppStore } from "../../../../store/createAppStore";
import { Sidebar } from "./Sidebar";

vi.mock("../../../../api/services/workspace/workspaceApi", () => ({
  useListWorkspacesQuery: () => ({
    data: [],
    isLoading: false,
    isFetching: false,
    error: undefined,
    refetch: vi.fn(),
  }),
}));

function renderSidebar(visible = true) {
  const { store } = createAppStore({
    config: {
      buildMode: "test",
      apiBaseUrl: "http://localhost:3000/api/v1",
      graphqlUrl: "http://localhost:3000/graphql",
      appName: "Nexus",
      isDevelopment: false,
      isProduction: false,
    },
    startSaga: false,
  });

  return render(
    <SharedUIProvider defaultPreference="light">
      <Provider store={store}>
        <MemoryRouter>
          <Sidebar visible={visible} />
        </MemoryRouter>
      </Provider>
    </SharedUIProvider>,
  );
}

describe("Sidebar", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders shell sections and placeholders", () => {
    renderSidebar(true);

    expect(screen.getByTestId("app-shell-sidebar")).toBeTruthy();
    expect(screen.getByLabelText("Application sidebar")).toBeTruthy();
    expect(screen.getByLabelText("Primary navigation")).toBeTruthy();
    expect(screen.getByTestId("app-shell-search")).toBeTruthy();
    expect(screen.getByTestId("app-shell-recent-empty")).toBeTruthy();
    expect(screen.getByTestId("app-shell-pinned-empty")).toBeTruthy();
    expect(screen.getByTestId("app-shell-version")).toBeTruthy();
  });

  it("hides when not visible", () => {
    renderSidebar(false);

    expect(screen.queryByTestId("app-shell-sidebar")).toBeNull();
  });
});
