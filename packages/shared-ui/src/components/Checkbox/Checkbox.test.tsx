import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MIN_TOUCH_TARGET_SIZE } from "../../accessibility/touchTargets";
import { renderWithSharedUI } from "../../testing/render";
import { Checkbox } from "./Checkbox";

afterEach(() => {
  cleanup();
});

describe("Checkbox (web)", () => {
  it("toggles checked state and calls onCheckedChange", () => {
    const onCheckedChange = vi.fn();
    renderWithSharedUI(
      <Checkbox
        testID="terms"
        label="Accept terms"
        onCheckedChange={onCheckedChange}
      />,
    );
    const node = screen.getByTestId("terms");
    expect(node.getAttribute("role")).toBe("checkbox");
    expect(node.getAttribute("aria-checked")).toBe("false");
    fireEvent.click(node);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("supports controlled checked and disabled", () => {
    const onCheckedChange = vi.fn();
    renderWithSharedUI(
      <Checkbox
        testID="remember"
        label="Remember me"
        checked
        disabled
        onCheckedChange={onCheckedChange}
      />,
    );
    const node = screen.getByTestId("remember") as HTMLButtonElement;
    expect(node.getAttribute("aria-checked")).toBe("true");
    expect(node.disabled).toBe(true);
    fireEvent.click(node);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("exposes indeterminate as aria-checked mixed", () => {
    renderWithSharedUI(
      <Checkbox testID="all" label="Select all" indeterminate />,
    );
    expect(screen.getByTestId("all").getAttribute("aria-checked")).toBe(
      "mixed",
    );
  });

  it("supports keyboard activation", () => {
    const onCheckedChange = vi.fn();
    renderWithSharedUI(
      <Checkbox testID="kb" label="Opt in" onCheckedChange={onCheckedChange} />,
    );
    const node = screen.getByTestId("kb");
    node.focus();
    fireEvent.keyDown(node, { key: " " });
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("meets minimum touch target", () => {
    renderWithSharedUI(<Checkbox testID="touch" label="Touch" />);
    const node = screen.getByTestId("touch") as HTMLElement;
    expect(node.style.minHeight).toBe(`${MIN_TOUCH_TARGET_SIZE}px`);
    expect(node.style.minWidth).toBe(`${MIN_TOUCH_TARGET_SIZE}px`);
  });
});
