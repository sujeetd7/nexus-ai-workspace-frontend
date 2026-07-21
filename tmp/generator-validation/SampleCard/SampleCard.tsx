import type { FC, ReactNode } from "react";

export interface SampleCardProps {
  children?: ReactNode;
}

export const SampleCard: FC<SampleCardProps> = ({ children }) => {
  return <div data-testid="SampleCard">{children}</div>;
};
