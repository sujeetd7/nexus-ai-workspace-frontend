import { afterEach, describe, expect, it, vi } from "vitest";

import {
  MOTION_EASING,
  createCssTransition,
  createMotionStyle,
  resolveTransitionDuration,
} from "./transitions";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("motion transitions", () => {
  it("resolves duration tokens from the motion SoT", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    expect(resolveTransitionDuration("fast")).toBe("150ms");
    expect(resolveTransitionDuration("normal")).toBe("250ms");
    expect(resolveTransitionDuration("slow")).toBe("400ms");
  });

  it("returns 0ms / none when reduced motion is preferred", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: String(query).includes("prefers-reduced-motion"),
    }));
    expect(resolveTransitionDuration("normal")).toBe("0ms");
    expect(createCssTransition("opacity")).toBe("none");
  });

  it("builds multi-property CSS transitions with standard easing", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    expect(createCssTransition(["opacity", "transform"], { duration: "fast" })).toBe(
      `opacity 150ms ${MOTION_EASING.standard}, transform 150ms ${MOTION_EASING.standard}`,
    );
    expect(createMotionStyle("opacity", { duration: "slow" }).transition).toContain(
      "400ms",
    );
  });
});
