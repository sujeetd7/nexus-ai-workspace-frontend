import type { Meta, StoryObj } from "@storybook/react";

import { Badge, Stack } from "@nexus/shared-ui";

const meta = {
  title: "Composites/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    children: "Badge",
    variant: "neutral",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "info",
    size: "md",
    accessibilityLabel: "Hello\n"
  }
};

export const Variants: Story = {
  render: () => (
    <Stack direction="horizontal" gap="sm" wrap>
      {(
        [
          "neutral",
          "primary",
          "secondary",
          "success",
          "warning",
          "danger",
          "info",
        ] as const
      ).map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stack direction="horizontal" gap="sm" align="center">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
    </Stack>
  ),
};
