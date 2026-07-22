import type { FC, ReactNode } from "react";

import { Stack } from "../Stack";
import { Text } from "../Text";
import type {
  NexusA11yProps,
  NexusTestProps,
  SpacingToken,
} from "../shared/types";

export interface SectionProps extends NexusA11yProps, NexusTestProps {
  children?: ReactNode;
  /** Optional section title (rendered as heading text). */
  title?: ReactNode;
  /** Vertical gap between title and content / children. */
  gap?: SpacingToken;
  /** Outer padding for the section block. */
  padding?: SpacingToken;
}

/**
 * Level 2 section spacing/layout helper. Not a page layout system.
 */
export const Section: FC<SectionProps> = ({
  children,
  title,
  gap = "md",
  padding = "lg",
  testID,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
}) => {
  const hasTitle = title != null && title !== false;

  return (
    <Stack
      direction="vertical"
      gap={gap}
      padding={padding}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
    >
      {hasTitle ? (
        <Text
          variant="h3"
          accessibilityRole="heading"
          testID={testID ? `${testID}-title` : undefined}
        >
          {title}
        </Text>
      ) : null}
      {children}
    </Stack>
  );
};
