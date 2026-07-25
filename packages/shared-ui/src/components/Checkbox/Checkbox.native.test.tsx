import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { Checkbox } from "./Checkbox.native";

afterEach(() => {
  cleanup();
});

describe("Checkbox.native (Pressable under RNW)", () => {
  it("exposes checkbox role and checked state", () => {
    renderWithSharedUI(
      <Checkbox testID="terms" label="Accept" defaultChecked />,
    );
    const node = screen.getByTestId("terms");
    expect(
      node.getAttribute("accessibilityRole") ?? node.getAttribute("role"),
    ).toMatch(/checkbox/i);
  });

  it("invokes onCheckedChange and blocks when disabled", () => {
    const onCheckedChange = vi.fn();
    const { rerender } = renderWithSharedUI(
      <Checkbox
        testID="opt"
        label="Opt"
        onCheckedChange={onCheckedChange}
      />,
    );
    fireEvent.click(screen.getByTestId("opt"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    onCheckedChange.mockClear();
    rerender(
      <Checkbox
        testID="opt"
        label="Opt"
        disabled
        onCheckedChange={onCheckedChange}
      />,
    );
    fireEvent.click(screen.getByTestId("opt"));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
