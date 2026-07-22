/**
 * Canonical breakpoint scale for `@nexus/shared-ui`.
 *
 * Web Tamagui `media` and React Native device-class helpers both derive from
 * this object. Applications must not define a competing shared breakpoint scale.
 */
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export type BreakpointName = keyof typeof breakpoints;

/** Ascending order of breakpoint names (stable public identifiers). */
export const BREAKPOINT_ORDER = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
] as const satisfies readonly BreakpointName[];

/**
 * Tamagui media query names mirror breakpoint names.
 * Mapping lives in `tamagui/mapTokens.ts` and must import `breakpoints` — never literals.
 */
export type MediaName = BreakpointName;
