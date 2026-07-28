import type { NexusTestProps } from "../shared/types";

export interface SwitchProps extends NexusTestProps {
  /** Controlled checked state — required (no uncontrolled mode). */
  checked: boolean;
  /** Called with the next checked value. */
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  /** Accessible name — required for unlabeled switches. */
  accessibilityLabel: string;
  accessibilityHint?: string;
}
