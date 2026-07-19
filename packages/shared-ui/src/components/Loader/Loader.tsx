import type { FC } from "react";

import type { LoaderProps } from "./Loader.types";

export const Loader: FC<LoaderProps> = ({ size = 24 }) => {
  return <div>Loading ({size})</div>;
};
