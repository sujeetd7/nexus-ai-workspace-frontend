import { useState, type FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  FormField,
  InlineAlert,
  Stack,
  Text,
  View,
} from "@nexus/shared-ui";
import { loginRequestSchema } from "@nexus/shared-validation";

import { getMobileSession } from "../../api/client/axios";
import { authFailure, authSuccess, loginRequest } from "../../store/slices/auth/authSlice";
import {
  selectAuthError,
  selectAuthLoading,
} from "../../store/slices/auth/selectors";
import type { AppDispatch } from "../../store/createAppStore";

export const LoginScreen: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectAuthLoading);
  const apiError = useSelector(selectAuthError);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const onSubmit = async () => {
    const parsed = loginRequestSchema.safeParse({ email, password });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        next[key] = issue.message;
      }
      setFieldErrors(next);
      return;
    }

    dispatch(loginRequest());
    try {
      const snapshot = await getMobileSession().login(email, password);
      if (snapshot.user && snapshot.accessToken && snapshot.refreshToken) {
        dispatch(
          authSuccess({
            user: snapshot.user,
            tokens: {
              accessToken: snapshot.accessToken,
              refreshToken: snapshot.refreshToken,
            },
          }),
        );
      }
    } catch (error) {
      dispatch(
        authFailure(
          error instanceof Error ? error.message : "Unable to sign in.",
        ),
      );
    }
  };

  return (
    <View testID="mobile-login-shell" padding="md">
      <Stack gap="md">
        <Text variant="h2">Sign in</Text>
        {apiError ? (
          <InlineAlert tone="error" title="Unable to sign in">
            {apiError}
          </InlineAlert>
        ) : null}
        <FormField
          label="Email"
          value={email}
          onChangeText={setEmail}
          errorText={fieldErrors.email}
          inputMode="email"
        />
        <FormField
          label="Password"
          value={password}
          onChangeText={setPassword}
          errorText={fieldErrors.password}
          secureTextEntry
        />
        <Button loading={loading} onPress={onSubmit}>
          Sign in
        </Button>
        <Text variant="caption" color="textSecondary">
          Mobile secure credential persistence is deferred (TD-008).
        </Text>
      </Stack>
    </View>
  );
};
