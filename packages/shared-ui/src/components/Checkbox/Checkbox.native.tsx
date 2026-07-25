import type { FC } from "react";
import { useState } from "react";
import { Pressable, Text as RNText, View } from "react-native";

import { useTheme } from "../../hooks/useTheme";
import { getNativeAccessibilityProps } from "../shared/a11y";
import {
  resolveCheckboxLayout,
  resolveCheckboxSurface,
} from "./checkboxTokens";
import type { CheckboxProps } from "./Checkbox.types";

/**
 * React Native Checkbox — Pressable with checkbox role and mixed state support.
 */
export const Checkbox: FC<CheckboxProps> = ({
  checked: checkedProp,
  defaultChecked = false,
  indeterminate = false,
  disabled = false,
  onCheckedChange,
  label,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme } = useTheme();
  const layout = resolveCheckboxLayout();
  const isControlled = checkedProp !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const checked = isControlled ? Boolean(checkedProp) : uncontrolled;
  const surface = resolveCheckboxSurface(theme, checked, indeterminate);
  const name =
    accessibilityLabel ??
    (typeof label === "string" ? label : undefined);

  const toggle = () => {
    if (disabled) {
      return;
    }
    const next = indeterminate ? true : !checked;
    if (!isControlled) {
      setUncontrolled(next);
    }
    onCheckedChange?.(next);
  };

  return (
    <Pressable
      {...getNativeAccessibilityProps({
        testID,
        accessibilityLabel: name,
        accessibilityHint,
        accessibilityRole: "checkbox",
        accessibilityState: {
          disabled,
          checked: indeterminate ? "mixed" : checked,
        },
      })}
      disabled={disabled}
      onPress={toggle}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: layout.gap,
        minHeight: layout.minTarget,
        minWidth: layout.minTarget,
        opacity: disabled
          ? layout.opacityDisabled
          : pressed
            ? layout.opacityPressed
            : 1,
      })}
    >
      <View
        style={{
          width: layout.boxSize,
          height: layout.boxSize,
          borderRadius: layout.borderRadius,
          borderWidth: layout.borderWidth,
          borderColor: surface.borderColor,
          backgroundColor: surface.backgroundColor,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {indeterminate || checked ? (
          <RNText
            style={{
              color: surface.markColor,
              fontSize: layout.boxSize * 0.75,
              lineHeight: layout.boxSize,
              fontWeight: layout.fontWeight,
            }}
          >
            {indeterminate ? "−" : "✓"}
          </RNText>
        ) : null}
      </View>
      {label != null && label !== false ? (
        <RNText
          style={{
            color: theme.semantic.text,
            fontFamily: layout.fontFamily,
            fontSize: layout.fontSize,
            lineHeight: layout.lineHeight,
            fontWeight: layout.fontWeight,
          }}
        >
          {label}
        </RNText>
      ) : null}
    </Pressable>
  );
};
