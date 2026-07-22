import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { Label } from "./Label";

afterEach(() => {
  cleanup();
});

describe("Label", () => {
  it("renders label text and required marker", () => {
    renderWithSharedUI(
      <Label htmlFor="name" required>
        Name
      </Label>,
    );
    expect(screen.getByText(/Name/)).toBeTruthy();
    expect(screen.getByText(/\*/)).toBeTruthy();
  });
});
