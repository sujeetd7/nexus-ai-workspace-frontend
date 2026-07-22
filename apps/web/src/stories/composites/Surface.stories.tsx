import type { Meta, StoryObj } from "@storybook/react";

import { Stack, Surface, Text } from "@nexus/shared-ui";

const meta = {
  title: "Composites/Surface",
  component: Surface,
  tags: ["autodocs"],
  args: {
    elevation: "sm",
    padding: "lg",
    children: <Text>Elevated surface</Text>,
  },
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Elevations: Story = {
  render: () => (
    <Stack gap="md">
      {(["none", "xs", "sm", "md", "lg", "xl"] as const).map((elevation) => (
        <Surface key={elevation} elevation={elevation} padding="md">
          <Text>elevation={elevation}</Text>
        </Surface>
      ))}
    </Stack>
  ),
};
