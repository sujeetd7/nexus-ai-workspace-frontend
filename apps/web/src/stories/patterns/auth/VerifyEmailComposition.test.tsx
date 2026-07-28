/**
 * @vitest-environment jsdom
 */

import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { renderWithSharedUI } from "@nexus/shared-ui/testing";

import { VerifyEmailComposition } from "./VerifyEmailComposition";

afterEach(() => {
  cleanup();
});

describe("VerifyEmailComposition", () => {
  it("shows loading indicator", () => {
    renderWithSharedUI(<VerifyEmailComposition state="loading" />);
    expect(screen.getByLabelText(/verifying email/i)).toBeTruthy();
  });

  it("shows success and continue affordance", () => {
    renderWithSharedUI(<VerifyEmailComposition state="success" />);
    expect(screen.getByTestId("verify-success")).toBeTruthy();
    expect(screen.getByText("Continue to sign in")).toBeTruthy();
  });

  it("shows invalid and expired token states", () => {
    const { rerender } = renderWithSharedUI(
      <VerifyEmailComposition state="invalidToken" />,
    );
    expect(screen.getByTestId("verify-invalid-token")).toBeTruthy();
    rerender(<VerifyEmailComposition state="expiredToken" />);
    expect(screen.getByTestId("verify-expired-token")).toBeTruthy();
  });
});
