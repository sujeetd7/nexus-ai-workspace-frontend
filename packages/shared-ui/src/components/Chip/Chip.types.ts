import type { ReactNode } from "react";

import type { PressHandler } from "../../types/events";

export interface ChipProps {
  children: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onPress?: PressHandler;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}
