import type {
  CreateWorkspaceClientOptions,
  WorkspaceClient,
} from "@nexus/shared-types";
import { createWorkspaceClient } from "@nexus/shared-utils";

export function createMobileWorkspaceClient(
  options: CreateWorkspaceClientOptions,
): WorkspaceClient {
  return createWorkspaceClient(options);
}

let mobileWorkspaceClient: WorkspaceClient | null = null;

export function getMobileWorkspaceClient(): WorkspaceClient {
  if (!mobileWorkspaceClient) {
    throw new Error("Mobile workspace client has not been initialized.");
  }
  return mobileWorkspaceClient;
}

export function setMobileWorkspaceClient(client: WorkspaceClient): WorkspaceClient {
  mobileWorkspaceClient = client;
  return mobileWorkspaceClient;
}

export function resetMobileWorkspaceClientForTests(): void {
  mobileWorkspaceClient = null;
}
