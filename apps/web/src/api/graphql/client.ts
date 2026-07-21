import { createHttpClient } from "@nexus/shared-network";

import { api } from "../../config";
import { getAccessToken, logout } from "../auth";

const managedGraphQLClient = createHttpClient({
  baseURL: api.graphql,
  tokenProvider: {
    getAccessToken,
  },
  unauthorizedHandler: {
    onUnauthorized: logout,
  },
});

export const graphqlClient = managedGraphQLClient.client;

export function ejectGraphQLInterceptors(): void {
  managedGraphQLClient.ejectInterceptors();
}
