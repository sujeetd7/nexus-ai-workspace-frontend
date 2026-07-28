import { describe, expect, it } from "vitest";

import { themes } from "../tamagui/mapTokens";
import { darkTheme } from "./dark";
import { lightTheme } from "./light";
import {
  darkSemanticColors,
  lightSemanticColors,
} from "./semanticColors";
import { shadows } from "./shadows";
import { typography } from "./typography";

/** Pre–5.DS.1 semantic keys that must remain stable (values + presence). */
const LEGACY_SEMANTIC_KEYS = [
  "background",
  "surface",
  "text",
  "textSecondary",
  "border",
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
  "onPrimary",
  "onDanger",
  "focusRing",
] as const;

const BATCH_51_SEMANTIC_KEYS = ["surfaceMuted", "borderSubtle"] as const;

const FORBIDDEN_SUBSTRINGS = [
  "chatgpt",
  "openai",
  "lavender",
] as const;

describe("Batch 5.DS.1 semantic token gaps", () => {
  it("adds surfaceMuted and borderSubtle to light and dark semantics", () => {
    for (const key of BATCH_51_SEMANTIC_KEYS) {
      expect(lightSemanticColors[key]).toEqual(expect.any(String));
      expect(darkSemanticColors[key]).toEqual(expect.any(String));
      expect(lightTheme.semantic[key]).toBe(lightSemanticColors[key]);
      expect(darkTheme.semantic[key]).toBe(darkSemanticColors[key]);
    }
  });

  it("keeps legacy semantic keys and light primary brand unchanged", () => {
    for (const key of LEGACY_SEMANTIC_KEYS) {
      expect(lightSemanticColors).toHaveProperty(key);
      expect(darkSemanticColors).toHaveProperty(key);
    }
    expect(lightSemanticColors.primary).toBe("#2563EB");
    expect(lightSemanticColors.background).toBe("#FFFFFF");
    expect(lightSemanticColors.surface).toBe("#F9FAFB");
    expect(lightSemanticColors.text).toBe("#111827");
    expect(lightSemanticColors.textSecondary).toBe("#4B5563");
    expect(lightSemanticColors.border).toBe("#E5E7EB");
  });

  it("derives new semantics from the existing gray palette (no new brand hex)", () => {
    expect(lightSemanticColors.surfaceMuted).toBe("#F3F4F6");
    expect(lightSemanticColors.borderSubtle).toBe("#F3F4F6");
    expect(darkSemanticColors.surfaceMuted).toBe("#1F2937");
    expect(darkSemanticColors.borderSubtle).toBe("#1F2937");
  });

  it("does not introduce ChatGPT / OpenAI naming in semantic keys", () => {
    const keys = [
      ...Object.keys(lightSemanticColors),
      ...Object.keys(darkSemanticColors),
      ...Object.keys(typography.size),
    ]
      .join(" ")
      .toLowerCase();
    for (const forbidden of FORBIDDEN_SUBSTRINGS) {
      expect(keys.includes(forbidden)).toBe(false);
    }
  });

  it("aligns Tamagui theme maps with Nexus semantic additions", () => {
    expect(themes.light.surfaceMuted).toBe(lightSemanticColors.surfaceMuted);
    expect(themes.dark.surfaceMuted).toBe(darkSemanticColors.surfaceMuted);
    expect(themes.light.borderSubtle).toBe(lightSemanticColors.borderSubtle);
    expect(themes.dark.borderSubtle).toBe(darkSemanticColors.borderSubtle);
  });

  it("adds sectionLabel typography as a caption-size semantic alias", () => {
    expect(typography.sectionLabel).toBe(typography.caption);
    expect(typography.size.sectionLabel).toBe(typography.size.caption);
    expect(typography.lineHeight.sectionLabel).toBe(
      typography.lineHeight.caption,
    );
    expect(typography.letterSpacing.sectionLabel).toBe(
      typography.letterSpacing.caption,
    );
  });

  it("does not add composer-specific shadow or inverse action semantics", () => {
    expect(shadows).toEqual({
      sm: "0 1px 2px rgba(0,0,0,.08)",
      md: "0 4px 8px rgba(0,0,0,.10)",
      lg: "0 10px 20px rgba(0,0,0,.15)",
    });
    expect(lightSemanticColors).not.toHaveProperty("inverse");
    expect(lightSemanticColors).not.toHaveProperty("onInverse");
    expect(lightSemanticColors).not.toHaveProperty("textTertiary");
    expect(lightSemanticColors).not.toHaveProperty("surfaceElevated");
    expect(lightSemanticColors).not.toHaveProperty("borderStrong");
    expect(lightSemanticColors).not.toHaveProperty("selected");
  });

  it("keeps light and dark semantic key sets aligned", () => {
    expect(Object.keys(lightSemanticColors).sort()).toEqual(
      Object.keys(darkSemanticColors).sort(),
    );
  });
});
