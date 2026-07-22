import type { Meta, StoryObj } from "@storybook/react";

import { FormField } from "@nexus/shared-ui";

const meta = {
  title: "Composites/FormField",
  component: FormField,
  tags: ["autodocs"],
  args: {
    label: "Email",
    helperText: "We never share your email.",
    placeholder: "you@example.com",
  },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const Disabled: Story = {
  args: { disabled: true, value: "locked@example.com" },
};

export const ErrorState: Story = {
  args: {
    errorText: "Enter a valid email address",
    value: "not-an-email",
  },
};
