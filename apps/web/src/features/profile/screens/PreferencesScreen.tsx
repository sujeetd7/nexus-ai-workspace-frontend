import { type FC, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  InlineAlert,
  Loader,
  Stack,
  Text,
} from "@nexus/shared-ui";

import { mapApiError } from "../../../hooks/useApiErrorMessage";
import { WEB_ROUTE_PATHS } from "../../../router/paths";
import { useGetCurrentUserQuery, useUpdateCurrentUserMutation } from "../api";

export const PreferencesScreen: FC = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading, error, refetch } = useGetCurrentUserQuery();
  const [updateProfile, updateState] = useUpdateCurrentUserMutation();

  if (isLoading) {
    return <Loader accessibilityLabel="Loading preferences" />;
  }

  if (error) {
    const apiError = mapApiError(error);
    return (
      <Stack padding="xl" gap="md">
        <InlineAlert tone="error" title="Unable to load preferences">
          {apiError.message}
        </InlineAlert>
        {apiError.retryable ? (
          <Button onPress={() => refetch()}>Retry</Button>
        ) : null}
      </Stack>
    );
  }

  const preferences = profile?.preferences ?? {};
  const preferenceText = JSON.stringify(preferences, null, 2);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const textarea = form.elements.namedItem("preferences") as
      | HTMLTextAreaElement
      | null;

    if (!textarea) {
      return;
    }

    try {
      const parsed = JSON.parse(textarea.value || "{}") as Record<
        string,
        unknown
      >;
      await updateProfile({ preferences: parsed }).unwrap();
      navigate(WEB_ROUTE_PATHS.profile);
    } catch {
      // surfaced below
    }
  };

  const mutationError = updateState.error
    ? mapApiError(updateState.error).message
    : undefined;

  return (
    <Stack padding="xl" gap="lg" testID="preferences-screen">
      <Text variant="h2">Preferences</Text>
      {mutationError ? (
        <InlineAlert tone="error" title="Unable to update preferences">
          {mutationError}
        </InlineAlert>
      ) : null}
      <form onSubmit={onSubmit}>
        <Stack gap="md">
          <label htmlFor="preferences-json">
            <Text weight="bold">Preferences (JSON)</Text>
          </label>
          <textarea
            id="preferences-json"
            name="preferences"
            rows={10}
            defaultValue={preferenceText}
            aria-label="Preferences JSON"
            style={{ width: "100%", fontFamily: "monospace" }}
          />
          <Stack direction="horizontal" gap="md">
            <Button type="submit" loading={updateState.isLoading}>
              Save preferences
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
