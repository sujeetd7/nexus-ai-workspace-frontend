import type { Meta, StoryObj } from "@storybook/react";

import { Button, EmptyState, Icon, Text, View } from "@nexus/shared-ui";

const meta = {
  title: "Composites/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  args: {
    title: "Nothing here yet",
    description: "When items appear, they will show up in this list.",
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithIcon: Story = {
  args: {
    icon: (
      <Icon decorative size="lg" color="textSecondary">
        <Text variant="h2" color="textSecondary">
          ○
        </Text>
      </Icon>
    ),
  },
};

export const WithIllustration: Story = {
  args: {
    illustration: (
      <View
        background="surfaceMuted"
        borderRadius="lg"
        padding="xl"
        style={{ minWidth: 160, alignItems: "center" }}
      >
        <Text variant="caption" color="textSecondary">
          Illustration slot
        </Text>
      </View>
    ),
  },
};

export const PrimaryCta: Story = {
  args: {
    icon: (
      <Icon decorative size="lg" color="primary">
        <Text variant="h2" color="primary">
          +
        </Text>
      </Icon>
    ),
    title: "Create your first item",
    description: "Primary action slot — consumer supplies the Button.",
    primaryAction: <Button>Create</Button>,
  },
};

export const SecondaryCta: Story = {
  args: {
    title: "No matches",
    description: "Try adjusting filters or start a new search.",
    primaryAction: <Button>Clear filters</Button>,
    secondaryAction: <Button variant="ghost">Learn more</Button>,
  },
};
