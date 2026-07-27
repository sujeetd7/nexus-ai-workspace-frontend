import { type FC, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  FormField,
  InlineAlert,
  Stack,
  Text,
} from "@nexus/shared-ui";
import { createWorkspaceSchema } from "@nexus/shared-validation";
import { useSelector } from "react-redux";

import { mapApiError } from "../../../hooks/useApiErrorMessage";
import { useValidatedForm } from "../../../hooks/useValidatedForm";
import { useWorkspaceSwitch } from "../../../hooks/useWorkspaceSwitch";
import { WEB_ROUTE_PATHS } from "../../../router/paths";
import { selectUser } from "../../../store/slices/auth/selectors";
import { useCreateWorkspaceMutation } from "../api";

export const CreateWorkspaceScreen: FC = () => {
  const navigate = useNavigate();
  const authUser = useSelector(selectUser);
  const switchWorkspace = useWorkspaceSwitch();
  const [createWorkspace, createState] = useCreateWorkspaceMutation();

  const form = useValidatedForm<{
    name: string;
    description?: string;
    ownerId: string;
  }>({
    schema: createWorkspaceSchema,
    initialValues: {
      name: "",
      description: "",
      ownerId: authUser?.id ?? "",
    },
  });

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!authUser || !form.validate()) {
      return;
    }

    try {
      const workspace = await createWorkspace({
        name: form.values.name,
        description: form.values.description || undefined,
        ownerId: authUser.id,
      }).unwrap();
      await switchWorkspace(workspace.id);
      navigate(`/workspaces/${workspace.id}`);
    } catch {
      // surfaced below
    }
  };

  const mutationError = createState.error
    ? mapApiError(createState.error).message
    : undefined;

  return (
    <Stack padding="xl" gap="lg" testID="create-workspace-screen">
      <Text variant="h2">Create workspace</Text>
      {mutationError ? (
        <InlineAlert tone="error" title="Unable to create workspace">
          {mutationError}
        </InlineAlert>
      ) : null}
      <form onSubmit={onSubmit}>
        <Stack gap="md">
          <FormField
            label="Name"
            value={form.values.name}
            onChangeText={(value) => form.setField("name", value)}
            errorText={form.fieldErrors.name}
            required
          />
          <FormField
            label="Description"
            value={form.values.description}
            onChangeText={(value) => form.setField("description", value)}
          />
          <Stack direction="horizontal" gap="md">
            <Button type="submit" loading={createState.isLoading}>
              Create workspace
            </Button>
            <Link to={WEB_ROUTE_PATHS.workspaces}>
              <Button variant="secondary">Cancel</Button>
            </Link>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};
