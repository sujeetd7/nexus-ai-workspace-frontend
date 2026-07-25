/**
 * @vitest-environment jsdom
 */

import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { renderWithSharedUI } from "@nexus/shared-ui/testing";

import { LoginComposition } from "./LoginComposition";

afterEach(() => {
  cleanup();
});

describe("LoginComposition accessibility", () => {
  it("keeps visible labels and associates field errors", () => {
    renderWithSharedUI(<LoginComposition state="fieldErrors" />);

    expect(screen.getByLabelText(/Email/)).toBeTruthy();
    expect(screen.getByLabelText(/^Password/)).toBeTruthy();
    expect(screen.getByText("Remember me")).toBeTruthy();
    expect(screen.getByText("Enter a valid email address")).toBeTruthy();
    expect(
      screen.getByText("Password must be at least 8 characters"),
    ).toBeTruthy();

    const email = screen.getByTestId("login-email-input");
    expect(email.getAttribute("aria-invalid")).toBe("true");
    expect(email.getAttribute("aria-describedby")).toBeTruthy();

    const password = screen.getByTestId("login-password-input");
    expect(password.getAttribute("aria-invalid")).toBe("true");

    expect(screen.getByTestId("login-password-input-toggle")).toBeTruthy();
    expect(screen.getByText("Forgot password?")).toBeTruthy();
    expect(screen.getByText("Sign up")).toBeTruthy();
  });

  it("announces API errors via InlineAlert alert role", () => {
    renderWithSharedUI(<LoginComposition state="apiError" />);
    const alert = screen.getByTestId("login-api-error");
    expect(alert.getAttribute("role")).toBe("alert");
    expect(alert.textContent).toContain("Invalid email or password");
  });
});
