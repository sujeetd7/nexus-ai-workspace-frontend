/**
 * @vitest-environment jsdom
 */

import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Bootstrap } from "./bootstrap";
import { resetWebBootstrapForTests } from "./bootstrapApp";

vi.mock("../router/AppRouter", () => ({
  AppRouter: () => <div>Router Ready</div>,
}));

describe("Bootstrap providers", () => {
  beforeEach(() => {
    resetWebBootstrapForTests();
  });

  it("renders ready application content after bootstrap", async () => {
    render(<Bootstrap />);

    await waitFor(() => {
      expect(screen.getByText("Router Ready")).toBeTruthy();
    });
  });
});
