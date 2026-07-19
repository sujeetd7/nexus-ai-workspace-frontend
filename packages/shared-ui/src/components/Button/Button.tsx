import type { FC } from "react";

import type { ButtonProps } from "./Button.types";

export const Button: FC<ButtonProps> = ({ label }) => {
  return <button>{label}</button>;
};
