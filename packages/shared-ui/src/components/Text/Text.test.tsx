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
      <Text variant="h1" accessibilityRole="heading">
        Title
      </Text>,
    );
    expect(screen.getByText("Title")).toBeTruthy();
  });

  it("maps legacy title/heading aliases", () => {
    renderWithSharedUI(<Text variant="title">Legacy</Text>);
    expect(screen.getByText("Legacy")).toBeTruthy();
  });
});
