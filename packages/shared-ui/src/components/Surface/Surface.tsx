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
  SpacingToken,
} from "../shared/types";

export interface SurfaceProps extends NexusA11yProps, NexusTestProps {
  children?: ReactNode;
  /** Semantic elevation level — maps to shadow (web) / elevation (RN). */
  elevation?: ElevationToken;
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

  return (
    <View
      background="surface"
      padding={padding}
      paddingHorizontal={paddingHorizontal}
      paddingVertical={paddingVertical}
      borderRadius={borderRadius}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      style={elevationStyle}
    >
      {children}
    </View>
  );
};
