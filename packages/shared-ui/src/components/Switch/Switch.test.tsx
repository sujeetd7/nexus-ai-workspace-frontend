import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MIN_TOUCH_TARGET_SIZE } from "../../accessibility/touchTargets";
import { renderWithSharedUI } from "../../testing/render";
import { Switch } from "./Switch";

afterEach(() => {
  cleanup();
});

describe("Switch (web)", () => {
  it("toggles controlled state via onCheckedChange", () => {
    const onCheckedChange = vi.fn();
    renderWithSharedUI(
      <Switch
        testID="sw"
        checked={false}
        onCheckedChange={onCheckedChange}
        accessibilityLabel="Notifications"
      />,
    );
    fireEvent.click(screen.getByTestId("sw"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("exposes switch role and checked state", () => {
    renderWithSharedUI(
      <Switch
        testID="on"
        checked
        onCheckedChange={() => {}}
        accessibilityLabel="Enabled"
      />,
    );
    const node = screen.getByTestId("on");
    expect(node.getAttribute("role")).toBe("switch");
    expect(node.getAttribute("aria-checked")).toBe("true");
  });

  it("blocks interaction when disabled", () => {
    const onCheckedChange = vi.fn();
    renderWithSharedUI(
      <Switch
        testID="off"
        checked={false}
        disabled
        onCheckedChange={onCheckedChange}
        accessibilityLabel="Locked"
      />,
    );
    fireEvent.click(screen.getByTestId("off"));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("meets minimum touch target", () => {
    renderWithSharedUI(
      <Switch
        testID="size"
        checked={false}
        onCheckedChange={() => {}}
        accessibilityLabel="Size"
      />,
    );
    const node = screen.getByTestId("size") as HTMLElement;
    expect(Number.parseInt(node.style.minHeight, 10)).toBe(
      MIN_TOUCH_TARGET_SIZE,
    );
  });
});
