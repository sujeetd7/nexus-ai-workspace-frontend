import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { PasswordField } from "./PasswordField";

afterEach(() => {
  cleanup();
});

describe("PasswordField", () => {
  it("is secure by default", () => {
    renderWithSharedUI(
      <PasswordField testID="pwd" accessibilityLabel="Password" />,
    );
    const input = screen.getByTestId("pwd") as HTMLInputElement;
    expect(input.type === "password" || input.getAttribute("type") === "password").toBe(
      true,
    );
    expect(screen.getByTestId("pwd-toggle")).toBeTruthy();
    expect(
      screen.getByTestId("pwd-toggle").getAttribute("aria-label"),
    ).toMatch(/show password/i);
  });

  it("toggles visibility and updates control label", () => {
    renderWithSharedUI(
      <PasswordField testID="pwd" accessibilityLabel="Password" />,
    );
    const toggle = screen.getByTestId("pwd-toggle");
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-label")).toMatch(/hide password/i);
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-label")).toMatch(/show password/i);
  });

  it("respects disabled state on the toggle", () => {
    renderWithSharedUI(
      <PasswordField testID="pwd" accessibilityLabel="Password" disabled />,
    );
    const toggle = screen.getByTestId("pwd-toggle") as HTMLButtonElement;
    expect(toggle.disabled).toBe(true);
  });
});
