import type { Meta, StoryObj } from "@storybook/react";

import { Link } from "@nexus/shared-ui";

const meta = {
  title: "Primitives/Link",
  component: Link,
  tags: ["autodocs"],
  args: {
    children: "Forgot password?",
    href: "/forgot-password",
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Link {...args} variant="default" href="/default">
        Default link
      </Link>
      <Link {...args} variant="subtle" href="/subtle">
        Subtle link
      </Link>
      <Link {...args} variant="destructive" href="/destructive">
        Destructive link
      </Link>
    </div>
  ),
};

export const External: Story = {
  args: {
    children: "External docs",
    href: "https://example.com",
    external: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Unavailable link",
  },
};
