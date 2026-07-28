import type { ReactNode } from "react";

import type { PressHandler } from "../../types/events";
import type { ButtonShape, ButtonSize, ButtonVariant } from "../Button/Button.types";

export type IconButtonVariant = ButtonVariant;
export type IconButtonSize = ButtonSize;
/** Extends Button shapes with equal-sided `circle` for icon-only chrome. */
export type IconButtonShape = ButtonShape | "circle";

export interface IconButtonProps {
  /** Required icon / glyph node (not an icon pack). */
  children: ReactNode;
  /** Required accessible name — icon-only control. */
  accessibilityLabel: string;
  accessibilityHint?: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  shape?: IconButtonShape;
  loading?: boolean;
  disabled?: boolean;
  onPress?: PressHandler;
  testID?: string;
}
