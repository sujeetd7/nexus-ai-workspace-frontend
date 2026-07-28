import {
  classifySystemFailure,
  profileFailureCopy,
  workspaceFailureCopy,
} from '../src/system/classifySystemFailure';

describe('classifySystemFailure (mobile)', () => {
  it('classifies session expired vs unauthorized', () => {
    expect(
      classifySystemFailure({
        status: 401,
        context: 'authenticated',
      }).kind,
    ).toBe('sessionExpired');
    expect(
      classifySystemFailure({
        status: 401,
        context: 'anonymous',
      }).kind,
    ).toBe('unauthorized');
  });

  it('classifies forbidden without requiring reauth', () => {
    const result = classifySystemFailure({
      status: 403,
      context: 'authenticated',
    });
    expect(result.kind).toBe('forbidden');
    expect(result.requiresReauth).toBe(false);
    expect(result.secondaryAction).toBe('signOut');
  });

  it('classifies network and retryable failures', () => {
    expect(
      classifySystemFailure({
        causeType: 'network',
        code: 'NETWORK_ERROR',
      }).kind,
    ).toBe('networkUnavailable');
    expect(
      classifySystemFailure({
        status: 500,
        retryable: true,
      }).kind,
    ).toBe('retryableApi');
  });

  it('keeps workspace copy titles stable', () => {
    expect(workspaceFailureCopy('sessionExpired').title).toBe('Session expired');
    expect(workspaceFailureCopy('forbidden').title).toBe('Permission denied');
  });

  it('keeps profile copy titles stable', () => {
    expect(profileFailureCopy('unauthorized').message).toContain('profile');
    expect(profileFailureCopy('retryableApi').title).toBe(
      'Unable to load profile',
    );
  });
});
