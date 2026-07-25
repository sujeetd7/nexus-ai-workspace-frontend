import type { Meta, StoryObj } from "@storybook/react";

import {
  ForgotPasswordComposition,
  type ForgotPasswordCompositionState,
} from "./ForgotPasswordComposition";

const meta = {
  title: "Patterns/Auth/ForgotPassword",
  component: ForgotPasswordComposition,
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
      ] satisfies ForgotPasswordCompositionState[],
    },
  },
} satisfies Meta<typeof ForgotPasswordComposition>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { state: "default" },
};

export const Submitting: Story = {
  args: { state: "submitting" },
};

export const FieldValidationErrors: Story = {
  args: { state: "fieldErrors" },
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
