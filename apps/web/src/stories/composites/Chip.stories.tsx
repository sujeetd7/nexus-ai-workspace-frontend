import type { Meta, StoryObj } from "@storybook/react";

import { Chip, Stack } from "@nexus/shared-ui";

const meta = {
  title: "Composites/Chip",
  component: Chip,
  tags: ["autodocs"],
  args: {
    children: "Filter",
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: { selected: true, children: "Selected" },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Disabled" },
};

export const States: Story = {
  render: () => (
    <Stack direction="horizontal" gap="sm" wrap>
      <Chip>Unselected</Chip>
      <Chip selected>Selected</Chip>
      <Chip disabled>Disabled</Chip>
    </Stack>
  ),
};
