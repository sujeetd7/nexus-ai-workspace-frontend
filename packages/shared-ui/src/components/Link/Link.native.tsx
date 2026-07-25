import type { FC } from "react";
import { Pressable, Text as RNText } from "react-native";

import { useTheme } from "../../hooks/useTheme";
import { mapNativeA11yProps } from "../shared/a11y";
import {
  resolveLinkAccessibleName,
  resolveLinkColor,
  resolveLinkTypography,
} from "./linkTokens";
import type { LinkProps } from "./Link.types";

/**
 * React Native Link — accessible Pressable with link role.
 * `href` is exposed for consumers; navigation is app-owned via `onPress`.
 * `external` is accepted for API parity and ignored on native.
 */
export const Link: FC<LinkProps> = ({
  children,
  href: _href,
  onPress,
  disabled = false,
  external: _external,
  variant = "default",
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme } = useTheme();
  const color = resolveLinkColor(theme, variant);
  const type = resolveLinkTypography();
  const name = resolveLinkAccessibleName(accessibilityLabel, children);

  return (
    <Pressable
      {...mapNativeA11yProps({
        testID,
        accessibilityLabel: name,
        accessibilityHint,
        accessibilityRole: "link",
        accessibilityState: { disabled },
      })}
      disabled={disabled}
      onPress={() => {
        if (disabled) {
          return;
        }
        onPress?.();
      }}
      style={({ pressed }) => ({
        opacity: disabled
          ? type.opacityDisabled
          : pressed
            ? type.opacityPressed
            : 1,
      })}
    >
      <RNText
        style={{
          color,
          fontFamily: type.fontFamily,
          fontSize: type.fontSize,
          lineHeight: type.lineHeight,
          fontWeight: type.fontWeight,
          textDecorationLine: "underline",
        }}
      >
        {children}
      </RNText>
    </Pressable>
  );
};
