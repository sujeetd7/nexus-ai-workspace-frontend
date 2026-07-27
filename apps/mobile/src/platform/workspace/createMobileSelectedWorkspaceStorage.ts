let selectedWorkspaceId: string | null = null;

export function createMobileSelectedWorkspaceStorage() {
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
