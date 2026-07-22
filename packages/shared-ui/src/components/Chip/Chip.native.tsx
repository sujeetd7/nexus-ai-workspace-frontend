import type { FC } from "react";
import { Pressable, Text as RNText } from "react-native";

import { useTheme } from "../../hooks/useTheme";
import { testProps } from "../shared/a11y";
import {
  resolveChipAccessibleName,
  resolveChipLayout,
  resolveChipSurface,
} from "./chipTokens";
import type { ChipProps } from "./Chip.types";

/**
 * React Native Chip — `Pressable` selection control (not removable).
 */
export const Chip: FC<ChipProps> = ({
  children,
  selected = false,
  disabled = false,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme } = useTheme();
  const surface = resolveChipSurface(theme, selected);
  const layout = resolveChipLayout();
  const name = resolveChipAccessibleName(
    accessibilityLabel,
    children,
    selected,
  );

  return (
    <Pressable
      {...testProps(testID)}
      accessibilityRole="button"
      accessibilityLabel={name}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={() => {
        if (disabled) {
          return;
        }
        onPress?.();
      }}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-start",
        borderWidth: layout.borderWidth,
        borderRadius: layout.borderRadius,
        borderColor: surface.borderColor,
        backgroundColor: surface.backgroundColor,
        minHeight: layout.minHeight,
        minWidth: layout.minWidth,
        paddingHorizontal: layout.paddingHorizontal,
        paddingVertical: layout.paddingVertical,
        opacity: disabled
          ? layout.opacityDisabled
          : pressed
            ? layout.opacityPressed
            : 1,
      })}
    >
      <RNText
        numberOfLines={1}
        style={{
          color: surface.color,
          fontFamily: layout.fontFamily,
          fontSize: layout.fontSize,
          lineHeight: layout.lineHeight,
          fontWeight: layout.fontWeight,
        }}
      >
        {children}
      </RNText>
    </Pressable>
  );
};
