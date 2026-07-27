import { useEffect, type PropsWithChildren } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useListWorkspacesQuery } from '../api/services/workspace/workspaceApi';
import { createMobileSelectedWorkspaceStorage } from '../platform/workspace/createMobileSelectedWorkspaceStorage';
import type { AppDispatch } from '../store/createAppStore';
import {
  selectIsAuthenticated,
  selectUser,
} from '../store/slices/auth/selectors';
import {
  workspaceBootstrapFailed,
  workspaceBootstrapStarted,
  workspaceBootstrapSucceeded,
} from '../store/slices/workspace/workspaceSlice';

const workspaceStorage = createMobileSelectedWorkspaceStorage();

export function MobileWorkspaceBootstrap({ children }: PropsWithChildren) {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authUser = useSelector(selectUser);
  const { data: workspaces, error, isLoading } = useListWorkspacesQuery(
    undefined,
    { skip: !isAuthenticated },
  );

  useEffect(() => {
    if (!isAuthenticated) {
      workspaceStorage.clearSelectedWorkspaceId();
      dispatch(workspaceBootstrapSucceeded(undefined));
      return;
    }

    if (isLoading) {
      dispatch(workspaceBootstrapStarted());
      return;
    }

    if (error) {
      dispatch(
        workspaceBootstrapFailed('Unable to load workspaces.'),
      );
      return;
    }

    void (async () => {
      const storedId = await workspaceStorage.getSelectedWorkspaceId();
      const accessible = workspaces ?? [];
      const stillAllowed = storedId
        ? accessible.some(workspace => workspace.id === storedId)
        : false;

      if (stillAllowed && storedId) {
        dispatch(workspaceBootstrapSucceeded(storedId));
        return;
      }

      const defaultWorkspace =
        accessible.find(workspace => workspace.ownerId === authUser?.id) ??
        accessible[0];

      if (defaultWorkspace) {
        await workspaceStorage.setSelectedWorkspaceId(defaultWorkspace.id);
        dispatch(workspaceBootstrapSucceeded(defaultWorkspace.id));
        return;
      }

      await workspaceStorage.clearSelectedWorkspaceId();
      dispatch(workspaceBootstrapSucceeded(undefined));
    })();
  }, [authUser, dispatch, error, isAuthenticated, isLoading, workspaces]);

  return children;
}
