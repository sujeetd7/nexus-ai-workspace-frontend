import type { ReactNode } from "react";

export interface CheckboxProps {
  /** Controlled checked state. */
  checked?: boolean;
  /** Uncontrolled initial checked state. */
  defaultChecked?: boolean;
  /**
   * Visual / AT mixed state. Supported on web (`aria-checked="mixed"`) and
   * React Native (`accessibilityState.checked = "mixed"`).
   * Activating the control clears indeterminate and checks the box.
   */
  indeterminate?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Optional visible label rendered beside the control. */
  label?: ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}
