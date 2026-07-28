import type { FC, ReactNode } from "react";

import { Stack } from "../Stack";
import { Text } from "../Text";
import { View } from "../View";
import type { NexusTestProps } from "../shared/types";

export interface EmptyStateProps extends NexusTestProps {
  /** Optional illustration slot (consumer-provided node — no bundled SVG assets). */
  illustration?: ReactNode;
  /** Optional icon slot. */
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Primary action slot (typically a Button). */
  primaryAction?: ReactNode;
  /** Secondary action slot (typically a Button or Link). */
  secondaryAction?: ReactNode;
  accessibilityLabel?: string;
}

/**
 * Level 2 empty state — presentation only.
 * No product copy or SVG assets. Slots are rendered as provided.
 */
export const EmptyState: FC<EmptyStateProps> = ({
  illustration,
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  accessibilityLabel,
  testID,
}) => {
  const hasIllustration = illustration != null && illustration !== false;
  const hasIcon = icon != null && icon !== false;
  const hasDescription = description != null && description !== false;
  const hasPrimary = primaryAction != null && primaryAction !== false;
  const hasSecondary = secondaryAction != null && secondaryAction !== false;
  const label =
    accessibilityLabel ?? (typeof title === "string" ? title : undefined);

  return (
    <View
      testID={testID}
      accessibilityLabel={label}
      accessibilityRole="text"
      padding="xl"
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Stack direction="vertical" gap="md" align="center">
        {hasIllustration ? (
          <View testID={testID ? `${testID}-illustration` : undefined}>
            {illustration}
          </View>
        ) : null}
        {hasIcon ? (
          <View testID={testID ? `${testID}-icon` : undefined}>{icon}</View>
        ) : null}
        <Text
          variant="h3"
          color="text"
          align="center"
          testID={testID ? `${testID}-title` : undefined}
        >
          {title}
        </Text>
        {hasDescription ? (
          <Text
            variant="body"
            color="textSecondary"
            align="center"
            testID={testID ? `${testID}-description` : undefined}
          >
            {description}
          </Text>
        ) : null}
        {hasPrimary || hasSecondary ? (
          <Stack direction="horizontal" gap="sm" align="center" justify="center">
            {hasPrimary ? (
              <View testID={testID ? `${testID}-primary` : undefined}>
                {primaryAction}
              </View>
            ) : null}
            {hasSecondary ? (
              <View testID={testID ? `${testID}-secondary` : undefined}>
                {secondaryAction}
              </View>
            ) : null}
          </Stack>
        ) : null}
      </Stack>
    </View>
  );
};
