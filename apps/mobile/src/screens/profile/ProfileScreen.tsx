import { useEffect, useState, type FC } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Avatar,
  Button,
  EmptyState,
  InlineAlert,
  Loader,
  Stack,
  Text,
} from '@nexus/shared-ui';
import { useDispatch, useSelector } from 'react-redux';

import {
  useCreateUserProfileMutation,
  useGetCurrentUserQuery,
} from '../../api/services/user/userApi';
import { mapApiError } from '../../hooks/useApiErrorMessage';
import type { RootStackParamList } from '../../navigation/types';
import { MOBILE_ROUTE_NAMES } from '../../navigation/types';
import type { AppDispatch } from '../../store/createAppStore';
import { sessionExpiredAcknowledged } from '../../store/slices/auth/authSlice';
import { selectUser } from '../../store/slices/auth/selectors';
import {
  classifySystemFailure,
  profileFailureCopy,
} from '../../system';

function profileInitials(profile: {
  firstName?: string;
  lastName?: string;
  email: string;
}): string {
  const first = profile.firstName?.trim().charAt(0) ?? '';
  const last = profile.lastName?.trim().charAt(0) ?? '';
  const fromName = `${first}${last}`.trim();
  if (fromName) {
    return fromName.slice(0, 2).toUpperCase();
  }
  return profile.email.trim().charAt(0).toUpperCase() || '?';
}

export const ProfileScreen: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const authUser = useSelector(selectUser);
  const { data, error, isLoading, isFetching, refetch } =
    useGetCurrentUserQuery();
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
        testID="mobile-profile-screen-loading"
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
      context: 'authenticated',
    });
    const copy = profileFailureCopy(presentation.kind, apiError.message);
    const busy = retrying || isFetching;

    return (
      <Stack padding="xl" gap="md" testID="mobile-profile-screen-error">
        <InlineAlert tone={presentation.tone} title={copy.title}>
          {copy.message}
        </InlineAlert>
        {presentation.primaryAction === 'retry' ? (
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
        {presentation.primaryAction === 'signIn' ? (
          <Button
            onPress={() => {
              dispatch(sessionExpiredAcknowledged());
            }}
            accessibilityLabel="Sign in"
          >
            Sign in
          </Button>
        ) : null}
      </Stack>
    );
  }

  if (createState.isError) {
    const apiError = mapApiError(createState.error);
    return (
      <Stack padding="xl" gap="md" testID="mobile-profile-screen-create-error">
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

  const profile = data ?? createState.data;

  if (!profile) {
    return (
      <Stack padding="xl" gap="md" testID="mobile-profile-screen-empty">
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
    [profile.firstName, profile.lastName].filter(Boolean).join(' ') ||
    profile.email;

  return (
    <Stack
      padding="xl"
      gap="md"
      testID="mobile-profile-screen"
      accessibilityLabel="Profile"
    >
      <Text variant="h2" accessibilityRole="heading">
        Profile
      </Text>
      <Stack direction="horizontal" gap="md" align="center">
        <Avatar
          src={profile.avatar}
          initials={profileInitials(profile)}
          alt={displayName}
          size="lg"
          accessibilityLabel={displayName}
          testID="mobile-profile-avatar"
        />
        <Stack gap="sm" flex={1}>
          <Text weight="bold">{displayName}</Text>
          <Text>{profile.email}</Text>
          <Text>Status: {profile.status}</Text>
        </Stack>
      </Stack>
      <Stack gap="sm">
        <Button
          onPress={() => navigation.navigate(MOBILE_ROUTE_NAMES.ProfileEdit)}
          accessibilityLabel="Edit profile"
        >
          Edit profile
        </Button>
        <Button
          variant="secondary"
          onPress={() =>
            navigation.navigate(MOBILE_ROUTE_NAMES.ProfilePreferences)
          }
          accessibilityLabel="Preferences"
        >
          Preferences
        </Button>
      </Stack>
    </Stack>
  );
};
