import type { Meta, StoryObj } from "@storybook/react";

import { Loader, Stack, Text } from "@nexus/shared-ui";

const meta = {
  title: "Primitives/Loader",
  component: Loader,
  tags: ["autodocs"],
  args: {
    accessibilityLabel: "Loading",
  },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <Stack direction="horizontal" gap="lg" align="center">
      <Loader size="sm" accessibilityLabel="Small" />
      <Loader size="md" accessibilityLabel="Medium" />
      <Loader size="lg" accessibilityLabel="Large" />
    </Stack>
  ),
};

export const ReducedMotionNote: Story = {
  name: "Reduced motion",
  render: () => (
    <Stack gap="sm">
      <Text variant="caption" color="textSecondary">
        Enable OS “prefers-reduced-motion” to see the static labeled fallback.
      </Text>
      <Loader accessibilityLabel="Loading content" />
    </Stack>
  ),
};
