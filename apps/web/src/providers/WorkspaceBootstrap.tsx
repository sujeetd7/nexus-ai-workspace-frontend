import { useEffect, type PropsWithChildren } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useListWorkspacesQuery } from "../api/services/workspace/workspaceApi";
import { createWebSelectedWorkspaceStorage } from "../platform/workspace";
import type { AppDispatch } from "../store/createAppStore";
import {
  selectIsAuthenticated,
  selectUser,
} from "../store/slices/auth/selectors";
import {
  workspaceBootstrapFailed,
  workspaceBootstrapStarted,
  workspaceBootstrapSucceeded,
} from "../store/slices/workspace/workspaceSlice";

const workspaceStorage = createWebSelectedWorkspaceStorage();

export function WorkspaceBootstrap({ children }: PropsWithChildren) {
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
        workspaceBootstrapFailed(
          "Unable to load workspaces. Check your connection and try again.",
        ),
      );
      return;
    }

    void (async () => {
      const storedId = await workspaceStorage.getSelectedWorkspaceId();
      const accessible = workspaces ?? [];
      const stillAllowed = storedId
        ? accessible.some((workspace) => workspace.id === storedId)
        : false;

      if (stillAllowed && storedId) {
        dispatch(workspaceBootstrapSucceeded(storedId));
        return;
      }

      const membershipMatch = authUser
        ? accessible.find((workspace) =>
            workspace.ownerId === authUser.id ||
            accessible.some((w) => w.id === workspace.id),
          )
        : undefined;

      const defaultWorkspace = membershipMatch ?? accessible[0];

      if (defaultWorkspace) {
        await workspaceStorage.setSelectedWorkspaceId(defaultWorkspace.id);
        dispatch(workspaceBootstrapSucceeded(defaultWorkspace.id));
        return;
      }

      await workspaceStorage.clearSelectedWorkspaceId();
      dispatch(workspaceBootstrapSucceeded(undefined));
    })();
  }, [
    authUser,
    dispatch,
    error,
    isAuthenticated,
    isLoading,
    workspaces,
  ]);

  return children;
}
