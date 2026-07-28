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
    expect(MOBILE_ROUTE_NAMES.Register).toBe('Register');
    expect(MOBILE_ROUTE_NAMES.ForgotPassword).toBe('ForgotPassword');
    expect(MOBILE_ROUTE_NAMES.ResetPassword).toBe('ResetPassword');
    expect(MOBILE_ROUTE_NAMES.VerifyEmail).toBe('VerifyEmail');
    expect(MOBILE_ROUTE_NAMES.Dashboard).toBe('Dashboard');
    expect(MOBILE_ROUTE_NAMES.NotFound).toBe('NotFound');
    expect(MOBILE_ROUTE_IDS.Home).toBe(ROUTE_IDS.HOME);
    expect(MOBILE_ROUTE_IDS.Login).toBe(ROUTE_IDS.LOGIN);
    expect(MOBILE_ROUTE_IDS.Register).toBe(ROUTE_IDS.REGISTER);
    expect(MOBILE_ROUTE_IDS.ForgotPassword).toBe(ROUTE_IDS.FORGOT_PASSWORD);
    expect(MOBILE_ROUTE_IDS.ResetPassword).toBe(ROUTE_IDS.RESET_PASSWORD);
    expect(MOBILE_ROUTE_IDS.VerifyEmail).toBe(ROUTE_IDS.VERIFY_EMAIL);
    expect(MOBILE_ROUTE_IDS.Dashboard).toBe(ROUTE_IDS.DASHBOARD);
    expect(MOBILE_ROUTE_IDS.NotFound).toBe(ROUTE_IDS.NOT_FOUND);
  });

  it('provides deep-link ready linking config without invented prefixes', () => {
    expect(Array.isArray(navigationLinking.prefixes)).toBe(true);
    expect(navigationLinking.prefixes).toHaveLength(0);
    expect(navigationLinking.config).toEqual({
      screens: {
        Login: 'login',
        Register: 'register',
        ForgotPassword: 'forgot-password',
        ResetPassword: {
          path: 'reset-password',
          parse: {
            token: expect.any(Function),
          },
        },
        VerifyEmail: {
          path: 'verify-email',
          parse: {
            token: expect.any(Function),
          },
        },
        Dashboard: 'dashboard',
        Workspaces: 'workspaces',
        Profile: 'profile',
        Home: '',
        NotFound: '*',
      },
    });
  });
});
