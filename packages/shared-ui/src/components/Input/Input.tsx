import { View as TamaguiView } from "@tamagui/core";
import type { FC, ReactNode } from "react";
import { TextInput, type TextInputProps } from "react-native";

import { MIN_TOUCH_TARGET_SIZE } from "../../accessibility/touchTargets";
import { useTheme } from "../../hooks/useTheme";
import { opacity } from "../../theme/opacity";
import { spacing } from "../../theme/spacing";
import { testProps } from "../shared/a11y";

export type InputMode =
  | "text"
  | "email"
  | "numeric"
  | "tel"
  | "url"
  | "search";

/**
 * Cross-platform autocomplete hint.
 * Web: `autoComplete` on `<input>`. RN: `autoComplete` on TextInput.
 */
export type InputAutoComplete =
  | "off"
  | "on"
  | "name"
  | "email"
  | "username"
  | "current-password"
  | "new-password"
  | "tel"
  | "url"
  | "one-time-code";

type NativeAutoComplete = NonNullable<TextInputProps["autoComplete"]>;

/**
 * Maps the public autocomplete union onto values accepted by RN `TextInput`.
 * HTML-only `"on"` has no RN equivalent — omit rather than pass an invalid value.
 */
function mapAutoCompleteForTextInput(
  value: InputAutoComplete | undefined,
): NativeAutoComplete | undefined {
  switch (value) {
    case undefined:
    case "on":
      return undefined;
    case "off":
      return "off";
    case "name":
      return "name";
    case "email":
      return "email";
    case "username":
      return "username";
    case "current-password":
      return "current-password";
    case "new-password":
      return "new-password";
    case "tel":
      return "tel";
    case "url":
      return "url";
    case "one-time-code":
      return "one-time-code";
    default: {
      const _exhaustive: never = value;
      return _exhaustive;
    }
  }
}

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
  autoComplete?: InputAutoComplete;
  maxLength?: number;
  /** Leading adornment — non-focus-stealing chrome (icons, prefixes). */
  leading?: ReactNode;
  /** Trailing adornment — interactive controls (e.g. password toggle) allowed. */
  trailing?: ReactNode;
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
  autoComplete,
  maxLength,
  leading,
  trailing,
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
  const hasLeading = leading != null && leading !== false;
  const hasTrailing = trailing != null && trailing !== false;

  return (
    <TamaguiView
      backgroundColor="$background"
      borderWidth={1}
      borderColor={invalid ? "$danger" : "$borderColor"}
      borderRadius="$md"
      paddingHorizontal="$md"
      paddingVertical="$sm"
      minHeight={MIN_TOUCH_TARGET_SIZE}
      flexDirection="row"
      alignItems="center"
      gap={hasLeading || hasTrailing ? "$sm" : undefined}
      opacity={disabled ? opacity.disabled : undefined}
      focusWithinStyle={{
        borderColor: "$focusRing",
        outlineWidth: 2,
        outlineStyle: "solid",
        outlineColor: "$focusRing",
        outlineOffset: 1,
      }}
    >
      {hasLeading ? (
        <TamaguiView
          flexShrink={0}
          justifyContent="center"
          alignItems="center"
          // Avoid stealing focus from the text field on layout taps.
          pointerEvents="box-none"
          minWidth={spacing.lg}
        >
          {leading}
        </TamaguiView>
      ) : null}
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
        autoComplete={mapAutoCompleteForTextInput(autoComplete)}
        maxLength={maxLength}
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
          flex: 1,
          minWidth: 0,
          width: "100%",
        }}
      />
      {hasTrailing ? (
        <TamaguiView
          flexShrink={0}
          justifyContent="center"
          alignItems="center"
          // Interactive trailing controls (e.g. toggles) remain pressable.
          pointerEvents="box-none"
          minWidth={spacing.lg}
        >
          {trailing}
        </TamaguiView>
      ) : null}
    </TamaguiView>
  );
};
