import { getEnv } from "./env";

/**
 * API URL surface derived from validated public config.
 * Getters avoid import-time env evaluation before bootstrap.
 */
export const api = {
  get baseUrl() {
    return getEnv().apiBaseUrl;
  },
  get graphql() {
    return getEnv().graphqlUrl;
  },
} as const;
