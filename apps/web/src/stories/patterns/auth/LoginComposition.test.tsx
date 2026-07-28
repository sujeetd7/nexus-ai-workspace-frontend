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

    const email = screen.getByRole("textbox", { name: /email/i });
    const password = screen.getByTestId("login-password-input");
    expect(password.tagName).toBe("INPUT");
    expect(email).toBeTruthy();
    expect(screen.getByText(/Email \*/)).toBeTruthy();
    expect(screen.getByText(/Password \*/)).toBeTruthy();

    const emailError = screen.getByText("Enter a valid email address");
    const passwordError = screen.getByText(
      "Password must be at least 8 characters",
    );
    expect(emailError).toBeTruthy();
    expect(passwordError).toBeTruthy();
    expect(passwordError.getAttribute("role")).toBe("alert");

    expect(email.getAttribute("aria-invalid")).toBe("true");
    const emailDescribedBy = email.getAttribute("aria-describedby");
    expect(emailDescribedBy).toBeTruthy();
    expect(emailError.getAttribute("id")).toBe(emailDescribedBy);

    expect(password.getAttribute("aria-invalid")).toBe("true");
    const passwordDescribedBy = password.getAttribute("aria-describedby");
    expect(passwordDescribedBy).toBeTruthy();
    expect(passwordDescribedBy!.length).toBeGreaterThan(0);
    expect(passwordError.getAttribute("id")).toBe(passwordDescribedBy);

    expect(screen.getByTestId("login-password-input-toggle")).toBeTruthy();
    expect(screen.getByText("Forgot password?")).toBeTruthy();
    expect(screen.getByText("Sign up")).toBeTruthy();
    expect(screen.getByText("Nexus AI Workspace")).toBeTruthy();
  });

  it("announces API errors via InlineAlert alert role", () => {
    renderWithSharedUI(<LoginComposition state="apiError" />);
    const alert = screen.getByTestId("login-api-error");
    expect(alert.getAttribute("role")).toBe("alert");
    expect(alert.textContent).toContain("Invalid email or password");
  });

  it("announces network errors", () => {
    renderWithSharedUI(<LoginComposition state="networkError" />);
    expect(screen.getByTestId("login-api-error").textContent).toContain(
      "Unable to reach the server",
    );
  });
});
