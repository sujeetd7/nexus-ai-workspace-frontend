export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  label: string;

  variant?: ButtonVariant;

  size?: ButtonSize;

  disabled?: boolean;

  loading?: boolean;

  fullWidth?: boolean;

  onPress?: () => void;
}
