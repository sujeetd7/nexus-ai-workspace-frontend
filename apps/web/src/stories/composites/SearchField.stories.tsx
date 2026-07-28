import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { SearchField, Stack } from "@nexus/shared-ui";

const meta = {
  title: "Composites/SearchField",
  component: SearchField,
  tags: ["autodocs"],
  args: {
    value: "",
    placeholder: "Search…",
    accessibilityLabel: "Search",
    onChangeText: () => {},
  },
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function DefaultSearch() {
    const [value, setValue] = useState("");
    return (
      <SearchField
        value={value}
        onChangeText={setValue}
        placeholder="Search workspaces"
        accessibilityLabel="Search workspaces"
      />
    );
  },
};

export const Loading: Story = {
  args: {
    value: "nexus",
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    value: "locked query",
    disabled: true,
  },
};

export const Clear: Story = {
  render: function ClearSearch() {
    const [value, setValue] = useState("clearable query");
    return (
      <Stack direction="vertical" gap="md">
        <SearchField
          value={value}
          onChangeText={setValue}
          placeholder="Search members"
          accessibilityLabel="Search members"
        />
      </Stack>
    );
  },
};
