import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MIN_TOUCH_TARGET_SIZE } from "../../accessibility/touchTargets";
import { renderWithSharedUI } from "../../testing/render";
import { Button } from "./Button.native";

/**
 * Exercises the Metro-targeted Pressable implementation under jsdom + RNW.
 * This validates the shared module shape and a11y props — not a physical device.
 */
afterEach(() => {
  cleanup();
});

describe("Button.native (Pressable under RNW)", () => {
  it("exposes button accessibility role and label", () => {
    renderWithSharedUI(
      <Button testID="save" accessibilityLabel="Save file">
        Save
      </Button>,
    );
    const node = screen.getByTestId("save");
    expect(
      node.getAttribute("accessibilityRole") ?? node.getAttribute("role"),
    ).toMatch(/button/i);
    expect(
      node.getAttribute("accessibilityLabel") ??
        node.getAttribute("aria-label"),
    ).toContain("Save");
  });

  it("invokes onPress and blocks while disabled or loading", () => {
    const onPress = vi.fn();
    const { rerender } = renderWithSharedUI(
      <Button testID="save" onPress={onPress}>
        Save
      </Button>,
    );
    fireEvent.click(screen.getByTestId("save"));
    expect(onPress).toHaveBeenCalledTimes(1);

    onPress.mockClear();
    rerender(
      <Button testID="save" disabled onPress={onPress}>
        Save
      </Button>,
    );
    fireEvent.click(screen.getByTestId("save"));
    expect(onPress).not.toHaveBeenCalled();

    rerender(
      <Button testID="save" loading onPress={onPress} accessibilityLabel="Save">
        Save
      </Button>,
    );
    fireEvent.click(screen.getByTestId("save"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("accepts type without forwarding requirements on native", () => {
    renderWithSharedUI(
      <Button testID="save" type="submit">
        Save
      </Button>,
    );
    expect(screen.getByTestId("save")).toBeTruthy();
  });

  it("keeps minimum touch-target invariant", () => {
    expect(MIN_TOUCH_TARGET_SIZE).toBe(44);
  });
});
