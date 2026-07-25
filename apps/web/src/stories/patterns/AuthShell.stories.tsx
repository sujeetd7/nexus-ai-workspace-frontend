import type { Meta, StoryObj } from "@storybook/react";

import { AuthShell, Text } from "@nexus/shared-ui";

const meta = {
  title: "Patterns/AuthShell",
  component: AuthShell,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AuthShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    brand: (
      <Text variant="h2" align="center" weight="bold">
        Nexus
      </Text>
    ),
    children: (
      <Text align="center" color="textSecondary">
        Centered auth content width
      </Text>
    ),
    supporting: (
      <Text variant="caption" align="center" color="textSecondary">
        Supporting content slot
      </Text>
    ),
  },
};

export const NarrowMobile: Story = {
  ...Default,
  parameters: {
    ...Default.parameters,
    viewport: { defaultViewport: "mobile1" },
  },
};

export const Desktop: Story = {
  ...Default,
  parameters: {
    ...Default.parameters,
    viewport: { defaultViewport: "desktop" },
  },
};
