import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { Link } from "./Link.native";

afterEach(() => {
  cleanup();
});

describe("Link.native (Pressable under RNW)", () => {
  it("exposes link accessibility role and label", () => {
    renderWithSharedUI(
      <Link testID="forgot" href="/forgot" accessibilityLabel="Forgot password">
        Forgot password?
      </Link>,
    );
    const node = screen.getByTestId("forgot");
    expect(
      node.getAttribute("accessibilityRole") ?? node.getAttribute("role"),
    ).toMatch(/link/i);
    expect(
      node.getAttribute("accessibilityLabel") ??
        node.getAttribute("aria-label"),
    ).toContain("Forgot");
  });

  it("invokes onPress and blocks when disabled", () => {
    const onPress = vi.fn();
    const { rerender } = renderWithSharedUI(
      <Link testID="go" href="/x" onPress={onPress}>
        Go
      </Link>,
    );
    fireEvent.click(screen.getByTestId("go"));
    expect(onPress).toHaveBeenCalledTimes(1);

    onPress.mockClear();
    rerender(
      <Link testID="go" href="/x" disabled onPress={onPress}>
        Go
      </Link>,
    );
    fireEvent.click(screen.getByTestId("go"));
    expect(onPress).not.toHaveBeenCalled();
  });
});
