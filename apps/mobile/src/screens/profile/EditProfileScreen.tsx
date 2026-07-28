import { useState, type FC } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Button,
  FormField,
  InlineAlert,
  Loader,
  Stack,
  Text,
} from '@nexus/shared-ui';
import type { UserProfile } from '@nexus/shared-types';
import { updateUserProfileSchema } from '@nexus/shared-validation';
import { useDispatch } from 'react-redux';

import {
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
} from '../../api/services/user/userApi';
import { mapApiError } from '../../hooks/useApiErrorMessage';
import { useValidatedForm } from '../../hooks/useValidatedForm';
import type { RootStackParamList } from '../../navigation/types';
import { MOBILE_ROUTE_NAMES } from '../../navigation/types';
import type { AppDispatch } from '../../store/createAppStore';
import { sessionExpiredAcknowledged } from '../../store/slices/auth/authSlice';
import {
  classifySystemFailure,
  profileFailureCopy,
} from '../../system';

type EditProfileValues = {
  firstName?: string;
  lastName?: string;
  avatar?: string;
};

function normalizeEditValues(values: EditProfileValues): EditProfileValues {
  return {
    firstName: values.firstName?.trim() || undefined,
    lastName: values.lastName?.trim() || undefined,
    avatar: values.avatar?.trim() || undefined,
  };
}

const EditProfileForm: FC<{ readonly profile: UserProfile }> = ({
  profile,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [updateProfile, updateState] = useUpdateCurrentUserMutation();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();

  const form = useValidatedForm<EditProfileValues>({
    schema: {
      safeParse(value) {
        return updateUserProfileSchema.safeParse(normalizeEditValues(value));
      },
    },
    initialValues: {
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      avatar: profile.avatar ?? '',
    },
  });

  const onSubmit = async () => {
    setSuccessMessage(undefined);
    if (!form.validate()) {
      return;
    }

    try {
      await updateProfile(normalizeEditValues(form.values)).unwrap();
      setSuccessMessage('Profile updated.');
      navigation.navigate(MOBILE_ROUTE_NAMES.Profile);
    } catch {
      // mutation error surfaced below
    }
  };

  const mutationError = updateState.error
    ? mapApiError(updateState.error)
    : undefined;

  return (
    <Stack padding="xl" gap="md" testID="mobile-edit-profile-screen">
      <Text variant="h2" accessibilityRole="heading">
        Edit profile
      </Text>
      {successMessage ? (
        <InlineAlert tone="success" title="Saved">
          {successMessage}
        </InlineAlert>
      ) : null}
      {mutationError ? (
        <InlineAlert tone="error" title="Unable to update profile">
          {mutationError.message}
        </InlineAlert>
      ) : null}
      <FormField
        label="First name"
        value={form.values.firstName}
        onChangeText={value => form.setField('firstName', value)}
        errorText={form.fieldErrors.firstName}
        accessibilityLabel="First name"
      />
      <FormField
        label="Last name"
        value={form.values.lastName}
        onChangeText={value => form.setField('lastName', value)}
        errorText={form.fieldErrors.lastName}
        accessibilityLabel="Last name"
      />
      <FormField
        label="Avatar URL"
        value={form.values.avatar}
        onChangeText={value => form.setField('avatar', value)}
        errorText={form.fieldErrors.avatar}
        helperText="Optional image URL supported by the user service."
        accessibilityLabel="Avatar URL"
      />
      <Button
        loading={updateState.isLoading}
        onPress={() => {
          void onSubmit();
        }}
        accessibilityLabel="Save profile changes"
      >
        Save changes
      </Button>
      <Button
        variant="secondary"
        onPress={() => navigation.navigate(MOBILE_ROUTE_NAMES.Profile)}
        accessibilityLabel="Cancel"
      >
        Cancel
      </Button>
    </Stack>
  );
};

export const EditProfileScreen: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: profile, isLoading, isFetching, error, refetch } =
    useGetCurrentUserQuery();
  const [retrying, setRetrying] = useState(false);

  if (isLoading) {
    return (
      <Stack
        align="center"
        padding="xl"
        gap="md"
        testID="mobile-edit-profile-loading"
        accessibilityLabel="Loading profile"
      >
        <Loader accessibilityLabel="Loading profile" />
        <Text>Loading profile…</Text>
      </Stack>
    );
  }

  if (error) {
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
      <Stack padding="xl" gap="md" testID="mobile-edit-profile-error">
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

  if (!profile) {
    return (
      <Stack padding="xl" gap="md" testID="mobile-edit-profile-empty">
        <InlineAlert tone="error" title="Profile unavailable">
          We could not load your profile.
        </InlineAlert>
        <Button
          onPress={() => refetch()}
          accessibilityLabel="Retry loading profile"
        >
          Retry
        </Button>
      </Stack>
    );
  }

  return <EditProfileForm key={profile.updatedAt} profile={profile} />;
};
