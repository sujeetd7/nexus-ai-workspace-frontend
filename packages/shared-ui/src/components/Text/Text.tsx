import { Text as TamaguiText } from "@tamagui/core";
import type { FC, ReactNode } from "react";

import {
  resolveNativeAccessibilityRole,
  resolveWebRole,
  testProps,
} from "../shared/a11y";
import type {
  NexusA11yProps,
  NexusTestProps,
  SemanticTextColor,
} from "../shared/types";

export type TextVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "body"
  | "caption"
  | "label";

/** @deprecated Stub aliases — prefer `h2` / `h3`. Kept for unused stub compatibility. */
export type LegacyTextVariant = "title" | "heading";

export type TextAlign = "left" | "center" | "right";

export type FontWeightToken = "regular" | "medium" | "semibold" | "bold";

const weightMap = {
  regular: "$4",
  medium: "$5",
  semibold: "$6",
  bold: "$7",
} as const;

const colorMap = {
  text: "$color",
  textSecondary: "$colorSecondary",
  primary: "$primary",
  secondary: "$secondary",
  danger: "$danger",
  success: "$success",
  warning: "$warning",
  info: "$info",
  onPrimary: "$onPrimary",
  onDanger: "$onDanger",
} as const;

const variantStyles = {
  display: {
    fontSize: "$display",
    lineHeight: "$display",
    letterSpacing: "$display",
    fontWeight: "$7",
  },
  h1: {
    fontSize: "$h1",
    lineHeight: "$h1",
    letterSpacing: "$h1",
    fontWeight: "$7",
  },
  h2: {
    fontSize: "$h2",
    lineHeight: "$h2",
    letterSpacing: "$h2",
    fontWeight: "$6",
  },
  h3: {
    fontSize: "$h3",
    lineHeight: "$h3",
    letterSpacing: "$h3",
    fontWeight: "$6",
  },
  body: {
    fontSize: "$body",
    lineHeight: "$body",
    letterSpacing: "$body",
    fontWeight: "$4",
  },
  caption: {
    fontSize: "$caption",
    lineHeight: "$caption",
    letterSpacing: "$caption",
    fontWeight: "$4",
  },
  label: {
    fontSize: "$label",
    lineHeight: "$label",
    letterSpacing: "$label",
    fontWeight: "$5",
  },
} as const;

function normalizeVariant(
  variant: TextVariant | LegacyTextVariant | undefined,
): TextVariant {
  if (variant === "title") {
    return "h2";
  }
  if (variant === "heading") {
    return "h3";
  }
  return variant ?? "body";
}

export interface TextProps extends NexusA11yProps, NexusTestProps {
  children: ReactNode;
  variant?: TextVariant | LegacyTextVariant;
  color?: SemanticTextColor;
  align?: TextAlign;
  weight?: FontWeightToken;
  /** Truncate to a single line when supported. */
  truncate?: boolean;
  /** Limit visible lines when supported (RN / web line-clamp). */
  numberOfLines?: number;
  /**
   * DOM / native id for associations (e.g. Input `aria-describedby`).
   * Mapped to `id` on web and `nativeID` on React Native.
   */
  id?: string;
  /**
   * Escape hatch — prefer token props. Typed unknown to avoid platform CSS coupling.
   */
  style?: unknown;
}

/**
 * Level 1 text primitive — typography and semantic colors from Nexus tokens.
 */
export const Text: FC<TextProps> = ({
  children,
  variant,
  color = "text",
  align,
  weight,
  truncate = false,
  numberOfLines,
  id,
  testID,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  style,
}) => {
  const resolvedVariant = normalizeVariant(variant);
  const role = resolveWebRole(accessibilityRole);
  const lines = truncate ? 1 : numberOfLines;

  return (
    <TamaguiText
      {...testProps(testID)}
      id={id}
      nativeID={id}
      fontFamily="$body"
      color={colorMap[color]}
      {...variantStyles[resolvedVariant]}
      textAlign={align}
      {...(weight ? { fontWeight: weightMap[weight] } : {})}
      numberOfLines={lines}
      ellipsizeMode={lines ? "tail" : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={
        resolveNativeAccessibilityRole(accessibilityRole) as never
      }
      role={role as never}
      style={style as never}
    >
      {children}
    </TamaguiText>
  );
};
