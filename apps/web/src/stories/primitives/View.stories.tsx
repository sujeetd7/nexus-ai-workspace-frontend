import type { Meta, StoryObj } from "@storybook/react";

import { View } from "@nexus/shared-ui";

const meta = {
  title: "Primitives/View",
  component: View,
  tags: ["autodocs"],
  args: {
    background: "surface",
    padding: "lg",
    borderRadius: "md",
    children: "View container",
  },
} satisfies Meta<typeof View>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Backgrounds: Story = {
  render: () => (
    <View style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <View background="background" padding="md" testID="bg">
        background
      </View>
      <View background="surface" padding="md" testID="surface">
        surface
      </View>
      <View background="transparent" padding="md" testID="transparent">
        transparent
      </View>
    </View>
  ),
};

export const Accessibility: Story = {
  args: {
    accessibilityLabel: "Content region",
    accessibilityRole: "text",
    children: "Labeled view",
  },
};
