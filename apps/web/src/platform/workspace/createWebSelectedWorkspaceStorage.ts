import { STORAGE_KEYS } from "../../config/constants";

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export interface SelectedWorkspaceStorage {
  getSelectedWorkspaceId(): Promise<string | null>;
  setSelectedWorkspaceId(workspaceId: string): Promise<void>;
  clearSelectedWorkspaceId(): Promise<void>;
}

export function createWebSelectedWorkspaceStorage(): SelectedWorkspaceStorage {
  return {
    async getSelectedWorkspaceId() {
      return getStorage()?.getItem(STORAGE_KEYS.SELECTED_WORKSPACE_ID) ?? null;
    },

    async setSelectedWorkspaceId(workspaceId) {
      getStorage()?.setItem(STORAGE_KEYS.SELECTED_WORKSPACE_ID, workspaceId);
    },

    async clearSelectedWorkspaceId() {
      getStorage()?.removeItem(STORAGE_KEYS.SELECTED_WORKSPACE_ID);
    },
  };
}
