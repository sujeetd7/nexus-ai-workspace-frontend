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
    expect(MOBILE_ROUTE_NAMES.Workspaces).toBe('Workspaces');
    expect(MOBILE_ROUTE_NAMES.WorkspaceDetail).toBe('WorkspaceDetail');
    expect(MOBILE_ROUTE_NAMES.WorkspaceMembers).toBe('WorkspaceMembers');
    expect(MOBILE_ROUTE_NAMES.WorkspaceInvitations).toBe(
      'WorkspaceInvitations',
    );
    expect(MOBILE_ROUTE_NAMES.WorkspaceInvite).toBe('WorkspaceInvite');
    expect(MOBILE_ROUTE_NAMES.AcceptInvitation).toBe('AcceptInvitation');
    expect(MOBILE_ROUTE_NAMES.Profile).toBe('Profile');
    expect(MOBILE_ROUTE_NAMES.ProfileEdit).toBe('ProfileEdit');
    expect(MOBILE_ROUTE_NAMES.ProfilePreferences).toBe('ProfilePreferences');
    expect(MOBILE_ROUTE_NAMES.NotFound).toBe('NotFound');
    expect(MOBILE_ROUTE_IDS.Home).toBe(ROUTE_IDS.HOME);
    expect(MOBILE_ROUTE_IDS.Login).toBe(ROUTE_IDS.LOGIN);
    expect(MOBILE_ROUTE_IDS.Register).toBe(ROUTE_IDS.REGISTER);
    expect(MOBILE_ROUTE_IDS.ForgotPassword).toBe(ROUTE_IDS.FORGOT_PASSWORD);
    expect(MOBILE_ROUTE_IDS.ResetPassword).toBe(ROUTE_IDS.RESET_PASSWORD);
    expect(MOBILE_ROUTE_IDS.VerifyEmail).toBe(ROUTE_IDS.VERIFY_EMAIL);
    expect(MOBILE_ROUTE_IDS.Dashboard).toBe(ROUTE_IDS.DASHBOARD);
    expect(MOBILE_ROUTE_IDS.Profile).toBe(ROUTE_IDS.PROFILE);
    expect(MOBILE_ROUTE_IDS.ProfileEdit).toBe(ROUTE_IDS.PROFILE_EDIT);
    expect(MOBILE_ROUTE_IDS.ProfilePreferences).toBe(
      ROUTE_IDS.PROFILE_PREFERENCES,
    );
    expect(MOBILE_ROUTE_IDS.Workspaces).toBe(ROUTE_IDS.WORKSPACES);
    expect(MOBILE_ROUTE_IDS.WorkspaceDetail).toBe(ROUTE_IDS.WORKSPACE_DETAIL);
    expect(MOBILE_ROUTE_IDS.WorkspaceMembers).toBe(ROUTE_IDS.WORKSPACE_MEMBERS);
    expect(MOBILE_ROUTE_IDS.WorkspaceInvitations).toBe(
      ROUTE_IDS.WORKSPACE_INVITATIONS,
    );
    expect(MOBILE_ROUTE_IDS.WorkspaceInvite).toBe(ROUTE_IDS.WORKSPACE_INVITE);
    expect(MOBILE_ROUTE_IDS.AcceptInvitation).toBe(
      ROUTE_IDS.WORKSPACE_ACCEPT_INVITATION,
    );
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
        WorkspaceDetail: 'workspaces/:workspaceId',
        WorkspaceMembers: 'workspaces/:workspaceId/members',
        WorkspaceInvitations: 'workspaces/:workspaceId/invitations',
        WorkspaceInvite: 'workspaces/:workspaceId/invite',
        AcceptInvitation: {
          path: 'invitations/accept',
          parse: {
            token: expect.any(Function),
          },
        },
        Profile: 'profile',
        ProfileEdit: 'profile/edit',
        ProfilePreferences: 'profile/preferences',
        Home: '',
        NotFound: '*',
      },
    });
  });
});
