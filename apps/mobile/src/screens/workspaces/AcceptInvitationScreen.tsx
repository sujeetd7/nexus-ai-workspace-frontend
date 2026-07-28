import { useState, type FC } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Button,
  FormField,
  InlineAlert,
  Stack,
  Text,
} from '@nexus/shared-ui';
import {
  acceptInvitationSchema,
  rejectInvitationSchema,
} from '@nexus/shared-validation';

import {
  useAcceptInvitationMutation,
  useRejectInvitationMutation,
} from '../../api/services/workspace/workspaceApi';
import { mapApiError } from '../../hooks/useApiErrorMessage';
import { useValidatedForm } from '../../hooks/useValidatedForm';
import { useWorkspaceSwitch } from '../../hooks/useWorkspaceSwitch';
import type { RootStackParamList } from '../../navigation/types';
import { MOBILE_ROUTE_NAMES } from '../../navigation/types';

type AcceptRoute = RouteProp<RootStackParamList, 'AcceptInvitation'>;

export const AcceptInvitationScreen: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<AcceptRoute>();
  const switchWorkspace = useWorkspaceSwitch();
  const [acceptInvitation, acceptState] = useAcceptInvitationMutation();
  const [rejectInvitation, rejectState] = useRejectInvitationMutation();
  const [declineMessage, setDeclineMessage] = useState<string | undefined>();

  const form = useValidatedForm<{ token: string }>({
    schema: acceptInvitationSchema,
    initialValues: {
      token: route.params?.token ?? '',
    },
  });

  const onAccept = async () => {
    setDeclineMessage(undefined);
    if (!form.validate()) {
      return;
    }

    try {
      const invitation = await acceptInvitation({
        token: form.values.token,
      }).unwrap();
      await switchWorkspace(invitation.workspaceId);
      navigation.navigate(MOBILE_ROUTE_NAMES.Dashboard);
    } catch {
      // surfaced below
    }
  };

  const onDecline = async () => {
    const result = rejectInvitationSchema.safeParse({
      token: form.values.token,
    });
    if (!result.success) {
      form.validate();
      return;
    }

    try {
      await rejectInvitation({ token: form.values.token }).unwrap();
      setDeclineMessage('Invitation declined.');
    } catch {
      // surfaced below
    }
  };

  const acceptError = acceptState.error
    ? mapApiError(acceptState.error).message
    : undefined;
  const declineError = rejectState.error
    ? mapApiError(rejectState.error).message
    : undefined;

  return (
    <Stack padding="xl" gap="lg" testID="mobile-accept-invitation-screen">
      <Text variant="h2" accessibilityRole="heading">
        Accept invitation
      </Text>
      {acceptError ? (
        <InlineAlert tone="error" title="Unable to accept invitation">
          {acceptError}
        </InlineAlert>
      ) : null}
      {declineError ? (
        <InlineAlert tone="error" title="Unable to decline invitation">
          {declineError}
        </InlineAlert>
      ) : null}
      {acceptState.isSuccess ? (
        <InlineAlert tone="success" title="Invitation accepted">
          You have joined the workspace.
        </InlineAlert>
      ) : null}
      {declineMessage ? (
        <InlineAlert tone="success" title="Invitation declined">
          {declineMessage}
        </InlineAlert>
      ) : null}
      <FormField
        label="Invitation token"
        value={form.values.token}
        onChangeText={value => form.setField('token', value)}
        errorText={form.fieldErrors.token}
        required
        accessibilityLabel="Invitation token"
      />
      <Button
        loading={acceptState.isLoading}
        onPress={() => {
          void onAccept();
        }}
        accessibilityLabel="Accept invitation"
      >
        Accept invitation
      </Button>
      <Button
        variant="secondary"
        loading={rejectState.isLoading}
        onPress={() => {
          void onDecline();
        }}
        accessibilityLabel="Decline invitation"
      >
        Decline invitation
      </Button>
      <Button
        variant="secondary"
        onPress={() => navigation.navigate(MOBILE_ROUTE_NAMES.Workspaces)}
        accessibilityLabel="Back to workspaces"
      >
        Back to workspaces
      </Button>
    </Stack>
  );
};
