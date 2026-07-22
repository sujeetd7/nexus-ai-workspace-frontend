import type { FC, ReactNode } from "react";

import { Divider } from "../Divider";
import { Stack } from "../Stack";
import { Surface } from "../Surface";
import { View } from "../View";
import type {
  ElevationToken,
  NexusA11yProps,
  NexusTestProps,
  SpacingToken,
} from "../shared/types";

export interface CardProps extends NexusA11yProps, NexusTestProps {
  /** Optional header slot. */
  header?: ReactNode;
  /** Main body content. */
  children?: ReactNode;
  /** Optional footer slot. */
  footer?: ReactNode;
  elevation?: ElevationToken;
  padding?: SpacingToken;
}

/**
 * Level 2 card composite with header / body / footer slots.
 * No business layout — slots are rendered as provided.
 */
export const Card: FC<CardProps> = ({
  header,
  children,
  footer,
  elevation = "sm",
  padding = "lg",
  testID,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
}) => {
  const hasHeader = header != null && header !== false;
  const hasFooter = footer != null && footer !== false;
  const hasBody = children != null && children !== false;

  return (
    <Surface
      elevation={elevation}
      padding={padding}
      borderRadius="lg"
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
    >
      <Stack direction="vertical" gap="md">
        {hasHeader ? <View testID={testID ? `${testID}-header` : undefined}>{header}</View> : null}
        {hasHeader && (hasBody || hasFooter) ? <Divider /> : null}
        {hasBody ? (
          <View testID={testID ? `${testID}-body` : undefined}>{children}</View>
        ) : null}
        {hasBody && hasFooter ? <Divider /> : null}
        {hasFooter ? (
          <View testID={testID ? `${testID}-footer` : undefined}>{footer}</View>
        ) : null}
      </Stack>
    </Surface>
  );
};
