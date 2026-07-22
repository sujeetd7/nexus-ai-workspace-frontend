import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MIN_TOUCH_TARGET_SIZE } from "../../accessibility/touchTargets";
import { renderWithSharedUI } from "../../testing/render";
import { Chip } from "./Chip";

afterEach(() => {
  cleanup();
});

describe("Chip", () => {
  it("toggles press when enabled", () => {
    const onPress = vi.fn();
    renderWithSharedUI(
      <Chip testID="chip" onPress={onPress}>
        Filter
      </Chip>,
    );
    fireEvent.click(screen.getByTestId("chip"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("exposes selected and disabled states", () => {
    renderWithSharedUI(
      <Chip testID="selected" selected>
        On
      </Chip>,
    );
    expect(screen.getByTestId("selected").getAttribute("aria-pressed")).toBe(
      "true",
    );

    const onPress = vi.fn();
    renderWithSharedUI(
      <Chip testID="off" disabled onPress={onPress}>
        Off
      </Chip>,
    );
    fireEvent.click(screen.getByTestId("off"));
    expect(onPress).not.toHaveBeenCalled();
    expect(
      (screen.getByTestId("off") as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it("meets minimum touch target height", () => {
    renderWithSharedUI(<Chip testID="size">Tag</Chip>);
    const node = screen.getByTestId("size") as HTMLElement;
    expect(Number.parseInt(node.style.minHeight, 10)).toBe(
      MIN_TOUCH_TARGET_SIZE,
    );
  });
});
