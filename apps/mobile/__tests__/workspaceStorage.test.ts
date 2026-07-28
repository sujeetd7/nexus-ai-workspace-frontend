import {
  createMobileSelectedWorkspaceStorage,
  resetMobileSelectedWorkspaceStorageForTests,
} from '../src/platform/workspace/createMobileSelectedWorkspaceStorage';

describe('createMobileSelectedWorkspaceStorage', () => {
  beforeEach(() => {
    resetMobileSelectedWorkspaceStorageForTests();
  });

  it('persists selection for the session', async () => {
    const storage = createMobileSelectedWorkspaceStorage();
    expect(await storage.getSelectedWorkspaceId()).toBeNull();
    await storage.setSelectedWorkspaceId('ws-1');
    expect(await storage.getSelectedWorkspaceId()).toBe('ws-1');
    await storage.clearSelectedWorkspaceId();
    expect(await storage.getSelectedWorkspaceId()).toBeNull();
  });
});
