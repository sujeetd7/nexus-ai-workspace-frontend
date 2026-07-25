import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { Divider } from "./Divider";

afterEach(() => {
  cleanup();
});

describe("Divider", () => {
  it("renders decorative divider without accessible name noise", () => {
    renderWithSharedUI(<Divider testID="line" />);
    const node = screen.getByTestId("line");
    expect(node.getAttribute("aria-hidden")).toBe("true");
  });

  it("supports vertical orientation and semantic mode", () => {
    renderWithSharedUI(
      <Divider
        testID="sep"
        orientation="vertical"
        decorative={false}
        accessibilityLabel="Section"
      />,
    );
    const node = screen.getByTestId("sep");
    expect(node.getAttribute("role")).toBe("separator");
    expect(node.getAttribute("aria-label")).toBe("Section");
    expect(node.getAttribute("aria-hidden")).toBeNull();
    expect(node.getAttribute("accessibilityRole")).toBeNull();
  });
});
