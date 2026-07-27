import type {
  CreateWorkspaceClientOptions,
  WorkspaceClient,
} from "@nexus/shared-types";
import { createWorkspaceClient } from "@nexus/shared-utils";

export function createWebWorkspaceClient(
  options: CreateWorkspaceClientOptions,
): WorkspaceClient {
  return createWorkspaceClient(options);
}

let webWorkspaceClient: WorkspaceClient | null = null;

export function getWebWorkspaceClient(): WorkspaceClient {
  if (!webWorkspaceClient) {
    throw new Error("Web workspace client has not been initialized.");
  }
  return webWorkspaceClient;
}

export function setWebWorkspaceClient(client: WorkspaceClient): WorkspaceClient {
  webWorkspaceClient = client;
  return webWorkspaceClient;
}

export function resetWebWorkspaceClientForTests(): void {
  webWorkspaceClient = null;
}
