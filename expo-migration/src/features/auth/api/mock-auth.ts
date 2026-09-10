import { makeId } from '@/utils/id';
import { type AuthSession, authSessionSchema, type Credentials } from '../types/user';

const NETWORK_DELAY_MS = 600;
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** Emails the mock backend refuses, so the failure paths stay exercisable. */
const LOCKED_EMAIL = 'locked@voicegram.app';
const TAKEN_EMAIL = 'taken@voicegram.app';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const displayNameFrom = (email: string) => {
  const local = email.split('@')[0] ?? 'voicegram';
  return local.charAt(0).toUpperCase() + local.slice(1);
};

const makeSession = (email: string): AuthSession =>
  authSessionSchema.parse({
    user: {
      uid: makeId(),
      email,
      displayName: displayNameFrom(email),
      photoUrl: null,
      createdAt: Date.now(),
    },
    token: makeId(),
    expiresAt: Date.now() + SESSION_TTL_MS,
  });

export async function mockSignIn({ email, password }: Credentials): Promise<AuthSession> {
  await wait(NETWORK_DELAY_MS);
  if (email === LOCKED_EMAIL) {
    throw new Error('This account has been disabled.');
  }
  if (password === 'wrongpassword') {
    throw new Error('Wrong email or password.');
  }
  return makeSession(email);
}

export async function mockSignUp({ email }: Credentials): Promise<AuthSession> {
  await wait(NETWORK_DELAY_MS);
  if (email === TAKEN_EMAIL) {
    throw new Error('An account already uses this email.');
  }
  return makeSession(email);
}

export async function mockSignOut(): Promise<void> {
  await wait(NETWORK_DELAY_MS / 2);
}
