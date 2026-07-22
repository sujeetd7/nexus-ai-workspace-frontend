/**
 * Application-local typed public configuration source for React Native.
 *
 * This module is reference configuration only. There is no approved native
 * environment injection mechanism; values are not loaded from `.env` files.
 * Changing environments requires updating this source (or a future ADR-approved injector).
 */
export type MobilePublicConfigSource = {
  readonly buildMode: "development" | "test" | "production";
  readonly apiBaseUrl: string;
  readonly graphqlUrl: string;
  readonly appName?: string;
};

export const mobilePublicConfigSource: MobilePublicConfigSource = {
  buildMode: "development",
  apiBaseUrl: "http://localhost:3000/api",
  graphqlUrl: "http://localhost:3000/graphql",
  appName: "Nexus AI Workspace",
};
