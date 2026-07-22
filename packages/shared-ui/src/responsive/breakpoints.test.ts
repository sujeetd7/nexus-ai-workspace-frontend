import { describe, expect, it } from "vitest";

import { media } from "../tamagui/mapTokens";
import {
  BREAKPOINT_ORDER,
  breakpoints,
  type BreakpointName,
} from "./breakpoints";
import {
  getDeviceClass,
  isDesktop,
  isMobile,
  isTablet,
  resolveBreakpoint,
} from "./responsive";

describe("breakpoints source of truth", () => {
  it("keeps stable ordered names and ascending values", () => {
    expect([...BREAKPOINT_ORDER]).toEqual(["xs", "sm", "md", "lg", "xl"]);

    for (let index = 1; index < BREAKPOINT_ORDER.length; index += 1) {
      const previous = BREAKPOINT_ORDER[index - 1]!;
      const current = BREAKPOINT_ORDER[index]!;
      expect(breakpoints[current]).toBeGreaterThan(breakpoints[previous]);
    }
  });

  it("keeps Tamagui media derived from shared breakpoints (no literal drift)", () => {
    expect(media.xs).toEqual({ maxWidth: breakpoints.sm });
    expect(media.sm).toEqual({ minWidth: breakpoints.sm });
    expect(media.md).toEqual({ minWidth: breakpoints.md });
    expect(media.lg).toEqual({ minWidth: breakpoints.lg });
    expect(media.xl).toEqual({ minWidth: breakpoints.xl });

    const mediaNames = Object.keys(media).sort();
    const breakpointNames = Object.keys(breakpoints).sort();
    expect(mediaNames).toEqual(breakpointNames);
  });
});

describe("resolveBreakpoint / device class", () => {
  it("resolves the largest matching breakpoint for a width", () => {
    const cases: Array<[number, BreakpointName]> = [
      [0, "xs"],
      [639, "xs"],
      [640, "sm"],
      [767, "sm"],
      [768, "md"],
      [1023, "md"],
      [1024, "lg"],
      [1279, "lg"],
      [1280, "xl"],
      [1920, "xl"],
    ];

    for (const [width, expected] of cases) {
      expect(resolveBreakpoint(width)).toBe(expected);
    }
  });

  it("classifies mobile / tablet / desktop ranges", () => {
    expect(isMobile(320)).toBe(true);
    expect(isTablet(800)).toBe(true);
    expect(isDesktop(1200)).toBe(true);
    expect(getDeviceClass(500)).toBe("mobile");
    expect(getDeviceClass(900)).toBe("tablet");
    expect(getDeviceClass(1400)).toBe("desktop");
  });

  it("treats non-finite widths safely without throwing", () => {
    expect(resolveBreakpoint(Number.NaN)).toBe("xs");
    expect(isMobile(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isDesktop(Number.POSITIVE_INFINITY)).toBe(true);
  });
});
