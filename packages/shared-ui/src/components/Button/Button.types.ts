import type { ReactNode } from "react";

import type { PressHandler } from "../../types/events";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive";

export type ButtonSize = "sm" | "md" | "lg";

/**
 * Additive shape grammar (Batch 5.DS.2).
 * Default keeps `radius.md`; `pill` maps to `radius.pill` for screenshot action pills.
 */
export type ButtonShape = "default" | "pill";

/** HTML button type — honored on web; accepted and ignored on React Native. */
export type ButtonType = "button" | "submit" | "reset";

export interface ButtonProps {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Additive — defaults to `"default"` (`radius.md`). */
  shape?: ButtonShape;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  /**
   * Native HTML button type. Defaults to `"button"`.
   * Ignored on React Native (not forwarded to native views).
   */
  type?: ButtonType;
  onPress?: PressHandler;
  /** Generic leading slot — not an icon system. */
  leftIcon?: ReactNode;
  /** Generic trailing slot — not an icon system. */
  rightIcon?: ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}
