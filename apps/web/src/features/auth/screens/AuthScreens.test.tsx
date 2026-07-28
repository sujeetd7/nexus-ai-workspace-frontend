/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SharedUIProvider } from "@nexus/shared-ui";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ForgotPasswordScreen } from "./ForgotPasswordScreen";
import { ResetPasswordScreen } from "./ResetPasswordScreen";
import { VerifyEmailScreen } from "./VerifyEmailScreen";

const forgotPassword = vi.fn();
const resetPassword = vi.fn();
const verifyEmail = vi.fn();

vi.mock("../../../api/auth/createWebAuthClient", () => ({
  getWebAuthClient: () => ({
    forgotPassword,
    resetPassword,
    verifyEmail,
  }),
}));

afterEach(() => {
  cleanup();
});

describe("ForgotPasswordScreen", () => {
  beforeEach(() => {
    forgotPassword.mockReset();
  });

  it("renders form and brand", () => {
    render(
      <SharedUIProvider defaultPreference="system">
        <MemoryRouter>
          <ForgotPasswordScreen />
        </MemoryRouter>
      </SharedUIProvider>,
    );
    expect(screen.getByTestId("forgot-card")).toBeTruthy();
    expect(screen.getByText("Nexus AI Workspace")).toBeTruthy();
    expect(screen.getByTestId("forgot-submit")).toBeTruthy();
  });
});

describe("ResetPasswordScreen", () => {
  beforeEach(() => {
    resetPassword.mockReset();
  });

  it("shows invalid link when token is missing", () => {
    render(
      <SharedUIProvider defaultPreference="system">
        <MemoryRouter initialEntries={["/reset-password"]}>
          <ResetPasswordScreen />
        </MemoryRouter>
      </SharedUIProvider>,
    );
    expect(screen.getByTestId("reset-invalid-token")).toBeTruthy();
    expect(screen.queryByTestId("reset-submit")).toBeNull();
  });

  it("renders password confirmation fields when token present", () => {
    render(
      <SharedUIProvider defaultPreference="system">
        <MemoryRouter initialEntries={["/reset-password?token=abc"]}>
          <ResetPasswordScreen />
        </MemoryRouter>
      </SharedUIProvider>,
    );
    expect(screen.getByTestId("reset-password-input")).toBeTruthy();
    expect(screen.getByTestId("reset-confirmPassword-input")).toBeTruthy();
  });
});

describe("VerifyEmailScreen", () => {
  beforeEach(() => {
    verifyEmail.mockReset();
  });

  it("shows invalid link when token is missing", () => {
    render(
      <SharedUIProvider defaultPreference="system">
        <MemoryRouter initialEntries={["/verify-email"]}>
          <VerifyEmailScreen />
        </MemoryRouter>
      </SharedUIProvider>,
    );
    expect(screen.getByTestId("verify-invalid-token")).toBeTruthy();
  });

  it("shows success after verification", async () => {
    verifyEmail.mockResolvedValue({});
    render(
      <SharedUIProvider defaultPreference="system">
        <MemoryRouter initialEntries={["/verify-email?token=ok"]}>
          <VerifyEmailScreen />
        </MemoryRouter>
      </SharedUIProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("verify-success")).toBeTruthy();
    });
  });
});
