/**
 * WCAG 2.x relative luminance and contrast-ratio helpers.
 * Intended for tests and development validation — not for hot render paths.
 */

export type ContrastLevel = "aa-normal" | "aa-large" | "aaa-normal" | "aaa-large";

const THRESHOLDS: Record<ContrastLevel, number> = {
  "aa-normal": 4.5,
  "aa-large": 3,
  "aaa-normal": 7,
  "aaa-large": 4.5,
};

function channelToLinear(channel: number): number {
  const value = channel / 255;
  return value <= 0.03928
    ? value / 12.92
    : ((value + 0.055) / 1.055) ** 2.4;
}

function parseHexColor(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.trim().replace(/^#/, "");

  if (!/^[0-9A-Fa-f]{6}$/.test(normalized)) {
    throw new Error(
      `contrast: expected opaque #RRGGBB hex, received "${hex}". Opacity-composited colors are unsupported.`,
    );
  }

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

/** Relative luminance per WCAG 2.x (sRGB). */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = parseHexColor(hex);
  return (
    0.2126 * channelToLinear(r) +
    0.7152 * channelToLinear(g) +
    0.0722 * channelToLinear(b)
  );
}

/** Contrast ratio between two opaque sRGB hex colors (WCAG 2.x). */
export function getContrastRatio(foreground: string, background: string): number {
  const L1 = relativeLuminance(foreground);
  const L2 = relativeLuminance(background);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function getContrastThreshold(level: ContrastLevel): number {
  return THRESHOLDS[level];
}

export function meetsContrastRequirement(
  foreground: string,
  background: string,
  level: ContrastLevel = "aa-normal",
): boolean {
  return getContrastRatio(foreground, background) >= THRESHOLDS[level];
}
