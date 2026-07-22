import { env } from "./env";

export const api = {
  baseUrl: env.apiBaseUrl,

  graphql: env.graphqlUrl,
} as const;
