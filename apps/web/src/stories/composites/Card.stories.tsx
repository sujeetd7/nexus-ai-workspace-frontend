import type { Meta, StoryObj } from "@storybook/react";

import { Card, Text } from "@nexus/shared-ui";

const meta = {
  title: "Composites/Card",
  component: Card,
  tags: ["autodocs"],
  args: {
    header: <Text variant="h3">Card title</Text>,
    children: <Text>Body content for the card.</Text>,
    footer: <Text variant="caption">Footer</Text>,
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BodyOnly: Story = {
  args: {
    header: undefined,
    footer: undefined,
    children: <Text>Body only</Text>,
  },
};

export const Elevated: Story = {
  args: {
    elevation: "md",
  },
};
