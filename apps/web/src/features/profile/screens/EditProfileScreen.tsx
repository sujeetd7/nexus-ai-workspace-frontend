import { type FC, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  FormField,
  InlineAlert,
  Loader,
  Stack,
  Text,
} from "@nexus/shared-ui";
import { updateUserProfileSchema } from "@nexus/shared-validation";

import { mapApiError } from "../../../hooks/useApiErrorMessage";
import { useValidatedForm } from "../../../hooks/useValidatedForm";
import { WEB_ROUTE_PATHS } from "../../../router/paths";
import { useGetCurrentUserQuery, useUpdateCurrentUserMutation } from "../api";

export const EditProfileScreen: FC = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading, error, refetch } = useGetCurrentUserQuery();
  const [updateProfile, updateState] = useUpdateCurrentUserMutation();

  const form = useValidatedForm<{
    firstName?: string;
    lastName?: string;
    avatar?: string;
  }>({
    schema: updateUserProfileSchema,
    initialValues: {
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
      avatar: profile?.avatar ?? "",
    },
  });

  if (isLoading) {
    return <Loader accessibilityLabel="Loading profile" />;
  }

  if (error) {
    const apiError = mapApiError(error);
    return (
      <Stack padding="xl" gap="md">
        <InlineAlert tone="error" title="Unable to load profile">
          {apiError.message}
        </InlineAlert>
        {apiError.retryable ? (
          <Button onPress={() => refetch()}>Retry</Button>
        ) : null}
      </Stack>
    );
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.validate()) {
      return;
    }

    try {
      await updateProfile({
        firstName: form.values.firstName || undefined,
        lastName: form.values.lastName || undefined,
        avatar: form.values.avatar || undefined,
      }).unwrap();
      navigate(WEB_ROUTE_PATHS.profile);
    } catch {
      // mutation error surfaced below
    }
  };

  const mutationError = updateState.error
    ? mapApiError(updateState.error).message
    : undefined;

  return (
    <Stack padding="xl" gap="lg" testID="edit-profile-screen">
      <Text variant="h2">Edit profile</Text>
      {mutationError ? (
        <InlineAlert tone="error" title="Unable to update profile">
          {mutationError}
        </InlineAlert>
      ) : null}
      <form onSubmit={onSubmit}>
        <Stack gap="md">
          <FormField
            label="First name"
            value={form.values.firstName}
            onChangeText={(value) => form.setField("firstName", value)}
            errorText={form.fieldErrors.firstName}
          />
          <FormField
            label="Last name"
            value={form.values.lastName}
            onChangeText={(value) => form.setField("lastName", value)}
            errorText={form.fieldErrors.lastName}
          />
          <FormField
            label="Avatar URL"
            value={form.values.avatar}
            onChangeText={(value) => form.setField("avatar", value)}
            errorText={form.fieldErrors.avatar}
          />
          <Stack direction="horizontal" gap="md">
            <Button type="submit" loading={updateState.isLoading}>
              Save changes
            </Button>
            <Link to={WEB_ROUTE_PATHS.profile}>
              <Button variant="secondary">Cancel</Button>
            </Link>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};
