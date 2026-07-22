import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { Text } from "../Text";
import { Card } from "./Card";

afterEach(() => {
  cleanup();
});

describe("Card", () => {
  it("renders header, body, and footer slots", () => {
    renderWithSharedUI(
      <Card
        testID="card"
        header={<Text>Header</Text>}
        footer={<Text>Footer</Text>}
      >
        <Text>Body</Text>
      </Card>,
    );
    expect(screen.getByTestId("card-header").textContent).toContain("Header");
    expect(screen.getByTestId("card-body").textContent).toContain("Body");
    expect(screen.getByTestId("card-footer").textContent).toContain("Footer");
  });

  it("renders body-only without header/footer slots", () => {
    renderWithSharedUI(
      <Card testID="simple">
        <Text>Only body</Text>
      </Card>,
    );
    expect(screen.getByTestId("simple-body").textContent).toContain("Only body");
    expect(screen.queryByTestId("simple-header")).toBeNull();
    expect(screen.queryByTestId("simple-footer")).toBeNull();
  });
});
