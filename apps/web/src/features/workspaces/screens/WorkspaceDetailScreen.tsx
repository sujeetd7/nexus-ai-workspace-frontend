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
import { updateWorkspaceSchema } from "@nexus/shared-validation";
import { useSelector } from "react-redux";

import { mapApiError } from "../../../hooks/useApiErrorMessage";
import { useValidatedForm } from "../../../hooks/useValidatedForm";
import { WEB_ROUTE_PATHS } from "../../../router/paths";
import { selectUser } from "../../../store/slices/auth/selectors";
import { useGetWorkspaceQuery, useUpdateWorkspaceMutation } from "../api";

export const WorkspaceDetailScreen: FC = () => {
  const { workspaceId = "" } = useParams();
  const authUser = useSelector(selectUser);
  const { data, error, isLoading, refetch } = useGetWorkspaceQuery(
    workspaceId,
    { skip: !workspaceId },
  );
  const [updateWorkspace, updateState] = useUpdateWorkspaceMutation();

  const form = useValidatedForm<{
    name?: string;
    description?: string;
  }>({
    schema: updateWorkspaceSchema,
    initialValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
    },
  });

  if (!workspaceId) {
    return <Text>Workspace not found.</Text>;
  }

  if (isLoading) {
    return <Loader accessibilityLabel="Loading workspace" />;
  }

  if (error) {
    const apiError = mapApiError(error);
    return (
      <Stack padding="xl" gap="md">
        <InlineAlert
          tone={apiError.status === 403 ? "warning" : "error"}
          title="Unable to load workspace"
        >
          {apiError.message}
        </InlineAlert>
        {apiError.retryable ? (
          <Button onPress={() => refetch()}>Retry</Button>
        ) : null}
      </Stack>
    );
  }

  if (!data) {
    return <Text>Workspace not found.</Text>;
  }

  const canEdit =
    authUser?.id === data.ownerId ||
    authUser?.role === "ADMIN" ||
    authUser?.role === "MANAGER";

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.validate()) {
      return;
    }

    try {
      await updateWorkspace({
        id: workspaceId,
        body: {
          name: form.values.name || undefined,
          description: form.values.description || undefined,
        },
      }).unwrap();
    } catch {
      // surfaced below
    }
  };

  const mutationError = updateState.error
    ? mapApiError(updateState.error).message
    : undefined;

  return (
    <Stack padding="xl" gap="lg" testID="workspace-detail-screen">
      <Text variant="h2">{data.name}</Text>
      <Text>Owner: {data.ownerId}</Text>
      <Text>Status: {data.status}</Text>
      <Stack direction="horizontal" gap="md">
        <Link to={`/workspaces/${workspaceId}/members`}>
          <Button variant="secondary">Members</Button>
        </Link>
        <Link to={`/workspaces/${workspaceId}/invitations`}>
          <Button variant="secondary">Invitations</Button>
        </Link>
        <Link to={WEB_ROUTE_PATHS.workspaces}>
          <Button variant="secondary">All workspaces</Button>
        </Link>
      </Stack>
      {canEdit ? (
        <form onSubmit={onSubmit}>
          <Stack gap="md">
            <Text variant="h3">Edit workspace</Text>
            {mutationError ? (
              <InlineAlert tone="error" title="Unable to update workspace">
                {mutationError}
              </InlineAlert>
            ) : null}
            <FormField
              label="Name"
              value={form.values.name}
              onChangeText={(value) => form.setField("name", value)}
              errorText={form.fieldErrors.name}
            />
            <FormField
              label="Description"
              value={form.values.description}
              onChangeText={(value) => form.setField("description", value)}
            />
            <Button type="submit" loading={updateState.isLoading}>
              Save changes
            </Button>
          </Stack>
        </form>
      ) : (
        <InlineAlert tone="info" title="View only">
          You do not have permission to edit this workspace.
        </InlineAlert>
      )}
    </Stack>
  );
};
