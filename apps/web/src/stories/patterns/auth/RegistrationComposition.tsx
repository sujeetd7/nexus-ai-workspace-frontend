import { useState, type FC } from "react";

import {
  AuthCard,
  AuthFooter,
  AuthShell,
  Button,
  Checkbox,
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
 * Storybook-only registration composition — mock local state, no API or routes.
 */
export const RegistrationComposition: FC<RegistrationCompositionProps> = ({
  state = "default",
}) => {
  const [name, setName] = useState(state === "fieldErrors" ? "" : "Alex Rivera");
  const [email, setEmail] = useState(
    state === "fieldErrors" ? "bad" : "alex@example.com",
  );
  const [password, setPassword] = useState(
    state === "fieldErrors" ? "123" : "password123",
  );
  const [confirm, setConfirm] = useState(
    state === "fieldErrors" ? "456" : "password123",
  );
  const [terms, setTerms] = useState(state !== "fieldErrors");

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
          Nexus
        </Text>
      }
    >
      <AuthCard
        testID="register-card"
        title="Create account"
        description="Set up your Nexus workspace credentials."
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
        <FormField
          label="Name"
          placeholder="Your full name"
          value={name}
          onChangeText={setName}
          disabled={disabled}
          required
          autoComplete="name"
          errorText={fieldErrors ? "Name is required" : undefined}
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
          errorText={fieldErrors ? "Enter a valid email address" : undefined}
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
            fieldErrors ? "Password must be at least 8 characters" : undefined
          }
        />
        <FormField
          label="Confirm password"
          placeholder="Re-enter your password"
          value={confirm}
          onChangeText={setConfirm}
          disabled={disabled}
          required
          secureTextEntry
          autoComplete="new-password"
          errorText={fieldErrors ? "Passwords do not match" : undefined}
        />
        <Checkbox
          label="I agree to the Terms of Service"
          checked={terms}
          disabled={disabled}
          onCheckedChange={setTerms}
        />
        {fieldErrors && !terms ? (
          <InlineAlert tone="error">You must accept the terms.</InlineAlert>
        ) : null}
        <Button
          fullWidth
          type="submit"
          loading={submitting}
          disabled={disabled && !submitting}
          onPress={() => undefined}
        >
          Create account
        </Button>
      </AuthCard>
    </AuthShell>
  );
};
