/**
 * @format
 */

import {
  MOBILE_ROUTE_IDS,
  MOBILE_ROUTE_NAMES,
  navigationLinking,
} from '../src/navigation';
import { ROUTE_IDS } from '@nexus/shared-types';

describe('mobile navigation contracts', () => {
  it('keeps typed route names aligned with shared route IDs', () => {
    expect(MOBILE_ROUTE_NAMES.Home).toBe('Home');
    expect(MOBILE_ROUTE_NAMES.Login).toBe('Login');
    expect(MOBILE_ROUTE_NAMES.Dashboard).toBe('Dashboard');
    expect(MOBILE_ROUTE_NAMES.NotFound).toBe('NotFound');
    expect(MOBILE_ROUTE_IDS.Home).toBe(ROUTE_IDS.HOME);
    expect(MOBILE_ROUTE_IDS.Login).toBe(ROUTE_IDS.LOGIN);
    expect(MOBILE_ROUTE_IDS.Dashboard).toBe(ROUTE_IDS.DASHBOARD);
    expect(MOBILE_ROUTE_IDS.NotFound).toBe(ROUTE_IDS.NOT_FOUND);
  });

  it('provides deep-link ready linking config without invented prefixes', () => {
    expect(Array.isArray(navigationLinking.prefixes)).toBe(true);
    expect(navigationLinking.prefixes).toHaveLength(0);
    expect(navigationLinking.config).toEqual({
      screens: {
        Login: 'login',
        Dashboard: 'dashboard',
        Home: '',
        NotFound: '*',
      },
    });
  });
});
