import { View as TamaguiView } from "@tamagui/core";
import type { FC } from "react";

import {
  resolveNativeAccessibilityRole,
  resolveWebRole,
  testProps,
} from "../shared/a11y";
import type {
  NexusA11yProps,
  NexusChildrenProps,
  NexusTestProps,
  RadiusToken,
  SemanticBackground,
  SpacingToken,
} from "../shared/types";

const backgroundMap = {
  background: "$background",
  surface: "$surface",
  transparent: "transparent",
} as const;

export interface ViewProps
  extends NexusChildrenProps, NexusA11yProps, NexusTestProps {
  background?: SemanticBackground;
  padding?: SpacingToken;
  paddingHorizontal?: SpacingToken;
  paddingVertical?: SpacingToken;
  margin?: SpacingToken;
  marginHorizontal?: SpacingToken;
  marginVertical?: SpacingToken;
  borderRadius?: RadiusToken;
  flex?: number;
  flexGrow?: number;
  flexShrink?: number;
  width?: number | `${number}%` | "100%";
  height?: number | `${number}%` | "100%";
  minWidth?: number;
  minHeight?: number;
  /**
   * Escape hatch for rare layout cases. Prefer token props above.
   * Typed as unknown to avoid CSS-only / RN-only coupling in the public API.
   */
  style?: unknown;
}

/**
 * Level 1 container primitive. Prefer `Stack` for directional child layout.
 */
export const View: FC<ViewProps> = ({
  children,
  background = "transparent",
  padding,
  paddingHorizontal,
  paddingVertical,
  margin,
  marginHorizontal,
  marginVertical,
  borderRadius,
  flex,
  flexGrow,
  flexShrink,
  width,
  height,
  minWidth,
  minHeight,
  testID,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  style,
}) => {
  const role = resolveWebRole(accessibilityRole);

  return (
    <TamaguiView
      {...testProps(testID)}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={
        resolveNativeAccessibilityRole(accessibilityRole) as never
      }
      role={role as never}
      backgroundColor={backgroundMap[background]}
      padding={padding ? `$${padding}` : undefined}
      paddingHorizontal={paddingHorizontal ? `$${paddingHorizontal}` : undefined}
      paddingVertical={paddingVertical ? `$${paddingVertical}` : undefined}
      margin={margin ? `$${margin}` : undefined}
      marginHorizontal={marginHorizontal ? `$${marginHorizontal}` : undefined}
      marginVertical={marginVertical ? `$${marginVertical}` : undefined}
      borderRadius={borderRadius ? `$${borderRadius}` : undefined}
      flex={flex}
      flexGrow={flexGrow}
      flexShrink={flexShrink}
      width={width}
      height={height}
      minWidth={minWidth}
      minHeight={minHeight}
      style={style as never}
    >
      {children}
    </TamaguiView>
  );
};
