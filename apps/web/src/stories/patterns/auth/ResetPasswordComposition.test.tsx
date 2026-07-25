/**
 * @vitest-environment jsdom
 */

import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { renderWithSharedUI } from "@nexus/shared-ui/testing";

import { ResetPasswordComposition } from "./ResetPasswordComposition";

afterEach(() => {
  cleanup();
});

describe("ResetPasswordComposition error/success", () => {
  it("renders invalid-token status with alert role", () => {
    renderWithSharedUI(<ResetPasswordComposition state="invalidToken" />);
    const alert = screen.getByTestId("reset-invalid-token");
    expect(alert.getAttribute("role")).toBe("alert");
    expect(alert.textContent).toContain("invalid");
    expect(screen.queryByTestId("reset-submit")).toBeNull();
  });

  it("renders expired-token warning status", () => {
    renderWithSharedUI(<ResetPasswordComposition state="expiredToken" />);
    const alert = screen.getByTestId("reset-expired-token");
    expect(alert.getAttribute("role")).toBe("alert");
    expect(alert.textContent).toContain("expired");
  });

  it("renders success status after reset", () => {
    renderWithSharedUI(<ResetPasswordComposition state="success" />);
    const alert = screen.getByTestId("reset-success");
    expect(alert.getAttribute("role")).toBe("alert");
    expect(alert.textContent).toContain("Password updated");
    expect(screen.queryByTestId("reset-password-input")).toBeNull();
  });
});
