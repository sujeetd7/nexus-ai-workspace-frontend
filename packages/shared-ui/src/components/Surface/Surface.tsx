import { isWeb } from "@tamagui/core";
import type { FC, ReactNode } from "react";

import { useTheme } from "../../hooks/useTheme";
import { View } from "../View";
import { resolveElevationStyle } from "../shared/elevationStyle";
import type {
  ElevationToken,
  NexusA11yProps,
  NexusTestProps,
  RadiusToken,
  SemanticBackground,
  SpacingToken,
} from "../shared/types";

/** Additive border grammar (Batch 5.DS.2). Default `none` preserves pre-batch Surface. */
export type SurfaceBorderTone = "none" | "default" | "subtle";

export interface SurfaceProps extends NexusA11yProps, NexusTestProps {
  children?: ReactNode;
  /** Semantic elevation level — maps to shadow (web) / elevation (RN). */
  elevation?: ElevationToken;
  /** Additive — defaults to `"surface"`. Supports `surfaceMuted` from 5.DS.1. */
  background?: SemanticBackground;
  /** Additive — defaults to `"none"` (no border). */
  borderTone?: SurfaceBorderTone;
  padding?: SpacingToken;
  paddingHorizontal?: SpacingToken;
  paddingVertical?: SpacingToken;
  borderRadius?: RadiusToken;
}

/**
 * Level 2 elevated surface. Provides semantic elevation only — not a card layout.
 */
export const Surface: FC<SurfaceProps> = ({
  children,
  elevation = "none",
  background = "surface",
  borderTone = "none",
  padding,
  paddingHorizontal,
  paddingVertical,
  borderRadius = "md",
  testID,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
}) => {
  const { theme } = useTheme();
  const elevationStyle = resolveElevationStyle(
    elevation,
    theme,
    isWeb ? "web" : "native",
  );

  const borderStyle =
    borderTone === "none"
      ? undefined
      : {
          borderWidth: 1,
          borderStyle: "solid" as const,
          borderColor:
            borderTone === "subtle"
              ? theme.semantic.borderSubtle
              : theme.semantic.border,
        };

  const style =
    elevationStyle || borderStyle
      ? { ...elevationStyle, ...borderStyle }
      : undefined;

  return (
    <View
      background={background}
      padding={padding}
      paddingHorizontal={paddingHorizontal}
      paddingVertical={paddingVertical}
      borderRadius={borderRadius}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      style={style}
    >
      {children}
    </View>
  );
};
