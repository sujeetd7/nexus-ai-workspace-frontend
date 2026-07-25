import type { ReactNode } from "react";

import type { SemanticTextColor } from "../shared/types";

export type IconSize = "sm" | "md" | "lg";

export type IconColor = SemanticTextColor;

export interface IconProps {
  /**
   * Graphic node (SVG, Text glyph, or other ReactNode).
   * Not an icon pack — callers supply the visual.
   */
  children: ReactNode;
  size?: IconSize;
  color?: IconColor;
  /**
   * When `true` (default), the icon is hidden from assistive technology.
   * When `false`, `accessibilityLabel` is required.
   */
  decorative?: boolean;
  /** Required when `decorative={false}`. */
  accessibilityLabel?: string;
  testID?: string;
}
