import type { Meta, StoryObj } from "@storybook/react";

import { Section, Text } from "@nexus/shared-ui";

const meta = {
  title: "Composites/Section",
  component: Section,
  tags: ["autodocs"],
  args: {
    title: "Details",
    children: <Text>Section body content with consistent spacing.</Text>,
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutTitle: Story = {
  args: {
    title: undefined,
    children: <Text>Untitled section</Text>,
  },
};
