import type { FC, ReactNode } from "react";

import { Text } from "../Text";
import type { NexusTestProps } from "../shared/types";

export interface ErrorTextProps extends NexusTestProps {
  children: ReactNode;
  /** Web: target id for Input `describedBy` / `aria-describedby`. */
  id?: string;
}

/**
 * Level 2 form error message. Uses alert semantics for assistive tech.
 */
export const ErrorText: FC<ErrorTextProps> = ({ children, id, testID }) => {
  return (
    <Text
      id={id}
      testID={testID}
      variant="caption"
      color="danger"
      accessibilityRole="alert"
    >
      {children}
    </Text>
  );
};
