import type { ButtonSize, ButtonVariant } from "./Button.types";

export const buttonHeights: Record<ButtonSize, number> = {
  sm: 32,
  md: 40,
  lg: 48,
};

export const buttonVariantClass: Record<ButtonVariant, string> = {
  primary: "primary",
  secondary: "secondary",
  outline: "outline",
  ghost: "ghost",
  danger: "danger",
};
