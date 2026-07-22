import { prefersReducedMotion } from "../accessibility/reducedMotion";
import { animations } from "../theme/animations";

/**
 * Approved CSS easing curves for web transitions.
 * Documented standards — not duplicated into the theme token SoT.
 */
export const MOTION_EASING = {
  /** Default UI transitions (opacity, color, transform). */
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  /** Linear — progress / indeterminate only when justified. */
  linear: "linear",
} as const;

export type MotionDurationToken = keyof typeof animations;
export type MotionEasingToken = keyof typeof MOTION_EASING;

export type CssTransitionOptions = {
  duration?: MotionDurationToken;
  easing?: MotionEasingToken;
};

/**
 * Resolves a Nexus duration token to a CSS time value.
 * Returns `0ms` when reduced motion is preferred.
 */
export function resolveTransitionDuration(
  token: MotionDurationToken = "normal",
): string {
  if (prefersReducedMotion()) {
    return "0ms";
  }
  return animations[token];
}

/**
 * Builds a CSS `transition` value from property names and Nexus motion tokens.
 * Returns `none` under reduced motion (no animation driver required).
 *
 * Prefer static styles when no transition is needed.
 */
export function createCssTransition(
  properties: string | readonly string[],
  options: CssTransitionOptions = {},
): string {
  if (prefersReducedMotion()) {
    return "none";
  }

  const duration = animations[options.duration ?? "normal"];
  const easing = MOTION_EASING[options.easing ?? "standard"];
  const list = typeof properties === "string" ? [properties] : properties;

  return list.map((property) => `${property} ${duration} ${easing}`).join(", ");
}

/**
 * Web-oriented style fragment for common opacity / color / transform transitions.
 * Safe to spread into `style` when a transition is justified.
 */
export function createMotionStyle(
  properties: string | readonly string[] = ["opacity", "background-color", "color", "transform"],
  options: CssTransitionOptions = {},
): { transition: string } {
  return { transition: createCssTransition(properties, options) };
}
