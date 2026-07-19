import type { FC } from "react";
import type { ButtonProps } from "./Button.types";

export const Button: FC<ButtonProps> = ({ children, onPress, disabled }) => {
  return (
    <button type="button" disabled={disabled} onClick={() => onPress?.()}>
      {children}
    </button>
  );
};
