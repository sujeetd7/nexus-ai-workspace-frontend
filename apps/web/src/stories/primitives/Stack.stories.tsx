import type { Meta, StoryObj } from "@storybook/react";

import { Stack, Text, XStack, YStack } from "@nexus/shared-ui";

const meta = {
  title: "Primitives/Stack",
  component: Stack,
  tags: ["autodocs"],
  args: {
    gap: "md",
    direction: "vertical",
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Stack {...args}>
      <Text>One</Text>
      <Text>Two</Text>
      <Text>Three</Text>
    </Stack>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <XStack gap="lg">
      <Text>A</Text>
      <Text>B</Text>
      <Text>C</Text>
    </XStack>
  ),
};

export const VerticalAlias: Story = {
  render: () => (
    <YStack gap="sm">
      <Text>Top</Text>
      <Text>Bottom</Text>
    </YStack>
  ),
};

export const ResponsiveGap: Story = {
  name: "Responsive (media gap)",
  render: () => (
    <Stack
      gap="sm"
      media={{
        md: { gap: "lg" },
        lg: { gap: "xl", direction: "horizontal" },
      }}
    >
      <Text>Resize viewport to see gap / direction overrides</Text>
      <Text>Item 2</Text>
      <Text>Item 3</Text>
    </Stack>
  ),
};
