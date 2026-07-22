import { View as TamaguiView } from "@tamagui/core";
import type { FC } from "react";
import { TextInput } from "react-native";

import { MIN_TOUCH_TARGET_SIZE } from "../../accessibility/touchTargets";
import { useTheme } from "../../hooks/useTheme";
import { opacity } from "../../theme/opacity";
import { testProps } from "../shared/a11y";

export type InputMode =
  | "text"
  | "email"
  | "numeric"
  | "tel"
  | "url"
  | "search";

export interface InputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  required?: boolean;
  secureTextEntry?: boolean;
  inputMode?: InputMode;
  /** Accessible name — do not rely on placeholder alone. */
  accessibilityLabel?: string;
  accessibilityHint?: string;
  /** Web: associates with a Label `htmlFor` / `id`. */
  id?: string;
  /**
   * Web: space-separated element ids for `aria-describedby`
   * (helper / error text). Ignored on React Native — use `accessibilityHint`.
   */
  describedBy?: string;
  testID?: string;
  onChangeText?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const keyboardTypeMap: Record<
  InputMode,
  "default" | "email-address" | "numeric" | "phone-pad" | "url"
> = {
  text: "default",
  email: "email-address",
  numeric: "numeric",
  tel: "phone-pad",
  url: "url",
  search: "default",
};

/**
 * Level 1 single-line text input. Not a form-field composite.
 * Chrome uses Tamagui tokens; field uses RN `TextInput` (RNW maps to `<input>`).
 */
export const Input: FC<InputProps> = ({
  value,
  defaultValue,
  placeholder,
  disabled = false,
  readOnly = false,
  invalid = false,
  required = false,
  secureTextEntry = false,
  inputMode = "text",
  accessibilityLabel,
  accessibilityHint,
  id,
  describedBy,
  testID,
  onChangeText,
  onFocus,
  onBlur,
}) => {
  const { theme } = useTheme();

  return (
    <TamaguiView
      backgroundColor="$background"
      borderWidth={1}
      borderColor={invalid ? "$danger" : "$borderColor"}
      borderRadius="$md"
      paddingHorizontal="$md"
      paddingVertical="$sm"
      minHeight={MIN_TOUCH_TARGET_SIZE}
      justifyContent="center"
      opacity={disabled ? opacity.disabled : undefined}
      focusWithinStyle={{
        borderColor: "$focusRing",
        outlineWidth: 2,
        outlineStyle: "solid",
        outlineColor: "$focusRing",
        outlineOffset: 1,
      }}
    >
      <TextInput
        {...testProps(testID)}
        id={id}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        placeholderTextColor={theme.semantic.textSecondary}
        editable={!disabled && !readOnly}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardTypeMap[inputMode]}
        inputMode={inputMode}
        aria-invalid={invalid || undefined}
        aria-required={required || undefined}
        aria-readonly={readOnly || undefined}
        aria-describedby={describedBy}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.size.body,
          lineHeight: theme.typography.lineHeight.body,
          color: theme.semantic.text,
          padding: 0,
          margin: 0,
          borderWidth: 0,
          backgroundColor: "transparent",
          width: "100%",
        }}
      />
    </TamaguiView>
  );
};
