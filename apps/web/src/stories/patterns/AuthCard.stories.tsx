import type { Meta, StoryObj } from "@storybook/react";

import {
  AuthCard,
  AuthFooter,
  AuthShell,
  Button,
  FormField,
  InlineAlert,
  Text,
} from "@nexus/shared-ui";

const meta = {
  title: "Patterns/AuthCard",
  component: AuthCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AuthCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Sign in",
  },
  render: () => (
    <AuthShell
      brand={
        <Text variant="h2" align="center" weight="bold">
          Nexus{" "}
        </Text>
      }
    >
      <AuthCard
        title="Sign in"
        description="Enter your credentials to continue."
        footer={
          <AuthFooter
            prompt="New here?"
            link={{ label: "Create an account", href: "#register" }}
          />
        }
      >
        {" "}
        <FormField label="Email" placeholder="you@example.com" />{" "}
        <Button fullWidth>Continue</Button>{" "}
      </AuthCard>{" "}
    </AuthShell>
  ),
};

export const WithStatus: Story = {
  args: {
    title: "Sign in",
  },
  render: () => (
    <AuthShell
      brand={
        <Text variant="h2" align="center" weight="bold">
          Nexus{" "}
        </Text>
      }
    >
      <AuthCard
        title="Sign in"
        status={
          <InlineAlert tone="error" title="Unable to sign in">
            Invalid email or password.{" "}
          </InlineAlert>
        }
        footer={
          <AuthFooter
            prompt="New here?"
            link={{ label: "Create an account", href: "#register" }}
          />
        }
      >
        {" "}
        <FormField label="Email" placeholder="you@example.com" />{" "}
        <Button fullWidth>Continue</Button>{" "}
      </AuthCard>{" "}
    </AuthShell>
  ),
};
