import type { FC } from "react";
import { Pressable, Text as RNText, View } from "react-native";

import { useTheme } from "../../hooks/useTheme";
import { testProps } from "../shared/a11y";
import {
  labelColor,
  resolveAccessibleName,
  resolveButtonLayout,
  resolveButtonSurface,
} from "./buttonTokens";
import type { ButtonProps } from "./Button.types";

/**
 * React Native Button — `Pressable` with Nexus token styling.
 * The HTML-only `type` prop is accepted and ignored.
 */
export const Button: FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  type: _type,
  onPress,
  leftIcon,
  rightIcon,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme } = useTheme();
  const surface = resolveButtonSurface(theme, variant);
  const layout = resolveButtonLayout(size, fullWidth);
  const name = resolveAccessibleName(loading, accessibilityLabel, children);
  const blocksActivation = disabled || loading;
  const textColor = theme.semantic[labelColor[variant]];

  return (
    <Pressable
      {...testProps(testID)}
      accessibilityRole="button"
      accessibilityLabel={name}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled, busy: loading }}
      // Only the `disabled` prop uses Pressable's disabled flag.
      // Loading blocks activation in onPress while keeping busy state distinct.
      disabled={disabled}
      onPress={() => {
        if (blocksActivation) {
          return;
        }
        onPress?.();
      }}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: layout.borderWidth,
        borderRadius: layout.borderRadius,
        borderColor: surface.borderColor,
        backgroundColor: surface.backgroundColor,
        minHeight: layout.minHeight,
        minWidth: layout.minWidth,
        paddingHorizontal: layout.paddingHorizontal,
        paddingVertical: layout.paddingVertical,
        gap: layout.gap,
        width: layout.width,
        alignSelf: layout.alignSelf,
        opacity: disabled
          ? layout.opacityDisabled
          : pressed && !blocksActivation
            ? layout.opacityPressed
            : 1,
      })}
    >
      {loading ? null : leftIcon}
      <View style={{ flexShrink: 1 }}>
        <RNText
          numberOfLines={1}
          style={{
            color: textColor,
            fontFamily: layout.fontFamily,
            fontSize: layout.fontSize,
            lineHeight: layout.lineHeight,
            fontWeight: layout.fontWeight,
          }}
        >
          {loading ? "Loading…" : children}
        </RNText>
      </View>
      {loading ? null : rightIcon}
    </Pressable>
  );
};
