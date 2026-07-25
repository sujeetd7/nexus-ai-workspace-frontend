import type { Meta, StoryObj } from "@storybook/react";

import {
  RegistrationComposition,
  type RegistrationCompositionState,
} from "./RegistrationComposition";

const meta = {
  title: "Patterns/Auth/Registration",
  component: RegistrationComposition,
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
      ] satisfies RegistrationCompositionState[],
    },
  },
} satisfies Meta<typeof RegistrationComposition>;

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

export const Success: Story = {
  args: { state: "success" },
};

export const NarrowMobile: Story = {
  args: { state: "default" },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
