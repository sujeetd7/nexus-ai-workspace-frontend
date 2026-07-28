import { useState, type FC } from "react";

import {
  AuthCard,
  AuthFooter,
  AuthShell,
  Button,
  FormField,
  InlineAlert,
  Link,
  Stack,
  Text,
} from "@nexus/shared-ui";

export type LoginCompositionState =
  | "default"
  | "submitting"
  | "disabled"
  | "fieldErrors"
  | "apiError"
  | "networkError"
  | "success";

export interface LoginCompositionProps {
  state?: LoginCompositionState;
}

/**
 * Storybook-only login composition — mock local state, no API or routes.
 * Remember-me omitted — LoginRequest has no remember field.
 */
export const LoginComposition: FC<LoginCompositionProps> = ({
  state = "default",
}) => {
  const [email, setEmail] = useState(
    state === "fieldErrors" ? "not-an-email" : "you@example.com",
  );
  const [password, setPassword] = useState(
    state === "fieldErrors" ? "short" : "password123",
  );

  const disabled = state === "disabled" || state === "submitting";
  const submitting = state === "submitting";
  const fieldErrors = state === "fieldErrors";
  const apiError = state === "apiError";
  const networkError = state === "networkError";
  const success = state === "success";

  return (
    <AuthShell
      testID="login-shell"
      brand={
        <Text variant="h2" align="center" weight="bold">
          Nexus AI Workspace
        </Text>
      }
    >
      <AuthCard
        testID="login-card"
        title="Sign in"
        description="Enter your email and password to continue."
        headingLevel={2}
        status={
          apiError ? (
            <InlineAlert
              tone="error"
              title="Unable to sign in"
              testID="login-api-error"
            >
              Invalid email or password. Please try again.
            </InlineAlert>
          ) : networkError ? (
            <InlineAlert
              tone="error"
              title="Connection problem"
              testID="login-api-error"
            >
              Unable to reach the server. Check your connection and try again.
            </InlineAlert>
          ) : success ? (
            <InlineAlert
              tone="success"
              title="Signed in"
              testID="login-success"
            >
              Redirecting to your workspace…
            </InlineAlert>
          ) : undefined
        }
        footer={
          <AuthFooter
            prompt="Don't have an account?"
            link={{ label: "Sign up", href: "#register" }}
          />
        }
      >
        <FormField
          testID="login-email"
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          disabled={disabled}
          required
          autoComplete="email"
          inputMode="email"
          errorText={
            fieldErrors ? "Enter a valid email address" : undefined
          }
        />
        <FormField
          testID="login-password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          disabled={disabled}
          required
          secureTextEntry
          autoComplete="current-password"
          errorText={
            fieldErrors ? "Password must be at least 8 characters" : undefined
          }
        />
        <Stack direction="horizontal" justify="end">
          <Link href="#forgot-password">Forgot password?</Link>
        </Stack>
        <Button
          testID="login-submit"
          fullWidth
          type="submit"
          loading={submitting}
          disabled={disabled && !submitting}
          onPress={() => undefined}
        >
          Sign in
        </Button>
      </AuthCard>
    </AuthShell>
  );
};
