/**
 * Vite / Metro / native build modes only.
 * Deployment stages (local, staging, preproduction) are intentionally excluded.
 */
export type BuildMode = "development" | "test" | "production";

/**
 * Platform-neutral public client configuration.
 *
 * Extension strategy: add optional fields only when both Web and React Native
 * have demonstrated consumers. Keep Vite- and RN-specific names in app adapters.
 */
export interface PublicClientConfig {
  readonly buildMode: BuildMode;
  readonly apiBaseUrl: string;
  readonly graphqlUrl: string;
  readonly appName: string;
  readonly isDevelopment: boolean;
  readonly isProduction: boolean;
}
