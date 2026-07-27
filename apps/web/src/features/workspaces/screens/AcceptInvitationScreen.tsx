import { type FC, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Button,
  FormField,
  InlineAlert,
  Stack,
  Text,
} from "@nexus/shared-ui";
import { acceptInvitationSchema } from "@nexus/shared-validation";

import { mapApiError } from "../../../hooks/useApiErrorMessage";
import { useValidatedForm } from "../../../hooks/useValidatedForm";
import { useWorkspaceSwitch } from "../../../hooks/useWorkspaceSwitch";
import { WEB_ROUTE_PATHS } from "../../../router/paths";
import { useAcceptInvitationMutation } from "../api";

export const AcceptInvitationScreen: FC = () => {
  const [searchParams] = useSearchParams();
  const switchWorkspace = useWorkspaceSwitch();
  const [acceptInvitation, acceptState] = useAcceptInvitationMutation();

  const form = useValidatedForm<{ token: string }>({
    schema: acceptInvitationSchema,
    initialValues: {
      token: searchParams.get("token") ?? "",
    },
  });

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
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

  const mutationError = acceptState.error
    ? mapApiError(acceptState.error).message
    : undefined;

  return (
    <Stack padding="xl" gap="lg" testID="accept-invitation-screen">
      <Text variant="h2">Accept invitation</Text>
      {mutationError ? (
        <InlineAlert tone="error" title="Unable to accept invitation">
          {mutationError}
        </InlineAlert>
      ) : null}
      {acceptState.isSuccess ? (
        <InlineAlert tone="success" title="Invitation accepted">
          You have joined the workspace.
        </InlineAlert>
      ) : null}
      <form onSubmit={onSubmit}>
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
        </Stack>
      </form>
      <Link to={WEB_ROUTE_PATHS.workspaces}>
        <Button variant="secondary">Back to workspaces</Button>
      </Link>
    </Stack>
  );
};
