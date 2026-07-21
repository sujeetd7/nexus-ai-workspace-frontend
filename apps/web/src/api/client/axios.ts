import { createHttpClient } from "@nexus/shared-network";

import { api } from "../../config";
import { getAccessToken, logout } from "../auth";

const managedHttpClient = createHttpClient({
  baseURL: api.baseUrl,
  tokenProvider: {
    getAccessToken,
  },
  unauthorizedHandler: {
    onUnauthorized: logout,
  },
});

export const axiosClient = managedHttpClient.client;

export function ejectHttpInterceptors(): void {
  managedHttpClient.ejectInterceptors();
}
