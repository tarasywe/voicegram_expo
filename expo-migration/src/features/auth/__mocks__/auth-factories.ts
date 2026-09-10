import type { AuthSession, User } from '../types/user';

export function makeUserFixture(overrides: Partial<User> = {}): User {
  return {
    uid: 'uid-1',
    email: 'taras@voicegram.app',
    displayName: 'Taras',
    photoUrl: null,
    createdAt: 1_700_000_000_000,
    ...overrides,
  };
}

export function makeSessionFixture(overrides: Partial<AuthSession> = {}): AuthSession {
  return {
    user: makeUserFixture(),
    token: 'token-1',
    expiresAt: Date.now() + 60_000,
    ...overrides,
  };
}
