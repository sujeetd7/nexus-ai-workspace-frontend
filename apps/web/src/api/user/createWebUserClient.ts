import type {
  CreateUserClientOptions,
  UserClient,
} from "@nexus/shared-types";
import { createUserClient } from "@nexus/shared-utils";

export function createWebUserClient(options: CreateUserClientOptions): UserClient {
  return createUserClient(options);
}

let webUserClient: UserClient | null = null;

export function getWebUserClient(): UserClient {
  if (!webUserClient) {
    throw new Error("Web user client has not been initialized.");
  }
  return webUserClient;
}

export function setWebUserClient(client: UserClient): UserClient {
  webUserClient = client;
  return webUserClient;
}

export function resetWebUserClientForTests(): void {
  webUserClient = null;
}
