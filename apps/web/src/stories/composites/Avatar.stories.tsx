import type { Meta, StoryObj } from "@storybook/react";

import { Avatar, Stack, Text } from "@nexus/shared-ui";

const meta = {
  title: "Composites/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  args: {
    initials: "NX",
    alt: "Nexus user",
    size: "md",
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {};

export const Sizes: Story = {
  render: () => (
    <Stack direction="horizontal" gap="md" align="center">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} size={size} initials="NX" alt={`Size ${size}`} />
      ))}
    </Stack>
  ),
};

export const IconFallback: Story = {
  args: {
    initials: undefined,
    icon: <Text weight="bold">N</Text>,
    alt: "Nexus",
  },
};

export const Decorative: Story = {
  args: {
    decorative: true,
    alt: undefined,
    initials: "AB",
  },
};
