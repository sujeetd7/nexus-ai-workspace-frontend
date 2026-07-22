import { describe, expect, it } from "vitest";

import {
  isThemePreference,
  resolveThemeMode,
} from "./resolveThemeMode";
import { colors } from "./colors";
import { darkColors } from "./darkColors";
import {
  darkSemanticColors,
  lightSemanticColors,
} from "./semanticColors";
import { typography } from "./typography";

describe("resolveThemeMode", () => {
  it("resolves explicit preferences", () => {
    expect(resolveThemeMode("light", true)).toBe("light");
    expect(resolveThemeMode("dark", false)).toBe("dark");
  });

  it("resolves system preference from system flag", () => {
    expect(resolveThemeMode("system", true)).toBe("dark");
    expect(resolveThemeMode("system", false)).toBe("light");
  });

  it("validates preference strings", () => {
    expect(isThemePreference("system")).toBe(true);
    expect(isThemePreference("nope")).toBe(false);
  });
});

describe("semantic color mapping", () => {
  it("derives light semantic roles from the palette", () => {
    expect(lightSemanticColors.background).toBe(colors.white);
    expect(lightSemanticColors.text).toBe(colors.gray[900]);
    expect(lightSemanticColors.primary).toBe(colors.primary);
  });

  it("derives dark semantic roles from darkColors", () => {
    expect(darkSemanticColors.background).toBe(darkColors.background);
    expect(darkSemanticColors.surface).toBe(darkColors.surface);
    expect(darkSemanticColors.info).toBe(colors.info);
  });
});

describe("typography tokens", () => {
  it("keeps flat size keys aligned with size map", () => {
    expect(typography.display).toBe(typography.size.display);
    expect(typography.body).toBe(typography.size.body);
  });

  it("exposes weight, lineHeight, and letterSpacing scales", () => {
    expect(typography.fontWeight.regular).toBe("400");
    expect(typography.lineHeight.body).toBe(24);
    expect(typography.letterSpacing.body).toBe(0);
  });
});
