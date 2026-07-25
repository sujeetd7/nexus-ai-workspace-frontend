import type { FC, ReactNode } from "react";

import { useTheme } from "../../hooks/useTheme";
import { Stack } from "../Stack";
import { Text } from "../Text";
import { View } from "../View";
import type { NexusTestProps, SemanticTextColor } from "../shared/types";

export type InlineAlertTone = "info" | "success" | "warning" | "error";

export interface InlineAlertProps extends NexusTestProps {
  /** Visual / semantic tone. */
  tone?: InlineAlertTone;
  /** Optional short title above the body. */
  title?: ReactNode;
  /** Primary message body. */
  children: ReactNode;
  /** Optional trailing / below-body action slot (e.g. Link). */
  action?: ReactNode;
  accessibilityLabel?: string;
}

function resolveToneColor(tone: InlineAlertTone): SemanticTextColor {
  switch (tone) {
    case "success":
      return "success";
    case "warning":
      return "warning";
    case "error":
      return "danger";
    case "info":
    default:
      return "info";
  }
}

function resolveBorderColor(
  tone: InlineAlertTone,
  semantic: {
    info: string;
    success: string;
    warning: string;
    danger: string;
  },
): string {
  switch (tone) {
    case "success":
      return semantic.success;
    case "warning":
      return semantic.warning;
    case "error":
      return semantic.danger;
    case "info":
    default:
      return semantic.info;
  }
}

/**
 * Level 2 inline status message — not a Toast, Modal, or queue.
 * Uses alert semantics for error/warning/success; info uses text role.
 */
export const InlineAlert: FC<InlineAlertProps> = ({
  tone = "info",
  title,
  children,
  action,
  accessibilityLabel,
  testID,
}) => {
  const { theme } = useTheme();
  const color = resolveToneColor(tone);
  const borderColor = resolveBorderColor(tone, theme.semantic);
  const hasTitle = title != null && title !== false;
  const hasAction = action != null && action !== false;
  const announceAsAlert = tone === "error" || tone === "warning" || tone === "success";
  const label =
    accessibilityLabel ??
    (typeof title === "string"
      ? title
      : typeof children === "string"
        ? children
        : undefined);

  return (
    <View
      testID={testID}
      background="surface"
      borderRadius="md"
      padding="md"
      accessibilityRole={announceAsAlert ? "alert" : "text"}
      accessibilityLabel={label}
      style={{
        borderWidth: 1,
        borderColor,
        borderLeftWidth: 4,
        borderLeftColor: borderColor,
      }}
    >
      <Stack direction="vertical" gap="sm">
        {hasTitle ? (
          <Text
            variant="label"
            color={color}
            weight="semibold"
            testID={testID ? `${testID}-title` : undefined}
          >
            {title}
          </Text>
        ) : null}
        <Text
          variant="body"
          color="text"
          testID={testID ? `${testID}-body` : undefined}
        >
          {children}
        </Text>
        {hasAction ? (
          <View testID={testID ? `${testID}-action` : undefined}>{action}</View>
        ) : null}
      </Stack>
    </View>
  );
};
