import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { HelperText } from "./HelperText";

afterEach(() => {
  cleanup();
});

describe("HelperText", () => {
  it("renders caption helper copy", () => {
    renderWithSharedUI(
      <HelperText id="help" testID="help">
        Hint
      </HelperText>,
    );
    expect(screen.getByTestId("help").textContent).toContain("Hint");
  });
});
