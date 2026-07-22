import type { PublicClientConfig } from "@nexus/shared-types";
import { parsePublicClientConfig } from "@nexus/shared-validation";

/**
 * Vite env surface consumed by the Web adapter only.
 * Do not export or pass this object to feature code.
 */
export type ViteEnvSource = {
  readonly VITE_API_URL?: string;
  readonly VITE_GRAPHQL_URL?: string;
  readonly VITE_APP_NAME?: string;
  readonly MODE: string;
};

/**
 * Maps Vite variables into the shared plain input shape and parses once.
 * The only approved Web runtime reader of `import.meta.env` for app config.
 */
export function createWebEnv(viteEnv: ViteEnvSource): PublicClientConfig {
  const result = parsePublicClientConfig({
    buildMode: viteEnv.MODE,
    apiBaseUrl: viteEnv.VITE_API_URL,
    graphqlUrl: viteEnv.VITE_GRAPHQL_URL,
    appName: viteEnv.VITE_APP_NAME,
  });

  if (result.ok === true) {
    return result.value;
  }

  throw new Error(result.error.message);
}

let cachedEnv: PublicClientConfig | undefined;

function readImportMetaEnv(): ViteEnvSource {
  return {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_GRAPHQL_URL: import.meta.env.VITE_GRAPHQL_URL,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    MODE: import.meta.env.MODE,
  };
}

/**
 * Lazily resolves and caches the validated public client config.
 * Prefer injecting config from bootstrap; this remains for legacy call sites.
 */
export function getEnv(): PublicClientConfig {
  if (!cachedEnv) {
    cachedEnv = createWebEnv(readImportMetaEnv());
  }
  return cachedEnv;
}

/** @internal Test helper — clears the lazy env cache. */
export function resetWebEnvCacheForTests(): void {
  cachedEnv = undefined;
}

/**
 * Lazy config surface for existing imports. Property access triggers validation.
 */
export const env: PublicClientConfig = {
  get buildMode() {
    return getEnv().buildMode;
  },
  get apiBaseUrl() {
    return getEnv().apiBaseUrl;
  },
  get graphqlUrl() {
    return getEnv().graphqlUrl;
  },
  get appName() {
    return getEnv().appName;
  },
  get isDevelopment() {
    return getEnv().isDevelopment;
  },
  get isProduction() {
    return getEnv().isProduction;
  },
};
