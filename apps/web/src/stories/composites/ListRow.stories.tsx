import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  Avatar,
  Badge,
  Icon,
  ListRow,
  Stack,
  Switch,
  Text,
} from "@nexus/shared-ui";

const meta = {
  title: "Composites/ListRow",
  component: ListRow,
  tags: ["autodocs"],
  args: {
    title: "Acme Workspace",
    subtitle: "Owner",
  },
} satisfies Meta<typeof ListRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AvatarLeading: Story = {
  args: {
    title: "Ada Byron",
    subtitle: "Member",
    leading: <Avatar initials="ab" alt="Ada Byron" />,
  },
};

export const IconLeading: Story = {
  args: {
    title: "Documents",
    subtitle: "12 files",
    leading: (
      <Icon decorative size="md" color="primary">
        <Text variant="label" color="primary" weight="bold">
          D
        </Text>
      </Icon>
    ),
  },
};

export const WithBadge: Story = {
  args: {
    title: "Prompt library",
    trailing: <Badge variant="info">Beta</Badge>,
  },
};

export const WithChevron: Story = {
  args: {
    title: "Open details",
    trailing: (
      <Text variant="caption" color="textSecondary">
        ›
      </Text>
    ),
    onPress: () => {},
  },
};

export const WithSwitch: Story = {
  render: function SwitchRow() {
    const [checked, setChecked] = useState(true);
    return (
      <ListRow
        title="Improve model"
        subtitle="Allow workspace tuning"
        trailing={
          <Switch
            checked={checked}
            onCheckedChange={setChecked}
            accessibilityLabel="Improve model"
          />
        }
      />
    );
  },
};

export const Selected: Story = {
  args: {
    title: "Selected workspace",
    subtitle: "Active",
    selected: true,
    leading: <Avatar initials="nx" alt="Nexus" />,
    trailing: <Badge variant="success">Active</Badge>,
    onPress: () => {},
  },
};

export const Gallery: Story = {
  render: () => (
    <Stack direction="vertical" gap="sm">
      <ListRow
        title="Workspace A"
        subtitle="Owner"
        leading={<Avatar initials="wa" alt="Workspace A" />}
        selected
        onPress={() => {}}
      />
      <ListRow
        title="Workspace B"
        subtitle="Member"
        leading={<Avatar initials="wb" alt="Workspace B" />}
        onPress={() => {}}
      />
    </Stack>
  ),
};
