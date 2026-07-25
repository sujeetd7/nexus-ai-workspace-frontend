import type { Meta, StoryObj } from "@storybook/react";

import { PasswordField } from "@nexus/shared-ui";

const meta = {
  title: "Composites/PasswordField",
  component: PasswordField,
  tags: ["autodocs"],
  args: {
    accessibilityLabel: "Password",
    placeholder: "Enter password",
  },
} satisfies Meta<typeof PasswordField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Visible: Story = {
  args: {
    defaultVisible: true,
    defaultValue: "secret-value",
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: "short",
    accessibilityHint: "Password is too short",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "locked-password",
  },
};
