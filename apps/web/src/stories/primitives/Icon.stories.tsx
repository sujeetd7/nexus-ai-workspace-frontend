import type { Meta, StoryObj } from "@storybook/react";

import { Icon, Text } from "@nexus/shared-ui";

const meta = {
  title: "Primitives/Icon",
  component: Icon,
  tags: ["autodocs"],
  args: {
    children: (
      <Text variant="label" color="primary">
        *
      </Text>
    ),
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Decorative: Story = {
  args: {
    decorative: true,
    size: "md",
    color: "primary",
  },
};

export const Meaningful: Story = {
  args: {
    decorative: false,
    accessibilityLabel: "Favorite",
    size: "lg",
    color: "danger",
    children: (
      <Text variant="body" color="danger">
        !
      </Text>
    ),
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Icon {...args} size="sm" decorative>
        <Text variant="caption">A</Text>
      </Icon>
      <Icon {...args} size="md" decorative>
        <Text variant="label">A</Text>
      </Icon>
      <Icon {...args} size="lg" decorative>
        <Text variant="body">A</Text>
      </Icon>
    </div>
  ),
};
