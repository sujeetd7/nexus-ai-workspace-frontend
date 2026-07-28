import { useEffect, type PropsWithChildren } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useGetCurrentUserQuery } from '../api/services/user/userApi';
import { useListWorkspacesQuery } from '../api/services/workspace/workspaceApi';
import { mapApiError } from '../hooks/useApiErrorMessage';
import { createMobileSelectedWorkspaceStorage } from '../platform/workspace/createMobileSelectedWorkspaceStorage';
import type { AppDispatch } from '../store/createAppStore';
import {
  selectAuthInitialized,
  selectIsAuthenticated,
} from '../store/slices/auth/selectors';
import {
  workspaceBootstrapFailed,
  workspaceBootstrapStarted,
  workspaceBootstrapSucceeded,
} from '../store/slices/workspace/workspaceSlice';

const workspaceStorage = createMobileSelectedWorkspaceStorage();

/**
 * Deterministic post-auth sequence (parity with web WorkspaceBootstrap):
 * auth restored → current profile → membership-scoped workspaces →
 * validate persisted selection → ready for shell.
 *
 * Persistence is session-scoped (TD-032); durable KV requires ADR.
 */
export function MobileWorkspaceBootstrap({ children }: PropsWithChildren) {
  const dispatch = useDispatch<AppDispatch>();
  const authInitialized = useSelector(selectAuthInitialized);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const {
    data: profile,
    error: profileError,
    isLoading: profileLoading,
    isFetching: profileFetching,
  } = useGetCurrentUserQuery(undefined, {
    skip: !authInitialized || !isAuthenticated,
  });

  const profileStatus = profileError
    ? mapApiError(profileError).status
    : undefined;
  const profileAuthBlocked =
    profileStatus === 401 || profileStatus === 403;
  const profileSettled =
    !isAuthenticated ||
    (!profileLoading &&
      !profileFetching &&
      (Boolean(profile) || Boolean(profileError)));

  const {
    data: workspaces,
    error: workspaceError,
    isLoading: workspacesLoading,
    isFetching: workspacesFetching,
  } = useListWorkspacesQuery(undefined, {
    skip:
      !authInitialized ||
      !isAuthenticated ||
      !profileSettled ||
      profileAuthBlocked,
  });

  useEffect(() => {
    if (!authInitialized) {
      return;
    }

    if (!isAuthenticated) {
      void workspaceStorage.clearSelectedWorkspaceId();
      dispatch(workspaceBootstrapSucceeded(undefined));
      return;
    }

    if (!profileSettled || profileLoading || profileFetching) {
      dispatch(workspaceBootstrapStarted());
      return;
    }

    if (profileAuthBlocked) {
      dispatch(
        workspaceBootstrapFailed(
          profileStatus === 403
            ? 'You do not have permission to load your profile.'
            : 'Your session has expired. Sign in again to continue.',
        ),
      );
      return;
    }

    if (workspacesLoading || workspacesFetching) {
      dispatch(workspaceBootstrapStarted());
      return;
    }

    if (workspaceError) {
      const apiError = mapApiError(workspaceError);
      if (apiError.status === 401) {
        dispatch(
          workspaceBootstrapFailed(
            'Your session has expired. Sign in again to continue.',
          ),
        );
        return;
      }
      if (apiError.status === 403) {
        dispatch(
          workspaceBootstrapFailed(
            'You do not have permission to list workspaces.',
          ),
        );
        return;
      }
      dispatch(
        workspaceBootstrapFailed(
          apiError.message || 'Unable to load workspaces.',
        ),
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

      if (storedId && !stillAllowed) {
        await workspaceStorage.clearSelectedWorkspaceId();
      }

      if (accessible.length === 1) {
        const only = accessible[0];
        await workspaceStorage.setSelectedWorkspaceId(only.id);
        dispatch(workspaceBootstrapSucceeded(only.id));
        return;
      }

      await workspaceStorage.clearSelectedWorkspaceId();
      dispatch(workspaceBootstrapSucceeded(undefined));
    })();
  }, [
    authInitialized,
    dispatch,
    isAuthenticated,
    profile,
    profileAuthBlocked,
    profileFetching,
    profileLoading,
    profileSettled,
    profileStatus,
    workspaceError,
    workspaces,
    workspacesFetching,
    workspacesLoading,
  ]);

  return children;
}
