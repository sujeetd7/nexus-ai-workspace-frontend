/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { SharedUIProvider } from "@nexus/shared-ui";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createAppStore } from "../../../store/createAppStore";
import { authSuccess } from "../../../store/slices/auth/authSlice";
import { EditProfileScreen } from "./EditProfileScreen";
import { PreferencesScreen } from "./PreferencesScreen";
import { ProfileScreen } from "./ProfileScreen";

const refetch = vi.fn();
const unwrap = vi.fn();
const updateCurrentUser = vi.fn(() => ({ unwrap }));
const createUserProfile = vi.fn(() => ({ unwrap: vi.fn() }));

const profileFixture = {
  id: "profile-1",
  authUserId: "user-1",
  email: "user@example.com",
  firstName: "Ada",
  lastName: "Lovelace",
  avatar: "https://cdn.example.com/ada.png",
  status: "ACTIVE" as const,
  preferences: { theme: "light" },
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
};

const queryState = {
  data: undefined as typeof profileFixture | undefined,
  error: undefined as unknown,
  isLoading: false,
  isFetching: false,
  refetch,
};

const createState = {
  data: undefined as typeof profileFixture | undefined,
  error: undefined as unknown,
  isLoading: false,
  isError: false,
};

vi.mock("../api", () => ({
  useGetCurrentUserQuery: () => queryState,
  useUpdateCurrentUserMutation: () => [
    updateCurrentUser,
    { isLoading: false, error: undefined },
  ],
  useCreateUserProfileMutation: () => [createUserProfile, createState],
}));

const authUser = {
  id: "user-1",
  email: "user@example.com",
  role: "DEVELOPER",
  firstName: "Ada",
  lastName: "Lovelace",
  emailVerified: true,
  isActive: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

function renderWithProviders(ui: ReactElement) {
  const store = createAppStore({
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

  store.store.dispatch(
    authSuccess({
      user: authUser,
      tokens: { accessToken: "a", refreshToken: "r" },
    }),
  );

  return render(
    <SharedUIProvider defaultPreference="system">
      <Provider store={store.store}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    </SharedUIProvider>,
  );
}

describe("Profile screens", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    queryState.data = undefined;
    queryState.error = undefined;
    queryState.isLoading = false;
    queryState.isFetching = false;
    createState.data = undefined;
    createState.error = undefined;
    createState.isLoading = false;
    createState.isError = false;
    refetch.mockReset();
    unwrap.mockReset();
    updateCurrentUser.mockClear();
    createUserProfile.mockClear();
  });

  it("shows profile details with avatar and actions", () => {
    queryState.data = profileFixture;
    renderWithProviders(<ProfileScreen />);
    expect(screen.getByTestId("profile-screen")).toBeTruthy();
    expect(screen.getByText("Ada Lovelace")).toBeTruthy();
    expect(screen.getByText("user@example.com")).toBeTruthy();
    expect(screen.getByTestId("profile-avatar")).toBeTruthy();
    expect(screen.getByText("Edit profile")).toBeTruthy();
    expect(screen.getByText("Preferences")).toBeTruthy();
  });

  it("shows loading state", () => {
    queryState.isLoading = true;
    renderWithProviders(<ProfileScreen />);
    expect(screen.getByTestId("profile-screen-loading")).toBeTruthy();
  });

  it("shows retryable API failure", () => {
    queryState.error = {
      status: 500,
      message: "Internal error",
      code: "INTERNAL",
    };
    renderWithProviders(<ProfileScreen />);
    expect(screen.getByTestId("profile-screen-error")).toBeTruthy();
    expect(screen.getByText("Unable to load profile")).toBeTruthy();
    expect(screen.getByText("Retry")).toBeTruthy();
  });

  it("shows session expired sign-in action", () => {
    queryState.error = {
      status: 401,
      message: "Unauthorized",
      code: "UNAUTHORIZED",
    };
    renderWithProviders(<ProfileScreen />);
    expect(screen.getByText("Session expired")).toBeTruthy();
    expect(screen.getByText("Sign in")).toBeTruthy();
  });

  it("renders edit form from loaded profile", () => {
    queryState.data = profileFixture;
    renderWithProviders(<EditProfileScreen />);
    expect(screen.getByTestId("edit-profile-screen")).toBeTruthy();
    expect(screen.getByDisplayValue("Ada")).toBeTruthy();
    expect(screen.getByDisplayValue("Lovelace")).toBeTruthy();
    expect(screen.getByText("Save changes")).toBeTruthy();
  });

  it("shows edit load failure with retry", async () => {
    const user = userEvent.setup();
    queryState.error = {
      status: 500,
      message: "Boom",
      code: "INTERNAL",
    };
    renderWithProviders(<EditProfileScreen />);
    expect(screen.getByTestId("edit-profile-error")).toBeTruthy();
    await user.click(screen.getByText("Retry"));
    expect(refetch).toHaveBeenCalled();
  });

  it("renders preferences editor", () => {
    queryState.data = profileFixture;
    renderWithProviders(<PreferencesScreen />);
    expect(screen.getByTestId("preferences-screen")).toBeTruthy();
    expect(screen.getByLabelText("Preferences JSON")).toBeTruthy();
    expect(screen.getByText("Save preferences")).toBeTruthy();
  });

  it("shows preferences forbidden state", () => {
    queryState.error = {
      status: 403,
      message: "Forbidden",
      code: "FORBIDDEN",
    };
    renderWithProviders(<PreferencesScreen />);
    expect(screen.getByTestId("preferences-error")).toBeTruthy();
    expect(screen.getByText("Permission denied")).toBeTruthy();
  });
});
