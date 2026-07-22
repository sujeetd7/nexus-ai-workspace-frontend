import type { Meta, StoryObj } from "@storybook/react";

import { ErrorText } from "@nexus/shared-ui";

const meta = {
  title: "Composites/ErrorText",
  component: ErrorText,
  tags: ["autodocs"],
  args: {
    children: "This field is required",
  },
} satisfies Meta<typeof ErrorText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AccessibilityAlert: Story = {
  name: "Alert role",
  args: {
    children: "Announced as an alert to assistive tech",
  },
};
