import type { Meta, StoryObj } from "@storybook/react";

import { Button, InlineAlert, Link, Stack } from "@nexus/shared-ui";

const meta = {
  title: "Composites/InlineAlert",
  component: InlineAlert,
  tags: ["autodocs"],
  args: {
    title: "Heads up",
    children: "Inline status for forms and page feedback — not a Toast.",
    tone: "info",
  },
} satisfies Meta<typeof InlineAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Success: Story = {
  args: {
    tone: "success",
    title: "Email sent",
    children: "Check your inbox for a reset link.",
  },
};

export const Warning: Story = {
  args: {
    tone: "warning",
    title: "Link expiring",
    children: "This reset link expires in 15 minutes.",
  },
};

export const ErrorState: Story = {
  args: {
    tone: "error",
    title: "Unable to sign in",
    children: "Invalid email or password.",
  },
};

export const WithAction: Story = {
  args: {
    tone: "info",
    title: "Verify your email",
    children: "We sent a confirmation link.",
    action: (
      <Link href="#resend" onPress={() => undefined}>
        Resend email
      </Link>
    ),
  },
};

export const Tones: Story = {
  render: () => (
    <Stack direction="vertical" gap="md">
      <InlineAlert tone="info" title="Info">
        Informational message.
      </InlineAlert>
      <InlineAlert tone="success" title="Success">
        Operation completed.
      </InlineAlert>
      <InlineAlert tone="warning" title="Warning">
        Proceed with caution.
      </InlineAlert>
      <InlineAlert tone="error" title="Error">
        Something went wrong.
      </InlineAlert>
      <Button variant="secondary" onPress={() => undefined}>
        Focusable neighbor
      </Button>
    </Stack>
  ),
};
