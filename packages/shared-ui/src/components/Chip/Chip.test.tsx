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

  it("uses pill radius by default and muted tone when requested", () => {
    renderWithSharedUI(<Chip testID="pill">Quick</Chip>);
    expect(
      (screen.getByTestId("pill") as HTMLElement).style.borderRadius,
    ).toBe("999px");

    renderWithSharedUI(
      <Chip testID="muted" tone="muted">
        Muted
      </Chip>,
    );
    const muted = screen.getByTestId("muted") as HTMLElement;
    expect(muted.style.backgroundColor.toLowerCase()).toBe(
      "rgb(243, 244, 246)",
    );
    expect(muted.style.borderColor.toLowerCase()).toBe("rgb(243, 244, 246)");
  });

  it("keeps selected chips on Nexus primary regardless of tone", () => {
    renderWithSharedUI(
      <Chip testID="sel" selected tone="muted">
        On
      </Chip>,
    );
    const node = screen.getByTestId("sel") as HTMLElement;
    expect(node.getAttribute("aria-pressed")).toBe("true");
    expect(node.style.backgroundColor.toLowerCase()).toBe(
      "rgb(37, 99, 235)",
    );
  });
});
