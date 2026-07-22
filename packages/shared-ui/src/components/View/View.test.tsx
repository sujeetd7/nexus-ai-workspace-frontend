import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { View } from "./View";

afterEach(() => {
  cleanup();
});

describe("View", () => {
  it("renders children and test ids", () => {
    renderWithSharedUI(
      <View testID="box" background="surface" padding="md">
        Content
      </View>,
    );
    expect(screen.getByText("Content")).toBeTruthy();
    expect(screen.getByTestId("box")).toBeTruthy();
  });
});
