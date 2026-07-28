import type { Meta, StoryObj } from "@storybook/react";

import {
  VerifyEmailComposition,
  type VerifyEmailCompositionState,
} from "./VerifyEmailComposition";

const meta = {
  title: "Patterns/Auth/VerifyEmail",
  component: VerifyEmailComposition,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    state: {
      control: "select",
      options: [
        "loading",
        "success",
        "apiError",
        "invalidToken",
        "expiredToken",
      ] satisfies VerifyEmailCompositionState[],
    },
  },
} satisfies Meta<typeof VerifyEmailComposition>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: { state: "loading" },
};

export const Success: Story = {
  args: { state: "success" },
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
