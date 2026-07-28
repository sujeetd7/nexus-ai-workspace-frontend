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
import { userPreferencesSchema } from '@nexus/shared-validation';
import { useDispatch } from 'react-redux';

import {
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
} from '../../api/services/user/userApi';
import { mapApiError } from '../../hooks/useApiErrorMessage';
import type { RootStackParamList } from '../../navigation/types';
import { MOBILE_ROUTE_NAMES } from '../../navigation/types';
import type { AppDispatch } from '../../store/createAppStore';
import { sessionExpiredAcknowledged } from '../../store/slices/auth/authSlice';
import {
  classifySystemFailure,
  profileFailureCopy,
} from '../../system';

export const PreferencesScreen: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const { data: profile, isLoading, isFetching, error, refetch } =
    useGetCurrentUserQuery();
  const [updateProfile, updateState] = useUpdateCurrentUserMutation();
  const [retrying, setRetrying] = useState(false);
  const [preferencesText, setPreferencesText] = useState<string | undefined>();
  const [parseError, setParseError] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();

  if (isLoading) {
    return (
      <Stack
        align="center"
        padding="xl"
        gap="md"
        testID="mobile-preferences-loading"
        accessibilityLabel="Loading preferences"
      >
        <Loader accessibilityLabel="Loading preferences" />
        <Text>Loading preferences…</Text>
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
      <Stack padding="xl" gap="md" testID="mobile-preferences-error">
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
            accessibilityLabel="Retry loading preferences"
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

  const preferenceText =
    preferencesText ??
    JSON.stringify(profile?.preferences ?? {}, null, 2);

  const onSubmit = async () => {
    setParseError(undefined);
    setSuccessMessage(undefined);

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(preferenceText || '{}') as Record<string, unknown>;
    } catch {
      setParseError('Preferences must be valid JSON.');
      return;
    }

    const validated = userPreferencesSchema.safeParse({ preferences: parsed });
    if (!validated.success) {
      setParseError(
        validated.error.issues[0]?.message ?? 'Invalid preferences object.',
      );
      return;
    }

    try {
      await updateProfile({ preferences: validated.data.preferences }).unwrap();
      setSuccessMessage('Preferences saved.');
      navigation.navigate(MOBILE_ROUTE_NAMES.Profile);
    } catch {
      // surfaced below
    }
  };

  const mutationError = updateState.error
    ? mapApiError(updateState.error).message
    : undefined;

  return (
    <Stack padding="xl" gap="md" testID="mobile-preferences-screen">
      <Text variant="h2" accessibilityRole="heading">
        Preferences
      </Text>
      {successMessage ? (
        <InlineAlert tone="success" title="Saved">
          {successMessage}
        </InlineAlert>
      ) : null}
      {parseError ? (
        <InlineAlert tone="error" title="Validation error">
          {parseError}
        </InlineAlert>
      ) : null}
      {mutationError ? (
        <InlineAlert tone="error" title="Unable to update preferences">
          {mutationError}
        </InlineAlert>
      ) : null}
      <FormField
        label="Preferences (JSON)"
        value={preferenceText}
        onChangeText={value => setPreferencesText(value)}
        errorText={parseError}
        helperText="JSON object stored on the user profile."
        accessibilityLabel="Preferences JSON"
      />
      <Button
        loading={updateState.isLoading}
        onPress={() => {
          void onSubmit();
        }}
        accessibilityLabel="Save preferences"
      >
        Save preferences
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
