import { env } from "./env";

export const api = {
  baseUrl: env.apiUrl,

  graphql: env.graphqlUrl,
} as const;
