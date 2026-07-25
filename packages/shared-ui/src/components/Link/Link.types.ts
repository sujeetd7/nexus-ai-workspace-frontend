import type { ReactNode } from "react";

import type { PressHandler } from "../../types/events";

export type LinkVariant = "default" | "subtle" | "destructive";

export interface LinkProps {
  children: ReactNode;
  /** Destination URL. Not coupled to a router — apps handle navigation via `onPress` when needed. */
  href: string;
  onPress?: PressHandler;
  disabled?: boolean;
  /**
   * When true on web, opens in a new browsing context with
   * `rel="noopener noreferrer"` and `target="_blank"`.
   */
  external?: boolean;
  variant?: LinkVariant;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}
