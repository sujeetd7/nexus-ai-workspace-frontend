import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { Badge } from "./Badge";

afterEach(() => {
  cleanup();
});

describe("Badge", () => {
  it("renders semantic variants without throwing", () => {
    renderWithSharedUI(
      <>
        <Badge variant="neutral" testID="b-neutral">
          Neutral
        </Badge>
        <Badge variant="success" testID="b-success">
          Success
        </Badge>
        <Badge variant="danger" size="sm" testID="b-danger">
          Danger
        </Badge>
      </>,
    );
    expect(screen.getByTestId("b-neutral").textContent).toContain("Neutral");
    expect(screen.getByTestId("b-success").textContent).toContain("Success");
    expect(screen.getByTestId("b-danger").textContent).toContain("Danger");
  });

  it("supports dark theme surfaces", () => {
    renderWithSharedUI(
      <Badge variant="primary" testID="b-dark">
        Primary
      </Badge>,
      { preference: "dark" },
    );
    expect(screen.getByTestId("b-dark").textContent).toContain("Primary");
  });
});
