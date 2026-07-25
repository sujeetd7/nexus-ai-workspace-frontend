import type { ProjectAdapterDescriptor } from "@sujeetd7/ai-engineering-project-adapter-contracts";

import { FRONTEND_DIAGNOSTICS_METADATA } from "./diagnostics-metadata.js";
import { createFrontendProjectDescriptor } from "./descriptor.js";

export interface FrontendProjectAdapterBundle {
  readonly descriptor: ProjectAdapterDescriptor;
  readonly diagnostics: typeof FRONTEND_DIAGNOSTICS_METADATA;
}

/**
 * Factory for the single frontend project adapter bundle.
 * Tooling-only — no runtime side effects.
 */
export function createFrontendProjectAdapter(): FrontendProjectAdapterBundle {
  return Object.freeze({
    descriptor: createFrontendProjectDescriptor(),
    diagnostics: FRONTEND_DIAGNOSTICS_METADATA,
  });
}
