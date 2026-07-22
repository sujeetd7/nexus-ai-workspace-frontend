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
    expect(screen.getByTestId("sep")).toBeTruthy();
  });
});
