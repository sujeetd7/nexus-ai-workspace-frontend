/**
 * React Native minimum interactive target guidance (logical points).
 * Visual chrome may be smaller when hit-area expansion preserves spacing.
 *
 * See `docs/architecture/ACCESSIBILITY.md` — touch-target policy.
 */
export const MIN_TOUCH_TARGET_SIZE = 44;

export const TOUCH_TARGET = {
  /** Minimum width and height in logical points for interactive controls. */
  minSize: MIN_TOUCH_TARGET_SIZE,
} as const;

/**
 * Returns true when both dimensions meet the minimum interactive target size.
 * Does not account for `hitSlop` expansion — callers that expand hit area must document it.
 */
export function meetsMinimumTouchTarget(
  width: number,
  height: number,
): boolean {
  return width >= MIN_TOUCH_TARGET_SIZE && height >= MIN_TOUCH_TARGET_SIZE;
}
