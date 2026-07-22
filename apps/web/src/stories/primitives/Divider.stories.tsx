import type { Meta, StoryObj } from "@storybook/react";

import { Divider, Stack, Text } from "@nexus/shared-ui";

const meta = {
  title: "Primitives/Divider",
  component: Divider,
  tags: ["autodocs"],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Vertical: Story = {
  render: () => (
    <Stack direction="horizontal" gap="md" align="center">
      <Text>Left</Text>
      <Divider orientation="vertical" />
      <Text>Right</Text>
    </Stack>
  ),
};

export const InContent: Story = {
  render: () => (
    <Stack gap="md">
      <Text>Section A</Text>
      <Divider />
      <Text>Section B</Text>
    </Stack>
  ),
};
