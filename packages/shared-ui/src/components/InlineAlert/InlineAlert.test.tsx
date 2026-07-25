import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { Text } from "../Text";
import { InlineAlert } from "./InlineAlert";

afterEach(() => {
  cleanup();
});

describe("InlineAlert", () => {
  it("uses alert role for error tone", () => {
    renderWithSharedUI(
      <InlineAlert tone="error" title="Sign-in failed" testID="alert">
        Invalid email or password.
      </InlineAlert>,
    );
    const root = screen.getByTestId("alert");
    expect(root.getAttribute("role")).toBe("alert");
    expect(screen.getByTestId("alert-title").textContent).toContain(
      "Sign-in failed",
    );
    expect(screen.getByTestId("alert-body").textContent).toContain(
      "Invalid email or password.",
    );
  });

  it("uses native informational semantics and renders action slot", () => {
    renderWithSharedUI(
      <InlineAlert
        tone="info"
        testID="info"
        action={<Text>Retry</Text>}
      >
        Check your inbox.
      </InlineAlert>,
    );
    const infoNode = screen.getByTestId("info");
    // Static info content: no live-region role on web (RN keeps accessibilityRole="text").
    expect(infoNode.getAttribute("role")).toBeNull();
    expect(screen.getByTestId("info-action").textContent).toContain("Retry");
  });
});
