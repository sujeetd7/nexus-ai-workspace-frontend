import type { Meta, StoryObj } from "@storybook/react";

import { Input, Label, Stack } from "@nexus/shared-ui";

const meta = {
  title: "Primitives/Label",
  component: Label,
  tags: ["autodocs"],
  args: {
    children: "Email address",
    htmlFor: "email-demo",
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithInput: Story = {
  name: "Accessibility pairing",
  render: () => (
    <Stack gap="sm">
      <Label htmlFor="email-demo" required>
        Email address
      </Label>
      <Input
        id="email-demo"
        accessibilityLabel="Email address"
        placeholder="you@example.com"
      />
    </Stack>
  ),
};
