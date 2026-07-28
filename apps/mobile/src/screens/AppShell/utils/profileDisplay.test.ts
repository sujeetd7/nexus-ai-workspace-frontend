import {
  resolveProfileDisplayName,
  resolveProfileEmail,
  resolveProfileInitials,
} from './profileDisplay';

describe('profileDisplay (mobile AppShell)', () => {
  it('resolves initials from name', () => {
    expect(
      resolveProfileInitials({
        id: '1',
        email: 'a@b.com',
        firstName: 'Alex',
        lastName: 'Rivera',
        role: 'USER',
        emailVerified: true,
        isActive: true,
        createdAt: '',
        updatedAt: '',
      }),
    ).toBe('AR');
  });

  it('falls back to email initial', () => {
    expect(
      resolveProfileInitials({
        id: '1',
        email: 'solo@example.com',
        role: 'USER',
        emailVerified: true,
        isActive: true,
        createdAt: '',
        updatedAt: '',
      }),
    ).toBe('S');
  });

  it('returns question mark when user missing', () => {
    expect(resolveProfileInitials(null)).toBe('?');
  });

  it('resolves display name and email', () => {
    const user = {
      id: '1',
      email: 'alex@example.com',
      firstName: 'Alex',
      lastName: 'Rivera',
      role: 'USER' as const,
      emailVerified: true,
      isActive: true,
      createdAt: '',
      updatedAt: '',
    };
    expect(resolveProfileDisplayName(user)).toBe('Alex Rivera');
    expect(resolveProfileEmail(user)).toBe('alex@example.com');
  });
});
