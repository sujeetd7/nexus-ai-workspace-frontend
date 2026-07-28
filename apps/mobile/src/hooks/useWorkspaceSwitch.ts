import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { workspaceApi } from '../api/services/workspace/workspaceApi';
import { createMobileSelectedWorkspaceStorage } from '../platform/workspace/createMobileSelectedWorkspaceStorage';
import type { AppDispatch } from '../store/createAppStore';
import { setSelectedWorkspace } from '../store/slices/workspace/workspaceSlice';

const workspaceStorage = createMobileSelectedWorkspaceStorage();

export function useWorkspaceSwitch() {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (workspaceId: string) => {
      await workspaceStorage.setSelectedWorkspaceId(workspaceId);
      dispatch(setSelectedWorkspace(workspaceId));
      dispatch(
        workspaceApi.util.invalidateTags([
          { type: 'WorkspaceMembers', id: workspaceId },
          { type: 'WorkspaceInvitations', id: workspaceId },
        ]),
      );
    },
    [dispatch],
  );
}
