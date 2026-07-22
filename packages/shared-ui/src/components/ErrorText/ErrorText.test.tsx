import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { ErrorText } from "./ErrorText";

afterEach(() => {
  cleanup();
});

describe("ErrorText", () => {
  it("exposes alert role for assistive tech", () => {
    renderWithSharedUI(
      <ErrorText id="err" testID="err">
        Required
      </ErrorText>,
    );
    const node = screen.getByTestId("err");
    expect(node.textContent).toContain("Required");
    expect(
      node.getAttribute("role") === "alert" ||
        node.getAttribute("aria-role") === "alert",
    ).toBe(true);
  });
});
