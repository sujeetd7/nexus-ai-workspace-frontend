import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { Text } from "../Text";
import { Stack, XStack } from "./Stack";

afterEach(() => {
  cleanup();
});

describe("Stack", () => {
  it("renders children with gap direction defaults", () => {
    renderWithSharedUI(
      <Stack testID="stack" gap="sm">
        <Text>One</Text>
        <Text>Two</Text>
      </Stack>,
    );
    expect(screen.getByTestId("stack")).toBeTruthy();
    expect(screen.getByText("One")).toBeTruthy();
    expect(screen.getByText("Two")).toBeTruthy();
  });

  it("supports XStack alias", () => {
    renderWithSharedUI(
      <XStack testID="row">
        <Text>A</Text>
      </XStack>,
    );
    expect(screen.getByTestId("row")).toBeTruthy();
  });
});
