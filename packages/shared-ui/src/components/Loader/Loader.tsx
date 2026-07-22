import { View as TamaguiView } from "@tamagui/core";
import type { FC } from "react";
import { ActivityIndicator } from "react-native";

import { prefersReducedMotion } from "../../accessibility/reducedMotion";
import { useTheme } from "../../hooks/useTheme";
import { spacing } from "../../theme/spacing";
import { Text } from "../Text";
import { testProps } from "../shared/a11y";
import type { SemanticTextColor } from "../shared/types";

export type LoaderSize = "sm" | "md" | "lg";
export type LoaderColor = "primary" | "secondary" | "text" | "onPrimary";

export interface LoaderProps {
  size?: LoaderSize;
  color?: LoaderColor;
  /** Accessible status label — loading must not be motion-only. */
  accessibilityLabel?: string;
  testID?: string;
}

const sizeMap: Record<LoaderSize, number> = {
  sm: spacing.lg,
  md: spacing.xl,
  lg: spacing.xxl,
};

const textColorMap: Record<LoaderColor, SemanticTextColor> = {
  primary: "primary",
  secondary: "secondary",
  text: "text",
  onPrimary: "onPrimary",
};

/**
 * Level 1 indeterminate loading indicator.
 * Uses platform ActivityIndicator; falls back to static labeled text when
 * reduced motion is preferred (no custom animation driver).
 */
export const Loader: FC<LoaderProps> = ({
  size = "md",
  color = "primary",
  accessibilityLabel = "Loading",
  testID,
}) => {
  const { theme } = useTheme();
  const dimension = sizeMap[size];
  const reduceMotion = prefersReducedMotion();
  const indicatorColor =
    color === "text"
      ? theme.semantic.text
      : color === "onPrimary"
        ? theme.semantic.onPrimary
        : theme.semantic[color];

  return (
    <TamaguiView
      {...testProps(testID)}
      alignItems="center"
      justifyContent="center"
      role="progressbar"
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      aria-label={accessibilityLabel}
      aria-busy
      minWidth={dimension}
      minHeight={dimension}
    >
      {reduceMotion ? (
        <Text variant="caption" color={textColorMap[color]}>
          {accessibilityLabel}
        </Text>
      ) : (
        <ActivityIndicator
          size={size === "lg" ? "large" : "small"}
          color={indicatorColor}
        />
      )}
    </TamaguiView>
  );
};
