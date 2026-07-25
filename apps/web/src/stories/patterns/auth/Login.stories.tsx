import type { Meta, StoryObj } from "@storybook/react";

import {
  LoginComposition,
  type LoginCompositionState,
} from "./LoginComposition";

const meta = {
  title: "Patterns/Auth/Login",
  component: LoginComposition,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    state: {
      control: "select",
      options: [
        "default",
        "submitting",
        "disabled",
        "fieldErrors",
        "apiError",
        "success",
      ] satisfies LoginCompositionState[],
    },
  },
} satisfies Meta<typeof LoginComposition>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { state: "default" },
};

export const Submitting: Story = {
  args: { state: "submitting" },
};

export const Disabled: Story = {
  args: { state: "disabled" },
};

export const FieldValidationErrors: Story = {
  args: { state: "fieldErrors" },
};

export const ApiError: Story = {
  args: { state: "apiError" },
};

export const Success: Story = {
  args: { state: "success" },
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
