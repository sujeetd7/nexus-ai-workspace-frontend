import { createHttpClient } from "@nexus/shared-network";

import { api } from "../../config";
import {
  createGraphQLNetworkLoggerAdapter,
  webLogger,
} from "../../platform/logging";
import { getAccessToken, logout } from "../auth";

const managedGraphQLClient = createHttpClient({
  baseURL: api.graphql,
  tokenProvider: {
    getAccessToken,
  },
  unauthorizedHandler: {
    onUnauthorized: logout,
  },
  logger: createGraphQLNetworkLoggerAdapter(webLogger),
});

export const graphqlClient = managedGraphQLClient.client;

export function ejectGraphQLInterceptors(): void {
  managedGraphQLClient.ejectInterceptors();
}
