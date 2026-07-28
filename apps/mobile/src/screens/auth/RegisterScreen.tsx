import { useEffect, useState, type FC } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useDispatch } from "react-redux";
import {
  AuthCard,
  AuthFooter,
  Button,
  FormField,
  InlineAlert,
  Stack,
} from "@nexus/shared-ui";
import { registerRequestSchema } from "@nexus/shared-validation";

import { getMobileSession } from "../../api/client/axios";
import type { RootStackParamList } from "../../navigation/types";
import { MOBILE_ROUTE_NAMES } from "../../navigation/types";
import { authSuccess } from "../../store/slices/auth/authSlice";
import type { AppDispatch } from "../../store/createAppStore";
import { AuthBrand } from "./components/AuthBrand";
import { AuthScreenLayout } from "./components/AuthScreenLayout";
import { mapApiError } from "./hooks/useApiErrorMessage";
import { useAuthForm } from "./hooks/useAuthForm";
import type { MappedAuthError } from "./utils/authErrorPresentation";
import {
  announceAuthFeedback,
  announceFirstFieldError,
} from "./utils/announceAuthFeedback";

type RegisterNav = NativeStackNavigationProp<RootStackParamList, "Register">;

type RegisterFormValues = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

/** Coerce empty optional name fields to undefined before schema parse. */
const registerFormSchema = {
  safeParse(value: RegisterFormValues) {
    return registerRequestSchema.safeParse({
      email: value.email,
      password: value.password,
      firstName: value.firstName.trim() || undefined,
      lastName: value.lastName.trim() || undefined,
    });
  },
};

export const RegisterScreen: FC = () => {
  const navigation = useNavigation<RegisterNav>();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<MappedAuthError | undefined>();
  const [success, setSuccess] = useState(false);
  const form = useAuthForm<RegisterFormValues>({
    schema: registerFormSchema as {
      safeParse(value: RegisterFormValues):
        | { success: true; data: RegisterFormValues }
        | {
            success: false;
            error: {
              issues: ReadonlyArray<{
                path: ReadonlyArray<PropertyKey>;
                message: string;
              }>;
            };
          };
    },
    initialValues: { email: "", password: "", firstName: "", lastName: "" },
  });

  useEffect(() => {
    if (apiError) {
      announceAuthFeedback(`${apiError.title}. ${apiError.message}`);
    }
  }, [apiError]);

  const onSubmit = async () => {
    const result = form.validate();
    if (!result.ok) {
      announceFirstFieldError(
        result.errors as Partial<Record<string, string>>,
        ["email", "password", "firstName", "lastName"],
      );
      return;
    }

    setLoading(true);
    setApiError(undefined);

    try {
      const snapshot = await getMobileSession().register({
        email: form.values.email,
        password: form.values.password,
        firstName: form.values.firstName.trim() || undefined,
        lastName: form.values.lastName.trim() || undefined,
      });

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
        setSuccess(true);
        form.reset();
        announceAuthFeedback("Account created");
      }
    } catch (error) {
      setApiError(mapApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout testID="mobile-register-shell" brand={<AuthBrand />}>
      <AuthCard
        testID="register-card"
        title="Create account"
        description="Register to access Nexus AI Workspace."
        headingLevel={2}
        status={
          apiError ? (
            <InlineAlert
              tone="error"
              title={
                apiError.kind === "network"
                  ? "Connection problem"
                  : "Unable to register"
              }
              testID="register-api-error"
            >
              {apiError.message}
            </InlineAlert>
          ) : success ? (
            <InlineAlert
              tone="success"
              title="Account created"
              testID="register-success"
            >
              Check your email if verification is required.
            </InlineAlert>
          ) : undefined
        }
        footer={
          <AuthFooter
            prompt="Already have an account?"
            link={{
              label: "Sign in",
              href: "login",
              accessibilityLabel: "Sign in",
              onPress: () => {
                navigation.navigate(MOBILE_ROUTE_NAMES.Login);
              },
            }}
          />
        }
      >
        {!success ? (
          <Stack gap="md">
            <FormField
              testID="register-firstName"
              label="First name"
              placeholder="Optional"
              value={form.values.firstName}
              onChangeText={(value) => form.setField("firstName", value)}
              disabled={loading}
              autoComplete="name"
              errorText={form.fieldErrors.firstName}
            />
            <FormField
              testID="register-lastName"
              label="Last name"
              placeholder="Optional"
              value={form.values.lastName}
              onChangeText={(value) => form.setField("lastName", value)}
              disabled={loading}
              autoComplete="name"
              errorText={form.fieldErrors.lastName}
            />
            <FormField
              testID="register-email"
              label="Email"
              placeholder="you@example.com"
              value={form.values.email}
              onChangeText={(value) => form.setField("email", value)}
              disabled={loading}
              required
              autoComplete="email"
              inputMode="email"
              errorText={form.fieldErrors.email}
            />
            <FormField
              testID="register-password"
              label="Password"
              placeholder="Create a password"
              value={form.values.password}
              onChangeText={(value) => form.setField("password", value)}
              disabled={loading}
              required
              secureTextEntry
              autoComplete="new-password"
              errorText={form.fieldErrors.password}
            />
            <Button
              testID="register-submit"
              fullWidth
              loading={loading}
              disabled={loading}
              onPress={() => {
                void onSubmit();
              }}
              accessibilityLabel="Create account"
            >
              Create account
            </Button>
          </Stack>
        ) : null}
      </AuthCard>
    </AuthScreenLayout>
  );
};
