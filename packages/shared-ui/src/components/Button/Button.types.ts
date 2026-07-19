import type { ReactNode } from "react";

import type { Size } from "../../types/common";
import type { BaseComponentProps } from "../../types/component";
import type { PressHandler } from "../../types/events";
import type { ColorScheme, Variant } from "../../types/variants";

export interface ButtonProps extends BaseComponentProps {
  children?: ReactNode;

  variant?: Variant;

  colorScheme?: ColorScheme;

  size?: Size;

  loading?: boolean;

  disabled?: boolean;

  fullWidth?: boolean;

  onPress?: PressHandler;

  leftIcon?: ReactNode;

  rightIcon?: ReactNode;
}
