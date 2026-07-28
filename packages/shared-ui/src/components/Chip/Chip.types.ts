import type { ReactNode } from "react";

import type { PressHandler } from "../../types/events";

/**
 * Additive fill grammar (Batch 5.DS.2).
 * `muted` uses `surfaceMuted` + `borderSubtle` when unselected; selected stays primary.
 */
export type ChipTone = "default" | "muted";

export interface ChipProps {
  children: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  /** Additive — defaults to `"default"`. */
  tone?: ChipTone;
  onPress?: PressHandler;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}
