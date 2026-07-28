import type { FC, ReactNode } from 'react';
import { EmptyState, Loader, Stack, View } from '@nexus/shared-ui';

export type ContentAreaState =
  | 'default'
  | 'loading'
  | 'empty'
  | 'error'
  | 'protected';

export interface ContentAreaProps {
  readonly children?: ReactNode;
  readonly state?: ContentAreaState;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly errorTitle?: string;
  readonly errorDescription?: string;
  readonly protectedTitle?: string;
  readonly protectedDescription?: string;
  readonly loadingLabel?: string;
  readonly testID?: string;
}

/**
 * Reusable shell content container — presentation states only; no business logic.
 */
export const ContentArea: FC<ContentAreaProps> = ({
  children,
  state = 'default',
  emptyTitle = 'Nothing here yet',
  emptyDescription = 'Content for this section is not available.',
  errorTitle = 'Unable to load content',
  errorDescription = 'Try again or return to the previous page.',
  protectedTitle = 'Sign in required',
  protectedDescription = 'This content is available after authentication.',
  loadingLabel = 'Loading content',
  testID = 'mobile-app-shell-content-area',
}) => {
  if (state === 'loading') {
    return (
      <Stack
        align="center"
        justify="center"
        padding="xl"
        gap="md"
        testID={`${testID}-loading`}
        accessibilityLabel={loadingLabel}
      >
        <Loader accessibilityLabel={loadingLabel} />
      </Stack>
    );
  }

  if (state === 'empty') {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        testID={`${testID}-empty`}
      />
    );
  }

  if (state === 'error') {
    return (
      <EmptyState
        title={errorTitle}
        description={errorDescription}
        testID={`${testID}-error`}
      />
    );
  }

  if (state === 'protected') {
    return (
      <EmptyState
        title={protectedTitle}
        description={protectedDescription}
        testID={`${testID}-protected`}
      />
    );
  }

  return (
    <View flex={1} testID={testID}>
      {children}
    </View>
  );
};
