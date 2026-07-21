import type { FC } from "react";

import type { ButtonProps } from "./Button.types";

export const Button: FC<ButtonProps> = ({
  children,
  onPress,
  disabled,
  loading = false,
}) => (
  <button
    type="button"
    disabled={disabled || loading}
    onClick={() => onPress?.()}
  >
    {loading ? "Loading..." : children}
  </button>
);
