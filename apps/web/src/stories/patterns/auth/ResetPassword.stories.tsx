import type { Meta, StoryObj } from "@storybook/react";

import {
  ResetPasswordComposition,
  type ResetPasswordCompositionState,
} from "./ResetPasswordComposition";

const meta = {
  title: "Patterns/Auth/ResetPassword",
  component: ResetPasswordComposition,
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
        "invalidToken",
        "expiredToken",
        "success",
      ] satisfies ResetPasswordCompositionState[],
    },
  },
} satisfies Meta<typeof ResetPasswordComposition>;

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

export const ApiError: Story = {
  args: { state: "apiError" },
};

export const InvalidToken: Story = {
  args: { state: "invalidToken" },
};

export const ExpiredToken: Story = {
  args: { state: "expiredToken" },
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
