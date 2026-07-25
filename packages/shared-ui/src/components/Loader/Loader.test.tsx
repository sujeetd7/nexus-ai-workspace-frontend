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
    const node = screen.getByTestId("loader");
    expect(node.getAttribute("aria-label")).toBe("Fetching data");
    expect(node.getAttribute("role")).toBe("progressbar");
    expect(node.getAttribute("aria-busy")).toBe("true");
    expect(node.getAttribute("accessibilityLabel")).toBeNull();
    expect(node.getAttribute("accessibilityRole")).toBeNull();
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
