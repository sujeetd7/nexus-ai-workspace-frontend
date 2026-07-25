import { useState, type FC, type ReactNode } from "react";

import { Button } from "../Button";
import { Icon } from "../Icon";
import { Input, type InputProps } from "../Input";
import { Text } from "../Text";

export type PasswordFieldProps = Omit<
  InputProps,
  "secureTextEntry" | "trailing" | "inputMode"
> & {
  /** Optional leading adornment forwarded to Input. */
  leading?: ReactNode;
  /** Uncontrolled initial visibility. Default: hidden (secure). */
  defaultVisible?: boolean;
};

/**
 * Level 2 password field — Input composition with show/hide control.
 * Reuses Input chrome; toggle is a ghost Button with a decorative Icon glyph.
 */
export const PasswordField: FC<PasswordFieldProps> = ({
  defaultVisible = false,
  disabled = false,
  leading,
  accessibilityLabel,
  testID,
  autoComplete,
  ...inputProps
}) => {
  const [visible, setVisible] = useState(defaultVisible);
  const toggleLabel = visible ? "Hide password" : "Show password";

  const trailing = (
    <Button
      variant="ghost"
      size="sm"
      disabled={disabled}
      accessibilityLabel={toggleLabel}
      testID={testID ? `${testID}-toggle` : undefined}
      onPress={() => {
        if (disabled) {
          return;
        }
        setVisible((current) => !current);
      }}
      leftIcon={
        <Icon decorative size="sm" color="primary">
          <Text variant="caption" color="primary" weight="bold">
            {visible ? "-" : "*"}
          </Text>
        </Icon>
      }
    >
      {visible ? "Hide" : "Show"}
    </Button>
  );

  return (
    <Input
      {...inputProps}
      leading={leading}
      trailing={trailing}
      secureTextEntry={!visible}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      autoComplete={autoComplete ?? "current-password"}
      inputMode="text"
    />
  );
};
