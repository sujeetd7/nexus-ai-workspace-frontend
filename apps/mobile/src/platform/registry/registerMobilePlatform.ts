import type {
  FeatureManifest,
  Logger,
  PublicClientConfig,
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

import type { createMobileHttpClient } from "../../api/client/axios";
import { MOBILE_FEATURE_MANIFESTS } from "./featureManifests";
import {
  createPlatformExtensionRegistry,
  type PlatformExtensionRegistry,
} from "./platformExtensionRegistry";

type MobileHttpClient = ReturnType<typeof createMobileHttpClient>;

export type MobilePlatformServices = {
  [PLATFORM_SERVICE_KEYS.LOGGER]: Logger;
  [PLATFORM_SERVICE_KEYS.CONFIG]: PublicClientConfig;
  [PLATFORM_SERVICE_KEYS.HTTP_CLIENT]: MobileHttpClient;
};

export type MobileDependencyRegistry = DependencyRegistry<MobilePlatformServices>;

export interface MobilePlatformRegistration {
  readonly registry: MobileDependencyRegistry;
  readonly extensions: PlatformExtensionRegistry;
  readonly featureOrder: readonly string[];
}

export interface RegisterMobilePlatformOptions {
  readonly config: PublicClientConfig;
  readonly logger: Logger;
  readonly httpClient: MobileHttpClient;
  readonly features?: readonly FeatureManifest[];
}

/**
 * Deterministic mobile platform registration.
 * Explicit static manifests only — no discovery.
 */
export function registerMobilePlatform(
  options: RegisterMobilePlatformOptions,
): MobilePlatformRegistration {
  const registry = createDependencyRegistry<MobilePlatformServices>();
  const extensions = createPlatformExtensionRegistry();

  registry.register(PLATFORM_SERVICE_KEYS.LOGGER, options.logger);
  registry.register(PLATFORM_SERVICE_KEYS.CONFIG, options.config);
  registry.register(PLATFORM_SERVICE_KEYS.HTTP_CLIENT, options.httpClient);

  const features = options.features ?? MOBILE_FEATURE_MANIFESTS;
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
