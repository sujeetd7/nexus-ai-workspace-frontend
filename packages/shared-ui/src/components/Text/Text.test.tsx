import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { Text } from "./Text";

afterEach(() => {
  cleanup();
});

describe("Text", () => {
  it("renders body text by default", () => {
    renderWithSharedUI(<Text>Hello</Text>);
    expect(screen.getByText("Hello")).toBeTruthy();
  });

  it("supports typography variants and semantic roles", () => {
    renderWithSharedUI(
      <Text variant="h1" testID="title" accessibilityRole="heading" id="page-title">
        Title
      </Text>,
    );
    const node = screen.getByTestId("title");
    expect(node.getAttribute("role")).toBe("heading");
    expect(node.getAttribute("id")).toBe("page-title");
    expect(node.getAttribute("nativeID")).toBeNull();
    expect(node.getAttribute("accessibilityRole")).toBeNull();
  });

  it("maps legacy title/heading aliases", () => {
    renderWithSharedUI(<Text variant="title">Legacy</Text>);
    expect(screen.getByText("Legacy")).toBeTruthy();
  });

  it("exposes additive sectionLabel variant without forcing muted color", () => {
    renderWithSharedUI(
      <Text variant="sectionLabel" testID="section">
        Today
      </Text>,
    );
    expect(screen.getByTestId("section").textContent).toBe("Today");
  });
});
