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
  Profile: 'Profile',
  Home: 'Home',
  NotFound: 'Not Found',
};

const ROUTE_ID_LOOKUP: Partial<Record<keyof RootStackParamList, string>> = {
  Dashboard: ROUTE_IDS.DASHBOARD,
  Workspaces: ROUTE_IDS.WORKSPACES,
  Profile: ROUTE_IDS.PROFILE,
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
