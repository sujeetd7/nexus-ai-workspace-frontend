import type { FC, ReactNode } from "react";

import { Stack } from "../Stack";
import { Text } from "../Text";
import { View } from "../View";

export type ListRowBodyProps = {
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  trailing?: ReactNode;
  testID?: string;
};

/**
 * Shared content layout for web and native ListRow hosts.
 */
export const ListRowBody: FC<ListRowBodyProps> = ({
  leading,
  title,
  subtitle,
  description,
  trailing,
  testID,
}) => {
  const hasLeading = leading != null && leading !== false;
  const hasTrailing = trailing != null && trailing !== false;
  const hasSubtitle = subtitle != null && subtitle !== false;
  const hasDescription = description != null && description !== false;

  return (
    <>
      {hasLeading ? (
        <View testID={testID ? `${testID}-leading` : undefined} flexShrink={0}>
          {leading}
        </View>
      ) : null}
      <View flex={1} flexShrink={1} minWidth={0}>
        <Stack direction="vertical" gap="xs">
          <Text
            variant="body"
            weight="medium"
            color="text"
            testID={testID ? `${testID}-title` : undefined}
          >
            {title}
          </Text>
          {hasSubtitle ? (
            <Text
              variant="caption"
              color="textSecondary"
              testID={testID ? `${testID}-subtitle` : undefined}
            >
              {subtitle}
            </Text>
          ) : null}
          {hasDescription ? (
            <Text
              variant="caption"
              color="textSecondary"
              testID={testID ? `${testID}-description` : undefined}
            >
              {description}
            </Text>
          ) : null}
        </Stack>
      </View>
      {hasTrailing ? (
        <View testID={testID ? `${testID}-trailing` : undefined} flexShrink={0}>
          {trailing}
        </View>
      ) : null}
    </>
  );
};
