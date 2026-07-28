import type { Meta, StoryObj } from "@storybook/react";

import { IconButton, Stack, Text } from "@nexus/shared-ui";

const meta = {
  title: "Composites/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: {
    accessibilityLabel: "More options",
    children: <Text>•</Text>,
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Stack direction="horizontal" gap="sm" align="center">
      <IconButton {...args} variant="primary" accessibilityLabel="Primary">
        <Text>+</Text>
      </IconButton>
      <IconButton {...args} variant="secondary" accessibilityLabel="Secondary">
        <Text>+</Text>
      </IconButton>
      <IconButton {...args} variant="ghost" accessibilityLabel="Ghost">
        <Text>+</Text>
      </IconButton>
      <IconButton
        {...args}
        variant="destructive"
        accessibilityLabel="Destructive"
      >
        <Text>×</Text>
      </IconButton>
    </Stack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="horizontal" gap="sm" align="center">
      <IconButton {...args} size="sm" accessibilityLabel="Small">
        <Text>•</Text>
      </IconButton>
      <IconButton {...args} size="md" accessibilityLabel="Medium">
        <Text>•</Text>
      </IconButton>
      <IconButton {...args} size="lg" accessibilityLabel="Large">
        <Text>•</Text>
      </IconButton>
    </Stack>
  ),
};

export const Shapes: Story = {
  render: (args) => (
    <Stack direction="horizontal" gap="sm" align="center">
      <IconButton {...args} shape="default" accessibilityLabel="Default">
        <Text>•</Text>
      </IconButton>
      <IconButton {...args} shape="pill" accessibilityLabel="Pill">
        <Text>•</Text>
      </IconButton>
      <IconButton {...args} shape="circle" accessibilityLabel="Circle">
        <Text>•</Text>
      </IconButton>
    </Stack>
  ),
};

export const Loading: Story = {
  args: { loading: true, accessibilityLabel: "Saving" },
};

export const Disabled: Story = {
  args: { disabled: true, accessibilityLabel: "Unavailable" },
};
