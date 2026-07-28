import type { FC, ReactNode } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from '@nexus/shared-ui';

import { Drawer } from './components/Drawer';
import { Header } from './components/Header';
import {
  ContentArea,
  type ContentAreaState,
} from './components/ContentArea';
import { useDrawer } from './hooks/useDrawer';
import { styles } from './MobileAppShell.styles';

export interface MobileAppShellProps {
  readonly children?: ReactNode;
  readonly contentState?: ContentAreaState;
  readonly testID?: string;
}

/**
 * Production Nexus mobile application shell — header, drawer, and content region.
 */
export const MobileAppShell: FC<MobileAppShellProps> = ({
  children,
  contentState = 'default',
  testID = 'mobile-application-shell',
}) => {
  const drawer = useDrawer();

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={styles.root}
      testID={testID}
      accessibilityLabel="Application"
    >
      <View flex={1} background="background">
        <Header
          onMenuPress={drawer.toggleDrawer}
          testID={`${testID}-header`}
        />

        <View style={styles.body} testID={`${testID}-body`}>
          <Drawer
            open={drawer.open}
            onClose={drawer.closeDrawer}
          />

          <KeyboardAvoidingView
            style={styles.mainColumn}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <ScrollView
                style={styles.mainContent}
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
                testID={`${testID}-main`}
                accessibilityLabel="Main content"
              >
                <ContentArea state={contentState}>{children}</ContentArea>
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </View>

      <SafeAreaView edges={['bottom']} />
    </SafeAreaView>
  );
};
