import type { FC, ReactNode } from "react";

import { Text } from "../Text";
import type { NexusTestProps } from "../shared/types";

export interface HelperTextProps extends NexusTestProps {
  children: ReactNode;
  /** Web: target id for Input `describedBy` / `aria-describedby`. */
  id?: string;
}

/**
 * Level 2 form helper copy. Non-error guidance associated with a field.
 */
export const HelperText: FC<HelperTextProps> = ({
  children,
  id,
  testID,
}) => {
  return (
    <Text
      id={id}
      testID={testID}
      variant="caption"
      color="textSecondary"
      accessibilityRole="text"
    >
      {children}
    </Text>
  );
};
