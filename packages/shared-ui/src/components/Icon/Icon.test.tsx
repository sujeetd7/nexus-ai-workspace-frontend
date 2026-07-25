import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { Text } from "../Text";
import { Icon } from "./Icon";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Icon", () => {
  it("hides decorative icons from assistive technology", () => {
    renderWithSharedUI(
      <Icon testID="deco" decorative>
        <Text>*</Text>
      </Icon>,
    );
    const node = screen.getByTestId("deco");
    expect(node.getAttribute("aria-hidden")).toBe("true");
  });

  it("requires and exposes accessibilityLabel when meaningful", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    renderWithSharedUI(
      <Icon testID="warn" decorative={false}>
        <Text>!</Text>
      </Icon>,
    );
    expect(error).toHaveBeenCalled();

    cleanup();
    renderWithSharedUI(
      <Icon
        testID="alert"
        decorative={false}
        accessibilityLabel="Warning"
      >
        <Text>!</Text>
      </Icon>,
    );
    const node = screen.getByTestId("alert");
    expect(node.getAttribute("aria-label")).toBe("Warning");
    expect(node.getAttribute("accessibilityLabel")).toBeNull();
    expect(node.getAttribute("accessibilityRole")).toBeNull();
    expect(node.getAttribute("role")).toBe("img");
    expect(node.getAttribute("aria-hidden")).toBeNull();
  });

  it("does not log React unknown-prop warnings for decorative icons", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    renderWithSharedUI(
      <Icon testID="deco-quiet" decorative>
        <Text>*</Text>
      </Icon>,
    );
    const unknownPropWarnings = error.mock.calls.filter((call) =>
      String(call[0] ?? "").includes("React does not recognize"),
    );
    expect(unknownPropWarnings).toHaveLength(0);
  });
});
