import { ReactNode } from "react";

export interface BaseProps {
  testID?: string;

  className?: string;

  children?: React.ReactNode;
}
export interface ChildrenProps {
  children?: ReactNode;
}
