import type { Meta, StoryObj } from "@storybook/react";

import { Text } from "@nexus/shared-ui";

const meta = {
  title: "Primitives/Text",
  component: Text,
  tags: ["autodocs"],
  args: {
    children: "The quick brown fox",
    variant: "body",
    color: "text",
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <>
      {(
        ["display", "h1", "h2", "h3", "body", "caption", "label"] as const
      ).map((variant) => (
        <Text key={variant} variant={variant}>
          {variant}
        </Text>
      ))}
    </>
  ),
};

export const SemanticColors: Story = {
  render: () => (
    <>
      {(
        [
          "text",
          "textSecondary",
          "primary",
          "danger",
          "success",
          "warning",
          "info",
        ] as const
      ).map((color) => (
        <Text key={color} color={color}>
          {color}
        </Text>
      ))}
    </>
  ),
};

export const DarkThemeNote: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use the Theme toolbar to verify light/dark rendering.",
      },
    },
  },
  args: {
    children: "Switch theme via toolbar",
    variant: "h3",
  },
};
