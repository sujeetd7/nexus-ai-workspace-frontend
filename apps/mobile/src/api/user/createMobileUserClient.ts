import type {
  CreateUserClientOptions,
  UserClient,
} from "@nexus/shared-types";
import { createUserClient } from "@nexus/shared-utils";

export function createMobileUserClient(
  options: CreateUserClientOptions,
): UserClient {
  return createUserClient(options);
}

let mobileUserClient: UserClient | null = null;

export function getMobileUserClient(): UserClient {
  if (!mobileUserClient) {
    throw new Error("Mobile user client has not been initialized.");
  }
  return mobileUserClient;
}

export function setMobileUserClient(client: UserClient): UserClient {
  mobileUserClient = client;
  return mobileUserClient;
}

export function resetMobileUserClientForTests(): void {
  mobileUserClient = null;
}
