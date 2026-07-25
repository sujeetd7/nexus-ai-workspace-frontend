import type { FC, ReactNode } from "react";

import { Stack } from "../../components/Stack";
import { Text } from "../../components/Text";
import type { NexusTestProps } from "../../components/shared/types";

export interface AuthHeaderProps extends NexusTestProps {
  /** Page / card title — rendered as a semantic heading. */
  title: ReactNode;
  /** Supporting description under the title. */
  description?: ReactNode;
  /**
   * Heading level for assistive tech hierarchy.
   * Prefer `1` for page titles inside AuthShell; `2` when nested under a page heading.
   */
  headingLevel?: 1 | 2;
}

/**
 * Auth pattern — title + description block.
 * No routing or product copy ownership.
 */
export const AuthHeader: FC<AuthHeaderProps> = ({
  title,
  description,
  headingLevel = 1,
  testID,
}) => {
  const hasDescription = description != null && description !== false;
  const variant = headingLevel === 1 ? "h1" : "h2";

  return (
    <Stack direction="vertical" gap="sm" testID={testID} align="stretch">
      <Text
        variant={variant}
        accessibilityRole="heading"
        testID={testID ? `${testID}-title` : undefined}
      >
        {title}
      </Text>
      {hasDescription ? (
        <Text
          variant="body"
          color="textSecondary"
          testID={testID ? `${testID}-description` : undefined}
        >
          {description}
        </Text>
      ) : null}
    </Stack>
  );
};
