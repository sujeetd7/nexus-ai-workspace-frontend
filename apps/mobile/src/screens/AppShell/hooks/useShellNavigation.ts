import { useMemo } from 'react';
import { useRoute } from '@react-navigation/native';
import { ROUTE_IDS } from '@nexus/shared-types';

import {
  MOBILE_ROUTE_IDS,
  type RootStackParamList,
} from '../../../navigation/types';

export interface ShellNavigationContext {
  readonly pageTitle: string;
  readonly routeId: string | undefined;
}

const ROUTE_TITLES: Partial<Record<keyof RootStackParamList, string>> = {
  Dashboard: 'Dashboard',
  Workspaces: 'Workspaces',
  WorkspaceDetail: 'Workspace',
  WorkspaceMembers: 'Members',
  WorkspaceInvitations: 'Invitations',
  WorkspaceInvite: 'Invite member',
  AcceptInvitation: 'Accept invitation',
  Profile: 'Profile',
  ProfileEdit: 'Edit profile',
  ProfilePreferences: 'Preferences',
  Home: 'Home',
  NotFound: 'Not Found',
};

const ROUTE_ID_LOOKUP: Partial<Record<keyof RootStackParamList, string>> = {
  Dashboard: ROUTE_IDS.DASHBOARD,
  Workspaces: ROUTE_IDS.WORKSPACES,
  WorkspaceDetail: ROUTE_IDS.WORKSPACE_DETAIL,
  WorkspaceMembers: ROUTE_IDS.WORKSPACE_MEMBERS,
  WorkspaceInvitations: ROUTE_IDS.WORKSPACE_INVITATIONS,
  WorkspaceInvite: ROUTE_IDS.WORKSPACE_INVITE,
  AcceptInvitation: ROUTE_IDS.WORKSPACE_ACCEPT_INVITATION,
  Profile: ROUTE_IDS.PROFILE,
  ProfileEdit: ROUTE_IDS.PROFILE_EDIT,
  ProfilePreferences: ROUTE_IDS.PROFILE_PREFERENCES,
  Home: ROUTE_IDS.HOME,
  NotFound: ROUTE_IDS.NOT_FOUND,
};

export function useShellNavigation(): ShellNavigationContext {
  const route = useRoute();

  return useMemo(() => {
    const routeName = route.name as keyof RootStackParamList;
    const title = ROUTE_TITLES[routeName] ?? 'Nexus';
    const routeId =
      MOBILE_ROUTE_IDS[routeName] ?? ROUTE_ID_LOOKUP[routeName];

    return {
      pageTitle: title,
      routeId,
    };
  }, [route.name]);
}
