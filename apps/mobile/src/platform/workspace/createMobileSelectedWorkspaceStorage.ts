let selectedWorkspaceId: string | null = null;

export interface SelectedWorkspaceStorage {
  getSelectedWorkspaceId(): Promise<string | null>;
  setSelectedWorkspaceId(workspaceId: string): Promise<void>;
  clearSelectedWorkspaceId(): Promise<void>;
}

/**
 * Session-scoped selected workspace storage.
 * Durable native KV (AsyncStorage/MMKV) remains deferred under TD-032.
 */
export function createMobileSelectedWorkspaceStorage(): SelectedWorkspaceStorage {
  return {
    async getSelectedWorkspaceId() {
      return selectedWorkspaceId;
    },
    async setSelectedWorkspaceId(workspaceId: string) {
      selectedWorkspaceId = workspaceId;
    },
    async clearSelectedWorkspaceId() {
      selectedWorkspaceId = null;
    },
  };
}

export function resetMobileSelectedWorkspaceStorageForTests() {
  selectedWorkspaceId = null;
}
