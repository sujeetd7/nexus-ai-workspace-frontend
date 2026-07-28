import { ROUTE_IDS } from '@nexus/shared-types';

import { MOBILE_ROUTE_NAMES } from '../../navigation/types';

/** Display-only shell version — mirrors mobile package version. */
export const APP_SHELL_VERSION = '0.0.1';

export type ShellNavSection = 'primary' | 'settings';

export interface ShellNavItem {
  readonly id: string;
  readonly label: string;
  readonly routeName: keyof typeof MOBILE_ROUTE_NAMES;
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
  id: ROUTE_IDS.PROFILE,
  label: 'Settings',
  routeName: 'Profile',
  section: 'settings',
};

export const SEARCH_PLACEHOLDER =
  'Search (placeholder — backend not connected)';
