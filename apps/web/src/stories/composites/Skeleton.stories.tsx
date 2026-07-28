import type { Meta, StoryObj } from "@storybook/react";

import { Skeleton, Stack, Text } from "@nexus/shared-ui";

const meta = {
  title: "Composites/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  args: {
    variant: "text",
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextBlock: Story = {};

export const Title: Story = {
  args: { variant: "title" },
};

export const AvatarBone: Story = {
  args: { variant: "avatar", avatarSize: "lg" },
};

export const CardBone: Story = {
  args: { variant: "card" },
};

export const LoadingCard: Story = {
  render: () => (
    <Stack gap="md" style={{ width: 280 }}>
      <Stack direction="horizontal" gap="md" align="center">
        <Skeleton variant="avatar" avatarSize="md" />
        <Stack gap="sm" style={{ flex: 1 }}>
          <Skeleton variant="title" />
          <Skeleton variant="text" width="80%" />
        </Stack>
      </Stack>
      <Skeleton variant="rounded" height={96} />
      <Text variant="caption" color="textSecondary">
        Compose skeletons for list/card loading — no shimmer library.
      </Text>
    </Stack>
  ),
};
