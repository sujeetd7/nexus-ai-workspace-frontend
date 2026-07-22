import type { ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Divider, Stack, Text, View } from "@nexus/shared-ui";

export interface ApplicationShellProps {
  children: ReactNode;
  title?: string;
  testID?: string;
}

/**
 * Application-owned mobile shell — safe-area-aware structural framing only.
 */
export function ApplicationShell({
  children,
  title = "Nexus",
  testID = "application-shell",
}: ApplicationShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      flex={1}
      background="background"
      testID={testID}
      accessibilityLabel="Application"
      style={{
        paddingTop: insets.top,
        paddingBottom: Math.max(insets.bottom, 12),
        paddingLeft: Math.max(insets.left, 12),
        paddingRight: Math.max(insets.right, 12),
      }}
    >
      <Stack direction="vertical" flex={1} gap="md">
        <Stack
          direction="horizontal"
          align="center"
          justify="space-between"
          testID={`${testID}-header`}
          accessibilityLabel="Application header"
        >
          <Text variant="h3" accessibilityRole="heading">
            {title}
          </Text>
          <Text
            variant="caption"
            color="textSecondary"
            accessibilityLabel="Navigation placeholder"
          >
            Navigation
          </Text>
        </Stack>

        <Divider />

        <View flex={1} testID={`${testID}-content`} accessibilityLabel="Main content">
          {children}
        </View>
      </Stack>
    </View>
  );
}
