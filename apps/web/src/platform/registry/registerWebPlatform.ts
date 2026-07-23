import type {
  FeatureManifest,
  Logger,
  PublicClientConfig,
  StorageAdapter,
} from "@nexus/shared-types";
import {
  PLATFORM_SERVICE_KEYS,
  type RegistrationError,
} from "@nexus/shared-types";
import {
  createDependencyRegistry,
  createRegistrationError,
  isRegistrationError,
  runFeatureRegistrationPipeline,
  type DependencyRegistry,
} from "@nexus/shared-utils";

import type { createWebHttpClient } from "../../api/client/axios";
import { WEB_FEATURE_MANIFESTS } from "./featureManifests";
import {
  createPlatformExtensionRegistry,
  type PlatformExtensionRegistry,
} from "./platformExtensionRegistry";

type WebHttpClient = ReturnType<typeof createWebHttpClient>;

export type WebPlatformServices = {
  [PLATFORM_SERVICE_KEYS.LOGGER]: Logger;
  [PLATFORM_SERVICE_KEYS.CONFIG]: PublicClientConfig;
  [PLATFORM_SERVICE_KEYS.STORAGE]: StorageAdapter;
  [PLATFORM_SERVICE_KEYS.HTTP_CLIENT]: WebHttpClient;
};

export type WebDependencyRegistry = DependencyRegistry<WebPlatformServices>;

export interface WebPlatformRegistration {
  readonly registry: WebDependencyRegistry;
  readonly extensions: PlatformExtensionRegistry;
  readonly featureOrder: readonly string[];
}

export interface RegisterWebPlatformOptions {
  readonly config: PublicClientConfig;
  readonly logger: Logger;
  readonly themeStorage: StorageAdapter;
  readonly httpClient: WebHttpClient;
  /** Override static manifests (tests). */
  readonly features?: readonly FeatureManifest[];
}

/**
 * Deterministic web platform registration.
 * Explicit static manifests only — no discovery.
 */
export function registerWebPlatform(
  options: RegisterWebPlatformOptions,
): WebPlatformRegistration {
  const registry = createDependencyRegistry<WebPlatformServices>();
  const extensions = createPlatformExtensionRegistry();

  registry.register(PLATFORM_SERVICE_KEYS.LOGGER, options.logger);
  registry.register(PLATFORM_SERVICE_KEYS.CONFIG, options.config);
  registry.register(PLATFORM_SERVICE_KEYS.STORAGE, options.themeStorage);
  registry.register(PLATFORM_SERVICE_KEYS.HTTP_CLIENT, options.httpClient);

  const features = options.features ?? WEB_FEATURE_MANIFESTS;
  const pipeline = runFeatureRegistrationPipeline(features);
  if (pipeline.ok === false) {
    throw toThrownRegistrationError(pipeline.error);
  }

  registry.seal();
  extensions.seal();

  return {
    registry,
    extensions,
    featureOrder: pipeline.value,
  };
}

function toThrownRegistrationError(
  error: RegistrationError,
): RegistrationError & Error {
  if (isRegistrationError(error)) {
    return error;
  }
  return createRegistrationError(error.code, error.message, error.details);
}
