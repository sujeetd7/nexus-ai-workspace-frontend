import type { ComponentType, LazyExoticComponent } from "react";
import type { RouteId } from "@nexus/shared-types";

/**
 * Web application route declaration.
 * Auth/roles fields are preserved scaffolding only — not evaluated in Batch 3.3.
 */
export interface RouteConfig {
  id: RouteId;
  path: string;
  element: LazyExoticComponent<ComponentType>;
  /** Preserved — not activated. */
  auth?: boolean;
  /** Preserved — not activated. */
  roles?: string[];
}
