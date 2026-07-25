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
    expect(
      node.getAttribute("accessibilityLabel") ??
        node.getAttribute("aria-label"),
    ).toContain("Warning");
    expect(node.getAttribute("aria-hidden")).toBeNull();
  });
});
