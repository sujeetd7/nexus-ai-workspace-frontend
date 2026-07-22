import type { Meta, StoryObj } from "@storybook/react";

import { HelperText } from "@nexus/shared-ui";

const meta = {
  title: "Composites/HelperText",
  component: HelperText,
  tags: ["autodocs"],
  args: {
    children: "Helper guidance for the field",
  },
} satisfies Meta<typeof HelperText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
