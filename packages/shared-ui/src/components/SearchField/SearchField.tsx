import type { FC, ReactNode } from "react";

import { Icon } from "../Icon";
import { IconButton } from "../IconButton";
import { Input } from "../Input";
import { Loader } from "../Loader";
import { Text } from "../Text";

export interface SearchFieldProps {
  /** Controlled value — required (no uncontrolled mode). */
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  /**
   * Leading adornment. Defaults to a decorative search glyph.
   * Pass `null` to omit the leading slot.
   */
  leadingIcon?: ReactNode | null;
  loading?: boolean;
  disabled?: boolean;
  /**
   * Called when the clear control is pressed.
   * Defaults to `onChangeText("")` when omitted.
   */
  onClear?: () => void;
  /** Accessible name for the clear control. */
  clearAccessibilityLabel?: string;
  /** Accessible name for the search field — do not rely on placeholder alone. */
  accessibilityLabel: string;
  accessibilityHint?: string;
  id?: string;
  describedBy?: string;
  testID?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

const defaultLeadingIcon = (
  <Icon decorative size="sm" color="textSecondary">
    <Text variant="caption" color="textSecondary" weight="bold">
      ⌕
    </Text>
  </Icon>
);

/**
 * Level 2 search field — controlled Input composition.
 * No autocomplete, debounce, filtering, or search state management.
 */
export const SearchField: FC<SearchFieldProps> = ({
  value,
  onChangeText,
  placeholder,
  leadingIcon,
  loading = false,
  disabled = false,
  onClear,
  clearAccessibilityLabel = "Clear search",
  accessibilityLabel,
  accessibilityHint,
  id,
  describedBy,
  testID,
  onFocus,
  onBlur,
}) => {
  const showClear = value.length > 0 && !loading && !disabled;
  const leading =
    leadingIcon === null
      ? undefined
      : (leadingIcon ?? defaultLeadingIcon);

  const trailing = loading ? (
    <Loader
      size="sm"
      accessibilityLabel="Searching"
      testID={testID ? `${testID}-loading` : undefined}
    />
  ) : showClear ? (
    <IconButton
      size="sm"
      variant="ghost"
      shape="circle"
      disabled={disabled}
      accessibilityLabel={clearAccessibilityLabel}
      testID={testID ? `${testID}-clear` : undefined}
      onPress={() => {
        if (disabled) {
          return;
        }
        if (onClear) {
          onClear();
          return;
        }
        onChangeText("");
      }}
    >
      <Text variant="caption" color="textSecondary" weight="bold">
        ×
      </Text>
    </IconButton>
  ) : undefined;

  return (
    <Input
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      leading={leading}
      trailing={trailing}
      disabled={disabled}
      inputMode="search"
      autoComplete="off"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      id={id}
      describedBy={describedBy}
      testID={testID}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};
