import type { ComponentType, LazyExoticComponent } from "react";

export interface RouteConfig {
  path: string;

  element: LazyExoticComponent<ComponentType>;

  auth?: boolean;

  roles?: string[];
}
