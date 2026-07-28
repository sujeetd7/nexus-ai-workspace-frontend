import type { FC } from "react";
import { Pressable, View } from "react-native";

import { useTheme } from "../../hooks/useTheme";
import { getNativeAccessibilityProps } from "../shared/a11y";
import { resolveSwitchLayout, resolveSwitchSurface } from "./switchTokens";
import type { SwitchProps } from "./Switch.types";

/**
 * React Native Switch — controlled Pressable toggle (not RN Switch primitive,
 * so styling stays token-driven and cross-platform consistent).
 */
export const Switch: FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme } = useTheme();
  const surface = resolveSwitchSurface(theme, checked);
  const layout = resolveSwitchLayout();
  const thumbOffset = checked
    ? layout.trackWidth - layout.trackPadding * 2 - layout.thumbSize
    : 0;

  return (
    <Pressable
      {...getNativeAccessibilityProps({
        testID,
        accessibilityLabel,
        accessibilityHint,
        accessibilityRole: "switch",
        accessibilityState: { disabled, checked },
      })}
      disabled={disabled}
      onPress={() => {
        if (disabled) {
          return;
        }
        onCheckedChange(!checked);
      }}
      style={({ pressed }) => ({
        justifyContent: "center",
        minHeight: layout.minHeight,
        minWidth: layout.minWidth,
        opacity: disabled
          ? layout.opacityDisabled
          : pressed
            ? layout.opacityPressed
            : 1,
      })}
    >
      <View
        style={{
          width: layout.trackWidth,
          height: layout.trackHeight,
          borderRadius: layout.borderRadius,
          backgroundColor: surface.trackColor,
          padding: layout.trackPadding,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: layout.thumbSize,
            height: layout.thumbSize,
            borderRadius: layout.borderRadius,
            backgroundColor: surface.thumbColor,
            transform: [{ translateX: thumbOffset }],
          }}
        />
      </View>
    </Pressable>
  );
};
