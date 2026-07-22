import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MIN_TOUCH_TARGET_SIZE } from "../../accessibility/touchTargets";
import { renderWithSharedUI } from "../../testing/render";
import { Button } from "./Button";

afterEach(() => {
  cleanup();
});

describe("Button (web native <button>)", () => {
  it("renders a native HTML button with default type=button", () => {
    renderWithSharedUI(<Button testID="save">Save</Button>);
    const node = screen.getByTestId("save");
    expect(node.tagName).toBe("BUTTON");
    expect(node.getAttribute("type")).toBe("button");
  });

  it("supports submit and reset types", () => {
    const { rerender } = renderWithSharedUI(
      <Button testID="save" type="submit">
        Save
      </Button>,
    );
    expect(screen.getByTestId("save").getAttribute("type")).toBe("submit");

    rerender(
      <Button testID="save" type="reset">
        Save
      </Button>,
    );
    expect(screen.getByTestId("save").getAttribute("type")).toBe("reset");
  });

  it("invokes onPress on click", () => {
    const onPress = vi.fn();
    renderWithSharedUI(
      <Button testID="save" onPress={onPress}>
        Save
      </Button>,
    );
    fireEvent.click(screen.getByTestId("save"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("uses native disabled and blocks activation", () => {
    const onPress = vi.fn();
    renderWithSharedUI(
      <Button testID="save" disabled onPress={onPress}>
        Save
      </Button>,
    );
    const node = screen.getByTestId("save") as HTMLButtonElement;
    expect(node.disabled).toBe(true);
    fireEvent.click(node);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("loading blocks activation with aria-busy and without HTML disabled", () => {
    const onPress = vi.fn();
    renderWithSharedUI(
      <Button
        testID="save"
        loading
        onPress={onPress}
        accessibilityLabel="Save"
      >
        Save
      </Button>,
    );
    const node = screen.getByTestId("save") as HTMLButtonElement;
    expect(node.disabled).toBe(false);
    expect(node.getAttribute("aria-busy")).toBe("true");
    expect(screen.getByText("Loading…")).toBeTruthy();
    fireEvent.click(node);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("preserves focus when toggling loading", () => {
    const { rerender } = renderWithSharedUI(
      <Button testID="save">Save</Button>,
    );
    const node = screen.getByTestId("save") as HTMLButtonElement;
    node.focus();
    expect(document.activeElement).toBe(node);

    rerender(
      <Button testID="save" loading accessibilityLabel="Save">
        Save
      </Button>,
    );
    const loadingNode = screen.getByTestId("save") as HTMLButtonElement;
    expect(loadingNode.disabled).toBe(false);
    expect(loadingNode.getAttribute("aria-busy")).toBe("true");
    loadingNode.focus();
    expect(document.activeElement).toBe(loadingNode);
  });

  it("does not emit invalid accessibilityState DOM attributes", () => {
    renderWithSharedUI(<Button testID="save">Save</Button>);
    const node = screen.getByTestId("save");
    expect(node.getAttribute("accessibilitystate")).toBeNull();
    expect(node.getAttribute("accessibilityRole")).toBeNull();
  });

  it("documents touch-target policy constant", () => {
    expect(MIN_TOUCH_TARGET_SIZE).toBe(44);
  });
});
