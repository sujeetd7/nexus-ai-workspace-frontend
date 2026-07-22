import type { Meta, StoryObj } from "@storybook/react";

import { Input } from "@nexus/shared-ui";

const meta = {
  title: "Primitives/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    accessibilityLabel: "Email",
    placeholder: "you@example.com",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true, value: "locked" },
};

export const Invalid: Story = {
  args: { invalid: true, value: "bad" },
};

export const Required: Story = {
  args: { required: true },
};

export const Secure: Story = {
  args: {
    accessibilityLabel: "Password",
    secureTextEntry: true,
    placeholder: "••••••••",
  },
};
