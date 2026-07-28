import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MIN_TOUCH_TARGET_SIZE } from "../../accessibility/touchTargets";
import { renderWithSharedUI } from "../../testing/render";
import { Text } from "../Text";
import { IconButton } from "./IconButton";

afterEach(() => {
  cleanup();
});

describe("IconButton (web)", () => {
  it("requires an accessibility label and invokes onPress", () => {
    const onPress = vi.fn();
    renderWithSharedUI(
      <IconButton
        testID="ib"
        accessibilityLabel="Close"
        onPress={onPress}
      >
        <Text>×</Text>
      </IconButton>,
    );
    const node = screen.getByTestId("ib");
    expect(node.getAttribute("aria-label")).toBe("Close");
    fireEvent.click(node);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("supports variants and blocks when disabled", () => {
    const onPress = vi.fn();
    renderWithSharedUI(
      <IconButton
        testID="dis"
        variant="destructive"
        disabled
        accessibilityLabel="Delete"
        onPress={onPress}
      >
        <Text>D</Text>
      </IconButton>,
    );
    fireEvent.click(screen.getByTestId("dis"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("shows loading busy state", () => {
    renderWithSharedUI(
      <IconButton testID="load" loading accessibilityLabel="Save">
        <Text>S</Text>
      </IconButton>,
    );
    expect(screen.getByTestId("load").getAttribute("aria-busy")).toBe("true");
  });

  it("meets minimum touch target for circle shape", () => {
    renderWithSharedUI(
      <IconButton
        testID="circle"
        shape="circle"
        accessibilityLabel="More"
      >
        <Text>…</Text>
      </IconButton>,
    );
    const node = screen.getByTestId("circle") as HTMLElement;
    expect(Number.parseInt(node.style.minHeight, 10)).toBe(
      MIN_TOUCH_TARGET_SIZE,
    );
    expect(node.style.borderRadius).toBe("999px");
  });
});
