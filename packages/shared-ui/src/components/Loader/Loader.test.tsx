import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { Loader } from "./Loader";

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(globalThis, "matchMedia");
  vi.restoreAllMocks();
});

describe("Loader", () => {
  it("exposes an accessible loading label on the root", () => {
    renderWithSharedUI(
      <Loader testID="loader" accessibilityLabel="Fetching data" />,
    );
    expect(screen.getByTestId("loader").getAttribute("aria-label")).toBe(
      "Fetching data",
    );
  });

  it("uses static text when reduced motion is preferred", () => {
    Object.defineProperty(globalThis, "matchMedia", {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: String(query).includes("prefers-reduced-motion"),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    renderWithSharedUI(<Loader accessibilityLabel="Please wait" size="sm" />);
    expect(screen.getByText("Please wait")).toBeTruthy();
  });
});
