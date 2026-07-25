import type { Meta, StoryObj } from "@storybook/react";

import { AuthFooter, AuthHeader, Stack } from "@nexus/shared-ui";

const meta = {
  title: "Patterns/AuthHeaderFooter",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const HeaderAndFooter: Story = {
  render: () => (
    <Stack direction="vertical" gap="xl">
      <AuthHeader
        title="Welcome back"
        description="Sign in with your work email."
      />
      <AuthFooter
        prompt="Don't have an account?"
        link={{ label: "Sign up", href: "#sign-up" }}
        secondaryLinks={[
          { label: "Forgot password?", href: "#forgot" },
          { label: "Back to sign in", href: "#sign-in" },
        ]}
      />
    </Stack>
  ),
};
