import { useEffect, type FC } from 'react';
import { useSelector } from 'react-redux';
import { Button, InlineAlert, Loader, Stack, Text } from '@nexus/shared-ui';

import {
  useCreateUserProfileMutation,
  useGetCurrentUserQuery,
} from '../../api/services/user/userApi';
import { selectUser } from '../../store/slices/auth/selectors';

export const ProfileScreen: FC = () => {
  const authUser = useSelector(selectUser);
  const { data, error, isLoading, refetch } = useGetCurrentUserQuery();
  const [createProfile, createState] = useCreateUserProfileMutation();

  useEffect(() => {
    if (error && authUser && !createState.isLoading && !createState.data) {
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

  const profile = data ?? createState.data;

  if (!profile) {
    return (
      <Stack padding="xl" gap="md">
        <InlineAlert tone="error" title="Profile unavailable">
          Unable to load profile.
        </InlineAlert>
        <Button onPress={() => refetch()}>Retry</Button>
      </Stack>
    );
  }

  return (
    <Stack padding="xl" gap="md" testID="mobile-profile-screen">
      <Text variant="h2">Profile</Text>
      <Text>{profile.email}</Text>
      <Text>
        {[profile.firstName, profile.lastName].filter(Boolean).join(' ') ||
          'No name set'}
      </Text>
      <Text>Status: {profile.status}</Text>
    </Stack>
  );
};
