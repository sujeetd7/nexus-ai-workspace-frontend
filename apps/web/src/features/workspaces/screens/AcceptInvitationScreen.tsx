import { useState, type FC, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Button,
  FormField,
  InlineAlert,
  Stack,
  Text,
} from "@nexus/shared-ui";
import {
  acceptInvitationSchema,
  rejectInvitationSchema,
} from "@nexus/shared-validation";

import { mapApiError } from "../../../hooks/useApiErrorMessage";
import { useValidatedForm } from "../../../hooks/useValidatedForm";
import { useWorkspaceSwitch } from "../../../hooks/useWorkspaceSwitch";
import { WEB_ROUTE_PATHS } from "../../../router/paths";
import {
  useAcceptInvitationMutation,
  useRejectInvitationMutation,
} from "../api";

export const AcceptInvitationScreen: FC = () => {
  const [searchParams] = useSearchParams();
  const switchWorkspace = useWorkspaceSwitch();
  const [acceptInvitation, acceptState] = useAcceptInvitationMutation();
  const [rejectInvitation, rejectState] = useRejectInvitationMutation();
  const [declineMessage, setDeclineMessage] = useState<string | undefined>();

  const form = useValidatedForm<{ token: string }>({
    schema: acceptInvitationSchema,
    initialValues: {
      token: searchParams.get("token") ?? "",
    },
  });

  const onAccept = async (event: FormEvent) => {
    event.preventDefault();
    setDeclineMessage(undefined);
    if (!form.validate()) {
      return;
    }

    try {
      const invitation = await acceptInvitation({
        token: form.values.token,
      }).unwrap();
      await switchWorkspace(invitation.workspaceId);
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
      setDeclineMessage("Invitation declined.");
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
    <Stack padding="xl" gap="lg" testID="accept-invitation-screen">
      <Text variant="h2">Accept invitation</Text>
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
      <form onSubmit={onAccept}>
        <Stack gap="md">
          <FormField
            label="Invitation token"
            value={form.values.token}
            onChangeText={(value) => form.setField("token", value)}
            errorText={form.fieldErrors.token}
            required
          />
          <Button type="submit" loading={acceptState.isLoading}>
            Accept invitation
          </Button>
          <Button
            type="button"
            variant="secondary"
            loading={rejectState.isLoading}
            onPress={() => {
              void onDecline();
            }}
            accessibilityLabel="Decline invitation"
          >
            Decline invitation
          </Button>
        </Stack>
      </form>
      <Link to={WEB_ROUTE_PATHS.workspaces}>
        <Button variant="secondary">Back to workspaces</Button>
      </Link>
    </Stack>
  );
};
