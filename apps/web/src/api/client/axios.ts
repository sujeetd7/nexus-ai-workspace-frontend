import { createHttpClient } from "@nexus/shared-network";

import { api } from "../../config";
import {
  createNetworkLoggerAdapter,
  webLogger,
} from "../../platform/logging";
import { getAccessToken, logout } from "../auth";

const managedHttpClient = createHttpClient({
  baseURL: api.baseUrl,
  tokenProvider: {
    getAccessToken,
  },
  unauthorizedHandler: {
    onUnauthorized: logout,
  },
  logger: createNetworkLoggerAdapter(webLogger),
});

export const axiosClient = managedHttpClient.client;

export function ejectHttpInterceptors(): void {
  managedHttpClient.ejectInterceptors();
}
