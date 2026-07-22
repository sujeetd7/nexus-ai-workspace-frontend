import { describe, expect, it } from "vitest";

import {
  getContrastRatio,
  getContrastThreshold,
  meetsContrastRequirement,
} from "./contrast";
import { REQUIRED_CONTRAST_PAIRS } from "./contrastPairs";

describe("contrast utilities", () => {
  it("computes known WCAG sample ratios", () => {
    // Black on white ≈ 21:1
    expect(getContrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 0);
    expect(meetsContrastRequirement("#000000", "#FFFFFF", "aaa-normal")).toBe(
      true,
    );
  });

  it("rejects non-opaque hex colors", () => {
    expect(() => getContrastRatio("rgba(0,0,0,0.5)", "#FFFFFF")).toThrow(
      /opaque/,
    );
  });
});

describe("semantic theme contrast pairs (WCAG AA)", () => {
  it("validates every required light and dark pair by token id", () => {
    for (const pair of REQUIRED_CONTRAST_PAIRS) {
      const ratio = getContrastRatio(pair.foreground, pair.background);
      const threshold = getContrastThreshold(pair.level);
      expect(
        ratio,
        `${pair.id}: ${pair.foregroundToken} on ${pair.backgroundToken} = ${ratio.toFixed(2)} (need ≥ ${threshold})`,
      ).toBeGreaterThanOrEqual(threshold);
    }
  });

  it("covers both light and dark themes", () => {
    const themes = new Set(REQUIRED_CONTRAST_PAIRS.map((pair) => pair.theme));
    expect(themes.has("light")).toBe(true);
    expect(themes.has("dark")).toBe(true);
  });
});
