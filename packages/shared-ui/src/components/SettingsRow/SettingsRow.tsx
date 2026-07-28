import type { FC, ReactNode } from "react";

import { Icon } from "../Icon";
import { ListRow, type ListRowProps } from "../ListRow";
import { Stack } from "../Stack";
import { Switch } from "../Switch";
import { Text } from "../Text";
import { View } from "../View";
import type { NexusTestProps } from "../shared/types";
import type { PressHandler } from "../../types/events";

export interface SettingsRowProps extends NexusTestProps {
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  leading?: ReactNode;
  /** Trailing text value (e.g. current preference summary). */
  value?: ReactNode;
  /** Trailing badge node. */
  badge?: ReactNode;
  /** When true, renders a decorative chevron in the trailing cluster. */
  showChevron?: boolean;
  /** Controlled switch — when set with `onSwitchCheckedChange`, renders Switch. */
  switchChecked?: boolean;
  onSwitchCheckedChange?: (checked: boolean) => void;
  /** Required when a switch is rendered. */
  switchAccessibilityLabel?: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: PressHandler;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

/**
 * Level 2 settings row — ListRow composition for preferences / settings lists.
 * No settings business logic.
 */
export const SettingsRow: FC<SettingsRowProps> = ({
  title,
  subtitle,
  description,
  leading,
  value,
  badge,
  showChevron = false,
  switchChecked,
  onSwitchCheckedChange,
  switchAccessibilityLabel,
  selected,
  disabled = false,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const hasSwitch =
    typeof switchChecked === "boolean" &&
    typeof onSwitchCheckedChange === "function";
  const hasValue = value != null && value !== false;
  const hasBadge = badge != null && badge !== false;

  if (hasSwitch && !switchAccessibilityLabel) {
    console.error(
      "SettingsRow: switchAccessibilityLabel is required when rendering a switch.",
    );
  }

  const trailing =
    hasValue || hasBadge || hasSwitch || showChevron ? (
      <Stack direction="horizontal" gap="sm" align="center">
        {hasValue ? (
          <Text
            variant="caption"
            color="textSecondary"
            testID={testID ? `${testID}-value` : undefined}
          >
            {value}
          </Text>
        ) : null}
        {hasBadge ? (
          <View testID={testID ? `${testID}-badge` : undefined}>{badge}</View>
        ) : null}
        {hasSwitch ? (
          <Switch
            checked={switchChecked}
            onCheckedChange={onSwitchCheckedChange}
            disabled={disabled}
            accessibilityLabel={
              switchAccessibilityLabel ??
              (typeof title === "string" ? title : "Setting")
            }
            testID={testID ? `${testID}-switch` : undefined}
          />
        ) : null}
        {showChevron ? (
          <Icon
            decorative
            size="sm"
            color="textSecondary"
            testID={testID ? `${testID}-chevron` : undefined}
          >
            <Text variant="caption" color="textSecondary">
              ›
            </Text>
          </Icon>
        ) : null}
      </Stack>
    ) : undefined;

  const listRowProps: ListRowProps = {
    title,
    subtitle,
    description,
    leading,
    trailing,
    selected,
    disabled,
    onPress,
    accessibilityLabel,
    accessibilityHint,
    testID,
  };

  return <ListRow {...listRowProps} />;
};
