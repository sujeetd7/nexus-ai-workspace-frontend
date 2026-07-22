import { useId, type FC, type ReactNode } from "react";

import { ErrorText } from "../ErrorText";
import { HelperText } from "../HelperText";
import { Input, type InputMode, type InputProps } from "../Input";
import { Label } from "../Label";
import { Stack } from "../Stack";
import type { NexusTestProps } from "../shared/types";

export interface FormFieldProps extends NexusTestProps {
  label: ReactNode;
  /** Helper guidance shown when there is no error. */
  helperText?: ReactNode;
  /** Error message; when set, marks the input invalid and hides helper text. */
  errorText?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  /** Controlled value passthrough to Input. */
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  readOnly?: boolean;
  secureTextEntry?: boolean;
  inputMode?: InputMode;
  onChangeText?: InputProps["onChangeText"];
  onFocus?: InputProps["onFocus"];
  onBlur?: InputProps["onBlur"];
  /**
   * Optional stable field id. Defaults to a React `useId` value.
   * Used for Label↔Input association on web.
   */
  id?: string;
  /** Overrides the Input accessible name (defaults to string label when possible). */
  accessibilityLabel?: string;
}

function resolveLabelString(label: ReactNode): string | undefined {
  return typeof label === "string" ? label : undefined;
}

/**
 * Level 2 form field composite: Label + Input + HelperText / ErrorText.
 * No form-library integration (React Hook Form stays out of scope).
 */
export const FormField: FC<FormFieldProps> = ({
  label,
  helperText,
  errorText,
  required = false,
  disabled = false,
  value,
  defaultValue,
  placeholder,
  readOnly,
  secureTextEntry,
  inputMode,
  onChangeText,
  onFocus,
  onBlur,
  id: idProp,
  accessibilityLabel,
  testID,
}) => {
  const generatedId = useId();
  const fieldId = idProp ?? generatedId;
  const helperId = `${fieldId}-helper`;
  const errorId = `${fieldId}-error`;
  const hasError = errorText != null && errorText !== false && errorText !== "";
  const hasHelper =
    !hasError &&
    helperText != null &&
    helperText !== false &&
    helperText !== "";
  const describedBy = hasError ? errorId : hasHelper ? helperId : undefined;
  const labelName = accessibilityLabel ?? resolveLabelString(label);
  const accessibilityHint = hasError
    ? typeof errorText === "string"
      ? errorText
      : undefined
    : hasHelper && typeof helperText === "string"
      ? helperText
      : undefined;

  return (
    <Stack
      direction="vertical"
      gap="sm"
      testID={testID}
      accessibilityLabel={labelName}
    >
      <Label htmlFor={fieldId} required={required} disabled={disabled}>
        {label}
      </Label>
      <Input
        id={fieldId}
        testID={testID ? `${testID}-input` : undefined}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        invalid={hasError}
        required={required}
        secureTextEntry={secureTextEntry}
        inputMode={inputMode}
        describedBy={describedBy}
        accessibilityLabel={labelName}
        accessibilityHint={accessibilityHint}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {hasError ? (
        <ErrorText id={errorId} testID={testID ? `${testID}-error` : undefined}>
          {errorText}
        </ErrorText>
      ) : null}
      {hasHelper ? (
        <HelperText
          id={helperId}
          testID={testID ? `${testID}-helper` : undefined}
        >
          {helperText}
        </HelperText>
      ) : null}
    </Stack>
  );
};
