import type { PublicClientConfig } from '@nexus/shared-types';
import { parsePublicClientConfig } from '@nexus/shared-validation';

import type { MobilePublicConfigSource } from './publicConfig';
import { mobilePublicConfigSource } from './publicConfig';

/**
 * Maps the local typed public source into the shared contract and parses once.
 * The only approved React Native runtime configuration adapter.
 */
export function createMobileEnv(
  source: MobilePublicConfigSource,
): PublicClientConfig {
  const result = parsePublicClientConfig({
    buildMode: source.buildMode,
    apiBaseUrl: source.apiBaseUrl,
    graphqlUrl: source.graphqlUrl,
    appName: source.appName,
  });

  if (result.ok === true) {
    return result.value;
  }

  throw new Error(result.error.message);
}

export const env: PublicClientConfig = createMobileEnv(mobilePublicConfigSource);
