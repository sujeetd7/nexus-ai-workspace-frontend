import type { Meta, StoryObj } from "@storybook/react";

import {
  WorkspaceSelectionComposition,
  type WorkspaceSelectionState,
} from "./WorkspaceSelectionComposition";

const meta = {
  title: "Patterns/Workspace/WorkspaceSelection",
  component: WorkspaceSelectionComposition,
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
        "empty",
        "multiple",
        "single",
        "selected",
        "unauthorized",
        "forbidden",
        "retry",
        "apiError",
      ] satisfies WorkspaceSelectionState[],
    },
  },
} satisfies Meta<typeof WorkspaceSelectionComposition>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { state: "default" },
};

export const Loading: Story = {
  args: { state: "loading" },
};

export const Empty: Story = {
  args: { state: "empty" },
};

export const MultipleWorkspaces: Story = {
  args: { state: "multiple" },
};

export const SingleWorkspace: Story = {
  args: { state: "single" },
};

export const Selected: Story = {
  args: { state: "selected" },
};

export const Unauthorized: Story = {
  args: { state: "unauthorized" },
};

export const Forbidden: Story = {
  args: { state: "forbidden" },
};

export const Retry: Story = {
  args: { state: "retry" },
};

export const ApiError: Story = {
  args: { state: "apiError" },
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
