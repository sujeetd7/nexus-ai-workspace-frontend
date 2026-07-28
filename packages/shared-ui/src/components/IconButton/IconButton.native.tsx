import type { FC } from "react";
import { Pressable } from "react-native";

import { useTheme } from "../../hooks/useTheme";
import { Loader } from "../Loader";
import { getNativeAccessibilityProps } from "../shared/a11y";
import {
  resolveIconButtonAccessibleName,
  resolveIconButtonLayout,
  resolveIconButtonSurface,
} from "./iconButtonTokens";
import type { IconButtonProps } from "./IconButton.types";

/**
 * React Native IconButton — icon-only Pressable with required accessibility label.
 */
export const IconButton: FC<IconButtonProps> = ({
  children,
  accessibilityLabel,
  accessibilityHint,
  variant = "ghost",
  size = "md",
  shape = "default",
  loading = false,
  disabled = false,
  onPress,
  testID,
}) => {
  const { theme } = useTheme();
  const surface = resolveIconButtonSurface(theme, variant);
  const layout = resolveIconButtonLayout(size, shape);
  const name = resolveIconButtonAccessibleName(loading, accessibilityLabel);
  const blocksActivation = disabled || loading;

  return (
    <Pressable
      {...getNativeAccessibilityProps({
        testID,
        accessibilityLabel: name,
        accessibilityHint,
        accessibilityRole: "button",
        accessibilityState: { disabled, busy: loading },
      })}
      disabled={disabled}
      onPress={() => {
        if (blocksActivation) {
          return;
        }
        onPress?.();
      }}
      style={({ pressed }) => ({
        alignItems: "center",
        justifyContent: "center",
        borderWidth: layout.borderWidth,
        borderRadius: layout.borderRadius,
        borderColor: surface.borderColor,
        backgroundColor: surface.backgroundColor,
        width: layout.width,
        height: layout.height,
        minHeight: layout.minHeight,
        minWidth: layout.minWidth,
        opacity: disabled
          ? layout.opacityDisabled
          : pressed && !blocksActivation
            ? layout.opacityPressed
            : 1,
      })}
    >
      {loading ? (
        <Loader
          size="sm"
          color={
            variant === "primary" || variant === "destructive"
              ? "onPrimary"
              : "primary"
          }
          accessibilityLabel={name}
        />
      ) : (
        children
      )}
    </Pressable>
  );
};
