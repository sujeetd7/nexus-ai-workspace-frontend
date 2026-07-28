import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Badge, SettingsRow, Stack } from "@nexus/shared-ui";

const meta = {
  title: "Composites/SettingsRow",
  component: SettingsRow,
  tags: ["autodocs"],
  args: {
    title: "Notifications",
  },
} satisfies Meta<typeof SettingsRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithSwitch: Story = {
  render: function SwitchSetting() {
    const [checked, setChecked] = useState(true);
    return (
      <SettingsRow
        title="Email notifications"
        subtitle="Product updates"
        switchChecked={checked}
        onSwitchCheckedChange={setChecked}
        switchAccessibilityLabel="Email notifications"
      />
    );
  },
};

export const WithBadge: Story = {
  args: {
    title: "Plan",
    subtitle: "Billing",
    badge: <Badge variant="primary">Pro</Badge>,
  },
};

export const WithValue: Story = {
  args: {
    title: "Language",
    value: "English",
    showChevron: true,
    onPress: () => {},
  },
};

export const WithChevron: Story = {
  args: {
    title: "Privacy",
    subtitle: "Data & permissions",
    showChevron: true,
    onPress: () => {},
  },
};

export const Gallery: Story = {
  render: function GallerySettings() {
    const [checked, setChecked] = useState(false);
    return (
      <Stack direction="vertical" gap="sm">
        <SettingsRow
          title="Push notifications"
          switchChecked={checked}
          onSwitchCheckedChange={setChecked}
          switchAccessibilityLabel="Push notifications"
        />
        <SettingsRow title="Theme" value="System" showChevron onPress={() => {}} />
        <SettingsRow
          title="Workspace"
          badge={<Badge>Admin</Badge>}
          showChevron
          onPress={() => {}}
        />
      </Stack>
    );
  },
};
