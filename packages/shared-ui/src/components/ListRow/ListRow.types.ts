import type { ReactNode } from "react";

import type { PressHandler } from "../../types/events";
import type { NexusTestProps } from "../shared/types";

export interface ListRowProps extends NexusTestProps {
  /** Leading slot — Avatar, Icon, or custom node. */
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  /** Trailing slot — Badge, Chevron, Switch, or custom node. */
  trailing?: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  /** When set, the row is pressable. No routing or navigation logic. */
  onPress?: PressHandler;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function resolveListRowAccessibleName(
  accessibilityLabel: string | undefined,
  title: ReactNode,
): string | undefined {
  if (accessibilityLabel) {
    return accessibilityLabel;
  }
  if (typeof title === "string") {
    return title;
  }
  return undefined;
}
