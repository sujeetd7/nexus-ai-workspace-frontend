export {
  FRONTEND_ADAPTER_REGISTRY_ID,
  FRONTEND_PROJECT_ID,
  FRONTEND_PROJECT_NAMESPACE,
  FRONTEND_PROJECT_VERSION,
  FRONTEND_REPOSITORY_URL,
  SUPPORTED_PLATFORM_VERSION,
} from "./constants.js";

export { FRONTEND_CAPABILITY_METADATA } from "./capabilities.js";
export {
  FRONTEND_DIAGNOSTICS_METADATA,
  type FrontendDiagnosticsMetadata,
} from "./diagnostics-metadata.js";

export { createFrontendProjectDescriptor } from "./descriptor.js";

export {
  createFrontendProjectAdapter,
  type FrontendProjectAdapterBundle,
} from "./adapter-factory.js";

export {
  lookupFrontendProjectAdapter,
  registerFrontendProjectAdapter,
  type FrontendAdapterRegistration,
} from "./registry.js";
