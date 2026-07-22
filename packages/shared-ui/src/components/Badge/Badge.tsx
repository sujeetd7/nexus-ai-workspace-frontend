import type { FC, ReactNode } from "react";

import { useTheme } from "../../hooks/useTheme";
import { Text } from "../Text";
import { View } from "../View";
import type { NexusTestProps } from "../shared/types";

export type BadgeVariant =
  | "neutral"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type BadgeSize = "sm" | "md";

export interface BadgeProps extends NexusTestProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  accessibilityLabel?: string;
}

function resolveBadgeBorderColor(
  variant: BadgeVariant,
  semantic: {
    border: string;
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
  },
): string {
  switch (variant) {
    case "primary":
      return semantic.primary;
    case "secondary":
      return semantic.secondary;
    case "success":
      return semantic.success;
    case "warning":
      return semantic.warning;
    case "danger":
      return semantic.danger;
    case "info":
      return semantic.info;
    case "neutral":
    default:
      return semantic.border;
  }
}

/**
 * Level 2 status/meta badge. No icons in Batch 2.5.
 *
 * Soft/outline on `surface` with semantic border accent; label uses `text` for AA.
 */
export const Badge: FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  accessibilityLabel,
  testID,
}) => {
  const { theme } = useTheme();
  const label =
    accessibilityLabel ??
    (typeof children === "string" ? children : undefined);
  const paddingHorizontal = size === "sm" ? "sm" : "md";
  const paddingVertical = size === "sm" ? "xs" : "sm";

  return (
    <View
      testID={testID}
      background="surface"
      borderRadius="pill"
      paddingHorizontal={paddingHorizontal}
      paddingVertical={paddingVertical}
      accessibilityLabel={label}
      accessibilityRole="text"
      style={{
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: resolveBadgeBorderColor(variant, theme.semantic),
      }}
    >
      <Text variant="label" color="text" weight="medium">
        {children}
      </Text>
    </View>
  );
};
