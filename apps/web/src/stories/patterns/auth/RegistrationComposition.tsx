import { useState, type FC } from "react";

import {
  AuthCard,
  AuthFooter,
  AuthShell,
  Button,
  FormField,
  InlineAlert,
  Text,
} from "@nexus/shared-ui";

export type RegistrationCompositionState =
  | "default"
  | "submitting"
  | "disabled"
  | "fieldErrors"
  | "apiError"
  | "success";

export interface RegistrationCompositionProps {
  state?: RegistrationCompositionState;
}

/**
 * Storybook-only registration composition — mirrors backend RegisterRequest
 * (email, password, optional firstName/lastName). No invented terms/confirm fields.
 */
export const RegistrationComposition: FC<RegistrationCompositionProps> = ({
  state = "default",
}) => {
  const [firstName, setFirstName] = useState("Alex");
  const [lastName, setLastName] = useState("Rivera");
  const [email, setEmail] = useState(
    state === "fieldErrors" ? "bad" : "alex@example.com",
  );
  const [password, setPassword] = useState(
    state === "fieldErrors" ? "123" : "password123",
  );

  const disabled = state === "disabled" || state === "submitting";
  const submitting = state === "submitting";
  const fieldErrors = state === "fieldErrors";
  const apiError = state === "apiError";
  const success = state === "success";

  return (
    <AuthShell
      testID="register-shell"
      brand={
        <Text variant="h2" align="center" weight="bold">
          Nexus AI Workspace
        </Text>
      }
    >
      <AuthCard
        testID="register-card"
        title="Create account"
        description="Register to access Nexus AI Workspace."
        headingLevel={2}
        status={
          apiError ? (
            <InlineAlert tone="error" title="Unable to register">
              An account with this email already exists.
            </InlineAlert>
          ) : success ? (
            <InlineAlert tone="success" title="Account created">
              Check your email to verify your address.
            </InlineAlert>
          ) : undefined
        }
        footer={
          <AuthFooter
            prompt="Already have an account?"
            link={{ label: "Sign in", href: "#sign-in" }}
          />
        }
      >
        {!success ? (
          <>
            <FormField
              label="First name"
              placeholder="Optional"
              value={firstName}
              onChangeText={setFirstName}
              disabled={disabled}
              autoComplete="given-name"
            />
            <FormField
              label="Last name"
              placeholder="Optional"
              value={lastName}
              onChangeText={setLastName}
              disabled={disabled}
              autoComplete="family-name"
            />
            <FormField
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
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              disabled={disabled}
              required
              secureTextEntry
              autoComplete="new-password"
              errorText={
                fieldErrors
                  ? "Password must be at least 8 characters"
                  : undefined
              }
            />
            <Button
              fullWidth
              type="submit"
              loading={submitting}
              disabled={disabled && !submitting}
              onPress={() => undefined}
            >
              Create account
            </Button>
          </>
        ) : null}
      </AuthCard>
    </AuthShell>
  );
};
