import type { ReactNode } from "react";

import type { ACCESSIBILITY_ROLES } from "../../accessibility/roles";

export type SpacingToken =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "xxl"
  | "xxxl";

export type RadiusToken = "none" | "sm" | "md" | "lg" | "xl" | "pill";

export type ElevationToken = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export type SemanticBackground = "background" | "surface" | "transparent";


export type SemanticTextColor =
  | "text"
  | "textSecondary"
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning"
  | "info"
  | "onPrimary"
  | "onDanger";

export type NexusAccessibilityRole = keyof typeof ACCESSIBILITY_ROLES;

export interface NexusA11yProps {
  accessibilityLabel?: string;
  accessibilityHint?: string;
  /**
   * Cross-platform accessibility role key from the Batch 2.3 approved set.
   * Mapped to ARIA/`role` on web and `accessibilityRole` on React Native.
   */
  accessibilityRole?: NexusAccessibilityRole;
}

export interface NexusTestProps {
  /** Cross-platform test id (`testID` on RN, `data-testid` on web). */
  testID?: string;
}

export interface NexusChildrenProps {
  children?: ReactNode;
}
