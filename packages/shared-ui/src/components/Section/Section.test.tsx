import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { Text } from "../Text";
import { Section } from "./Section";

afterEach(() => {
  cleanup();
});

describe("Section", () => {
  it("renders title and children with consistent spacing container", () => {
    renderWithSharedUI(
      <Section title="Details" testID="section" gap="lg" padding="xl">
        <Text>Child</Text>
      </Section>,
    );
    expect(screen.getByTestId("section-title").textContent).toContain(
      "Details",
    );
    expect(screen.getByText("Child")).toBeTruthy();
  });

  it("supports media-free responsive padding props without page layout", () => {
    renderWithSharedUI(
      <Section testID="plain" padding="md">
        <Text>Plain</Text>
      </Section>,
    );
    expect(screen.getByTestId("plain").textContent).toContain("Plain");
    expect(screen.queryByTestId("plain-title")).toBeNull();
  });
});
