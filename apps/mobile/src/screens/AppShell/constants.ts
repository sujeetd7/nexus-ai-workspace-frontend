import { ROUTE_IDS } from '@nexus/shared-types';

import { MOBILE_ROUTE_NAMES } from '../../navigation/types';

/** Display-only shell version — mirrors mobile package version. */
export const APP_SHELL_VERSION = '0.0.1';

export type ShellNavSection = 'primary' | 'settings';

/** Shell drawer destinations — param-less authenticated routes only. */
export type ShellNavRouteName =
  | 'Dashboard'
  | 'Workspaces'
  | 'Profile'
  | 'ProfilePreferences';

export interface ShellNavItem {
  readonly id: string;
  readonly label: string;
  readonly routeName: ShellNavRouteName;
  readonly section: ShellNavSection;
}

/** Primary navigation — existing authenticated routes only. */
export const PRIMARY_NAV_ITEMS: readonly ShellNavItem[] = [
  {
    id: ROUTE_IDS.DASHBOARD,
    label: 'Dashboard',
    routeName: 'Dashboard',
    section: 'primary',
  },
  {
    id: ROUTE_IDS.WORKSPACES,
    label: 'Workspaces',
    routeName: 'Workspaces',
    section: 'primary',
  },
  {
    id: ROUTE_IDS.PROFILE,
    label: 'Profile',
    routeName: 'Profile',
    section: 'primary',
  },
] as const;

export const SETTINGS_NAV_ITEM: ShellNavItem = {
  id: ROUTE_IDS.PROFILE_PREFERENCES,
  label: 'Settings',
  routeName: 'ProfilePreferences',
  section: 'settings',
};

export const SEARCH_PLACEHOLDER =
  'Search (placeholder — backend not connected)';

/** Compile-time guard: shell nav names must exist in mobile route catalog. */
const _shellNavRouteNames: Record<
  ShellNavRouteName,
  (typeof MOBILE_ROUTE_NAMES)[ShellNavRouteName]
> = {
  Dashboard: MOBILE_ROUTE_NAMES.Dashboard,
  Workspaces: MOBILE_ROUTE_NAMES.Workspaces,
  Profile: MOBILE_ROUTE_NAMES.Profile,
  ProfilePreferences: MOBILE_ROUTE_NAMES.ProfilePreferences,
};

void _shellNavRouteNames;
