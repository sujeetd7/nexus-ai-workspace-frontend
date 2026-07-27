import { type FC, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  FormField,
  InlineAlert,
  Loader,
  Stack,
  Text,
} from "@nexus/shared-ui";
import type { WorkspaceRole } from "@nexus/shared-types";
import { inviteMemberSchema } from "@nexus/shared-validation";
import { useSelector } from "react-redux";

import { mapApiError } from "../../../hooks/useApiErrorMessage";
import { useValidatedForm } from "../../../hooks/useValidatedForm";
import { selectUser } from "../../../store/slices/auth/selectors";
import {
  useCreateInvitationMutation,
  useDeleteInvitationMutation,
  useGetWorkspaceQuery,
  useListInvitationsQuery,
} from "../api";

export const WorkspaceInvitationsScreen: FC = () => {
  const { workspaceId = "" } = useParams();
  const authUser = useSelector(selectUser);
  const { data: workspace } = useGetWorkspaceQuery(workspaceId, {
    skip: !workspaceId,
  });
  const { data, error, isLoading, refetch } = useListInvitationsQuery(
    workspaceId,
    { skip: !workspaceId },
  );
  const [deleteInvitation, deleteState] = useDeleteInvitationMutation();

  if (!workspaceId) {
    return <Text>Workspace not found.</Text>;
  }

  if (isLoading) {
    return <Loader accessibilityLabel="Loading invitations" />;
  }

  if (error) {
    const apiError = mapApiError(error);
    return (
      <Stack padding="xl" gap="md">
        <InlineAlert tone="error" title="Unable to load invitations">
          {apiError.message}
        </InlineAlert>
        {apiError.retryable ? (
          <Button onPress={() => refetch()}>Retry</Button>
        ) : null}
      </Stack>
    );
  }

  const invitations = data ?? [];
  const canManage =
    authUser?.id === workspace?.ownerId ||
    authUser?.role === "ADMIN" ||
    authUser?.role === "MANAGER";

  return (
    <Stack padding="xl" gap="lg" testID="workspace-invitations-screen">
      <Stack direction="horizontal" justify="space-between" align="center">
        <Text variant="h2">Invitations</Text>
        {canManage ? (
          <Link to={`/workspaces/${workspaceId}/invite`}>
            <Button>Invite member</Button>
          </Link>
        ) : null}
      </Stack>
      {invitations.length === 0 ? <Text>No invitations.</Text> : null}
      <Stack gap="md">
        {invitations.map((invitation) => (
          <Stack
            key={invitation.id}
            direction="horizontal"
            justify="space-between"
            align="center"
            gap="md"
          >
            <Stack gap="xs">
              <Text weight="bold">{invitation.email}</Text>
              <Text>
                {invitation.role} · {invitation.status}
              </Text>
            </Stack>
            {canManage && invitation.status === "PENDING" ? (
              <Button
                variant="secondary"
                loading={deleteState.isLoading}
                onPress={() => deleteInvitation(invitation.id)}
              >
                Cancel
              </Button>
            ) : null}
          </Stack>
        ))}
      </Stack>
      <Link to={`/workspaces/${workspaceId}`}>
        <Button variant="secondary">Back to workspace</Button>
      </Link>
    </Stack>
  );
};

export const InviteMemberScreen: FC = () => {
  const { workspaceId = "" } = useParams();
  const authUser = useSelector(selectUser);
  const [createInvitation, createState] = useCreateInvitationMutation();

  const form = useValidatedForm<{
    email: string;
    invitedBy: string;
    role: WorkspaceRole;
  }>({
    schema: inviteMemberSchema,
    initialValues: {
      email: "",
      invitedBy: authUser?.id ?? "",
      role: "DEVELOPER" as WorkspaceRole,
    },
  });

  if (!workspaceId) {
    return <Text>Workspace not found.</Text>;
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!authUser || !form.validate()) {
      return;
    }

    try {
      await createInvitation({
        workspaceId,
        body: {
          email: form.values.email,
          invitedBy: authUser.id,
          role: form.values.role as WorkspaceRole,
        },
      }).unwrap();
      form.reset();
    } catch {
      // surfaced below
    }
  };

  const mutationError = createState.error
    ? mapApiError(createState.error).message
    : undefined;

  return (
    <Stack padding="xl" gap="lg" testID="invite-member-screen">
      <Text variant="h2">Invite member</Text>
      {mutationError ? (
        <InlineAlert tone="error" title="Unable to send invitation">
          {mutationError}
        </InlineAlert>
      ) : null}
      {createState.isSuccess ? (
        <InlineAlert tone="success" title="Invitation sent">
          The invitation was created successfully.
        </InlineAlert>
      ) : null}
      <form onSubmit={onSubmit}>
        <Stack gap="md">
          <FormField
            label="Email"
            value={form.values.email}
            onChangeText={(value) => form.setField("email", value)}
            errorText={form.fieldErrors.email}
            required
          />
          <label htmlFor="invite-role">
            <Text weight="bold">Role</Text>
          </label>
          <select
            id="invite-role"
            value={form.values.role}
            onChange={(event) =>
              form.setField("role", event.target.value as WorkspaceRole)
            }
          >
            <option value="ADMIN">ADMIN</option>
            <option value="DEVELOPER">DEVELOPER</option>
            <option value="VIEWER">VIEWER</option>
          </select>
          <Stack direction="horizontal" gap="md">
            <Button type="submit" loading={createState.isLoading}>
              Send invitation
            </Button>
            <Link to={`/workspaces/${workspaceId}/invitations`}>
              <Button variant="secondary">Back</Button>
            </Link>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};
