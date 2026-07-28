import type { FC, ReactNode } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthShell } from "@nexus/shared-ui";

export interface AuthScreenLayoutProps {
  readonly children: ReactNode;
  readonly brand?: ReactNode;
  readonly testID?: string;
}

/**
 * Mobile auth chrome: safe area, keyboard avoidance, scroll, dismiss-on-tap.
 * Composes AuthShell — does not replace navigation architecture.
 */
export const AuthScreenLayout: FC<AuthScreenLayoutProps> = ({
  children,
  brand,
  testID,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.content,
            {
              paddingTop: insets.top,
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
        >
          <AuthShell testID={testID} brand={brand} padding="md">
            {children}
          </AuthShell>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});
