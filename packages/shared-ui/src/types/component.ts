import type { ReactNode } from "react";

export interface BaseComponentProps {
  children?: ReactNode;

  className?: string;

  testID?: string;

  accessibilityLabel?: string;

  style?: unknown;
}
