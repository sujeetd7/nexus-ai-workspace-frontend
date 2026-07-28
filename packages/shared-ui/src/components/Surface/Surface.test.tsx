import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { Text } from "../Text";
import { Surface } from "./Surface";

afterEach(() => {
  cleanup();
});

describe("Surface", () => {
  it("renders elevated content", () => {
    renderWithSharedUI(
      <Surface elevation="md" padding="lg" testID="surface">
        <Text>Content</Text>
      </Surface>,
    );
    expect(screen.getByTestId("surface").textContent).toContain("Content");
  });

  it("supports dark theme", () => {
    renderWithSharedUI(
      <Surface elevation="sm" testID="surface-dark">
        <Text>Dark</Text>
      </Surface>,
      { preference: "dark" },
    );
    expect(screen.getByTestId("surface-dark").textContent).toContain("Dark");
  });

  it("exposes additive surfaceMuted background and subtle border", () => {
    renderWithSharedUI(
      <Surface
        testID="muted"
        background="surfaceMuted"
        borderTone="subtle"
        elevation="none"
      >
        <Text>Muted</Text>
      </Surface>,
    );
    const node = screen.getByTestId("muted") as HTMLElement;
    expect(node.textContent).toContain("Muted");
    expect(node.style.borderColor.toLowerCase()).toBe("rgb(243, 244, 246)");
  });
});
