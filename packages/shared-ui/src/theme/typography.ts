/**
 * Typography tokens — single source of truth for type scale.
 * Flat size keys remain for Batch 2.1 compatibility.
 */
export const typography = {
  fontFamily: "Inter",

  display: 48,
  h1: 36,
  h2: 30,
  h3: 24,
  body: 16,
  caption: 12,
  label: 14,

  size: {
    display: 48,
    h1: 36,
    h2: 30,
    h3: 24,
    body: 16,
    caption: 12,
    label: 14,
  },

  fontWeight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },

  lineHeight: {
    display: 56,
    h1: 44,
    h2: 38,
    h3: 32,
    body: 24,
    caption: 16,
    label: 20,
  },

  letterSpacing: {
    display: -0.5,
    h1: -0.25,
    h2: -0.25,
    h3: 0,
    body: 0,
    caption: 0.2,
    label: 0.1,
  },
} as const;
