import { useEffect, useState, type FC } from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  Button,
  EmptyState,
  InlineAlert,
  Loader,
  Stack,
  Text,
} from "@nexus/shared-ui";
import { useSelector } from "react-redux";

import { mapApiError } from "../../../hooks/useApiErrorMessage";
import { WEB_ROUTE_PATHS } from "../../../router/paths";
import {
  classifySystemFailure,
  profileFailureCopy,
} from "../../../system";
import { selectUser } from "../../../store/slices/auth/selectors";
import {
  useCreateUserProfileMutation,
  useGetCurrentUserQuery,
} from "../api";

function profileInitials(profile: {
  firstName?: string;
  lastName?: string;
  email: string;
}): string {
  const first = profile.firstName?.trim().charAt(0) ?? "";
  const last = profile.lastName?.trim().charAt(0) ?? "";
  const fromName = `${first}${last}`.trim();
  if (fromName) {
    return fromName.slice(0, 2).toUpperCase();
  }
  return profile.email.trim().charAt(0).toUpperCase() || "?";
}

export const ProfileScreen: FC = () => {
  const authUser = useSelector(selectUser);
  const {
    data: profile,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetCurrentUserQuery();
  const [createProfile, createState] = useCreateUserProfileMutation();
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (
      error &&
      mapApiError(error).status === 404 &&
      authUser &&
      !createState.isLoading &&
      !createState.isError &&
      !createState.data
    ) {
      void createProfile({
        authUserId: authUser.id,
        email: authUser.email,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
      });
    }
  }, [
    authUser,
    createProfile,
    createState.data,
    createState.isError,
    createState.isLoading,
    error,
  ]);

  if (isLoading || createState.isLoading) {
    return (
      <Stack
        align="center"
        padding="xl"
        gap="md"
        testID="profile-screen-loading"
        accessibilityLabel="Loading profile"
      >
        <Loader accessibilityLabel="Loading profile" />
        <Text>Loading profile…</Text>
      </Stack>
    );
  }

  if (error && mapApiError(error).status !== 404) {
    const apiError = mapApiError(error);
    const presentation = classifySystemFailure({
      status: apiError.status,
      code: apiError.code,
      message: apiError.message,
      causeType: apiError.causeType,
      retryable: apiError.retryable,
      authAction: apiError.authAction,
      authorizationAction: apiError.authorizationAction,
      context: "authenticated",
    });
    const copy = profileFailureCopy(presentation.kind, apiError.message);
    const busy = retrying || isFetching;

    return (
      <Stack padding="xl" gap="md" testID="profile-screen-error">
        <InlineAlert tone={presentation.tone} title={copy.title}>
          {copy.message}
        </InlineAlert>
        {presentation.primaryAction === "retry" ? (
          <Button
            loading={busy}
            disabled={busy}
            onPress={() => {
              setRetrying(true);
              void Promise.resolve(refetch()).finally(() => {
                setRetrying(false);
              });
            }}
            accessibilityLabel="Retry loading profile"
          >
            Retry
          </Button>
        ) : null}
        {presentation.primaryAction === "signIn" ? (
          <Link to={WEB_ROUTE_PATHS.login}>
            <Button accessibilityLabel="Sign in">Sign in</Button>
          </Link>
        ) : null}
      </Stack>
    );
  }

  if (createState.isError) {
    const apiError = mapApiError(createState.error);
    return (
      <Stack padding="xl" gap="md" testID="profile-screen-create-error">
        <InlineAlert tone="error" title="Unable to create profile">
          {apiError.message}
        </InlineAlert>
        {apiError.retryable ? (
          <Button
            onPress={() => {
              if (!authUser) {
                return;
              }
              void createProfile({
                authUserId: authUser.id,
                email: authUser.email,
                firstName: authUser.firstName,
                lastName: authUser.lastName,
              });
            }}
            accessibilityLabel="Retry creating profile"
          >
            Retry
          </Button>
        ) : null}
      </Stack>
    );
  }

  const current = profile ?? createState.data;

  if (!current) {
    return (
      <Stack padding="xl" gap="md" testID="profile-screen-empty">
        <EmptyState
          title="Profile unavailable"
          description="We could not load your profile."
        />
        <Button
          onPress={() => refetch()}
          accessibilityLabel="Retry loading profile"
        >
          Retry
        </Button>
      </Stack>
    );
  }

  const displayName =
    [current.firstName, current.lastName].filter(Boolean).join(" ") ||
    current.email;

  return (
    <Stack
      padding="xl"
      gap="lg"
      testID="profile-screen"
      accessibilityLabel="Profile"
    >
      <Text variant="h2" accessibilityRole="heading">
        Profile
      </Text>
      <Stack direction="horizontal" gap="md" align="center">
        <Avatar
          src={current.avatar}
          initials={profileInitials(current)}
          alt={displayName}
          size="lg"
          accessibilityLabel={displayName}
          testID="profile-avatar"
        />
        <Stack gap="sm">
          <Text weight="bold">{displayName}</Text>
          <Text>{current.email}</Text>
          <Text>Status: {current.status}</Text>
        </Stack>
      </Stack>
      <Stack direction="horizontal" gap="md">
        <Link to={WEB_ROUTE_PATHS.profileEdit}>
          <Button accessibilityLabel="Edit profile">Edit profile</Button>
        </Link>
        <Link to={WEB_ROUTE_PATHS.profilePreferences}>
          <Button variant="secondary" accessibilityLabel="Preferences">
            Preferences
          </Button>
        </Link>
      </Stack>
    </Stack>
  );
};
