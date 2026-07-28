import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Stack, Switch, Text } from "@nexus/shared-ui";

const meta = {
  title: "Composites/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: {
    checked: true,
    accessibilityLabel: "Improve model",
    onCheckedChange: () => {},
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const On: Story = {
  args: { checked: true },
};

export const Off: Story = {
  args: { checked: false },
};

export const Disabled: Story = {
  args: { checked: true, disabled: true },
};

export const Interactive: Story = {
  render: function InteractiveSwitch() {
    const [checked, setChecked] = useState(false);
    return (
      <Stack direction="horizontal" gap="md" align="center">
        <Switch
          checked={checked}
          onCheckedChange={setChecked}
          accessibilityLabel="Notifications"
        />
        <Text>{checked ? "On" : "Off"}</Text>
      </Stack>
    );
  },
};
