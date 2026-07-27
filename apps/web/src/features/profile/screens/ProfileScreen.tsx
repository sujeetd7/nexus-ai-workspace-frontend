import { useEffect, type FC } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  InlineAlert,
  Loader,
  Stack,
  Text,
} from "@nexus/shared-ui";
import { useSelector } from "react-redux";

import { mapApiError } from "../../../hooks/useApiErrorMessage";
import { WEB_ROUTE_PATHS } from "../../../router/paths";
import { selectUser } from "../../../store/slices/auth/selectors";
import {
  useCreateUserProfileMutation,
  useGetCurrentUserQuery,
} from "../api";

export const ProfileScreen: FC = () => {
  const authUser = useSelector(selectUser);
  const {
    data: profile,
    error,
    isLoading,
    refetch,
  } = useGetCurrentUserQuery();
  const [createProfile, createState] = useCreateUserProfileMutation();

  useEffect(() => {
    if (
      error &&
      mapApiError(error).status === 404 &&
      authUser &&
      !createState.isLoading &&
      !createState.data
    ) {
      void createProfile({
        authUserId: authUser.id,
        email: authUser.email,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
      });
    }
  }, [authUser, createProfile, createState.data, createState.isLoading, error]);

  if (isLoading || createState.isLoading) {
    return (
      <Stack align="center" padding="xl" gap="md">
        <Loader accessibilityLabel="Loading profile" />
        <Text>Loading profile…</Text>
      </Stack>
    );
  }

  if (error && mapApiError(error).status !== 404) {
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

  const current = profile ?? createState.data;

  if (!current) {
    return (
      <Stack padding="xl" gap="md">
        <Text variant="h2">Profile unavailable</Text>
        <Text>We could not load your profile.</Text>
      </Stack>
    );
  }

  const displayName =
    [current.firstName, current.lastName].filter(Boolean).join(" ") ||
    current.email;

  return (
    <Stack padding="xl" gap="lg" testID="profile-screen">
      <Text variant="h2">Profile</Text>
      <Stack gap="sm">
        <Text weight="bold">{displayName}</Text>
        <Text>{current.email}</Text>
        <Text>Status: {current.status}</Text>
        {current.avatar ? <Text>Avatar: {current.avatar}</Text> : null}
      </Stack>
      <Stack direction="horizontal" gap="md">
        <Link to={WEB_ROUTE_PATHS.profileEdit}>
          <Button>Edit profile</Button>
        </Link>
        <Link to={WEB_ROUTE_PATHS.profilePreferences}>
          <Button variant="secondary">Preferences</Button>
        </Link>
      </Stack>
    </Stack>
  );
};
