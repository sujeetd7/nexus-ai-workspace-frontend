import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { View } from "./View";

afterEach(() => {
  cleanup();
});

describe("View", () => {
  it("renders children and test ids", () => {
    renderWithSharedUI(
      <View testID="box" background="surface" padding="md">
        Content
      </View>,
    );
    expect(screen.getByText("Content")).toBeTruthy();
    expect(screen.getByTestId("box")).toBeTruthy();
  });

  it("maps cross-platform a11y props to DOM attributes", () => {
    renderWithSharedUI(
      <View
        testID="panel"
        accessibilityLabel="Settings panel"
        accessibilityHint="Contains account settings"
        accessibilityRole="text"
      >
        Body
      </View>,
    );
    const node = screen.getByTestId("panel");
    expect(node.getAttribute("data-testid")).toBe("panel");
    expect(node.getAttribute("aria-label")).toBe("Settings panel");
    // "text" is RN-only; web/Tamagui must not emit invalid role="text".
    expect(node.getAttribute("role")).toBeNull();
    expect(node.getAttribute("testID")).toBeNull();
    expect(node.getAttribute("nativeID")).toBeNull();
    expect(node.getAttribute("accessibilityLabel")).toBeNull();
    expect(node.getAttribute("accessibilityHint")).toBeNull();
    expect(node.getAttribute("accessibilityRole")).toBeNull();
    expect(node.getAttribute("title")).toBeNull();
  });

  it("does not log React unknown-prop warnings for mapped a11y props", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    renderWithSharedUI(
      <View
        testID="quiet"
        accessibilityLabel="Quiet"
        accessibilityHint="hint"
        accessibilityRole="alert"
      >
        ok
      </View>,
    );
    const unknownPropWarnings = error.mock.calls.filter((call) =>
      String(call[0] ?? "").includes("React does not recognize"),
    );
    expect(unknownPropWarnings).toHaveLength(0);
    error.mockRestore();
  });

  it("exposes additive surfaceMuted semantic background", () => {
    renderWithSharedUI(
      <View testID="muted" background="surfaceMuted" padding="md">
        Muted fill
      </View>,
    );
    expect(screen.getByTestId("muted").textContent).toContain("Muted fill");
  });
});
