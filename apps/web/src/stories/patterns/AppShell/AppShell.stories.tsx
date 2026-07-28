import type { Meta, StoryObj } from "@storybook/react";

import {
  AppShellComposition,
  type AppShellCompositionState,
} from "./AppShellComposition";

const meta = {
  title: "Patterns/AppShell",
  component: AppShellComposition,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    state: {
      control: "select",
      options: [
        "default",
        "loading",
        "collapsed",
        "empty",
        "unauthorized",
        "error",
      ] satisfies AppShellCompositionState[],
    },
  },
} satisfies Meta<typeof AppShellComposition>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { state: "default" },
};

export const Loading: Story = {
  args: { state: "loading" },
};

export const Collapsed: Story = {
  args: { state: "collapsed" },
};

export const Empty: Story = {
  args: { state: "empty" },
};

export const Unauthorized: Story = {
  args: { state: "unauthorized" },
};

export const Error: Story = {
  args: { state: "error" },
};

export const NarrowMobile: Story = {
  args: { state: "default" },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const Desktop: Story = {
  args: { state: "default" },
  parameters: {
    viewport: { defaultViewport: "desktop" },
  },
};
