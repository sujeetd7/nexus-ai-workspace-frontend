import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Checkbox } from "@nexus/shared-ui";

const meta = {
  title: "Primitives/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: {
    label: "Remember me",
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: "Select all" },
};

export const Controlled: Story = {
  render: function ControlledCheckbox() {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        label={checked ? "Subscribed" : "Subscribe"}
        checked={checked}
        onCheckedChange={setChecked}
      />
    );
  },
};
