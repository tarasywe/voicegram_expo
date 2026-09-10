import {
  createUserWithEmailAndPassword,
  type User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from '@react-native-firebase/auth';
import { firebaseAuth } from '@/lib/firebase';
import { type AuthSession, authSessionSchema, type Credentials } from '../types/user';

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const displayNameFrom = (user: FirebaseUser) => {
  if (user.displayName) return user.displayName;
  const local = user.email?.split('@')[0] ?? 'voicegram';
  return local.charAt(0).toUpperCase() + local.slice(1);
};

/** Firebase user → the session shape the app stores. Parsed, never trusted raw. */
export function toSession(user: FirebaseUser): AuthSession {
  return authSessionSchema.parse({
    user: {
      uid: user.uid,
      email: user.email ?? '',
      displayName: displayNameFrom(user),
      photoUrl: user.photoURL ?? null,
      createdAt: Date.parse(user.metadata.creationTime ?? '') || Date.now(),
    },
    token: user.uid,
    expiresAt: Date.now() + SESSION_TTL_MS,
  });
}

/**
 * Firebase reports failures with a `code`; its raw messages are long and
 * mention the SDK, so the common ones are rewritten for the login form.
 */
export function toAuthMessage(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code: unknown }).code)
      : '';

  switch (code) {
    case 'auth/invalid-email':
      return 'That email address is not valid.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Wrong email or password.';
    case 'auth/email-already-in-use':
      return 'An account already uses this email.';
    case 'auth/weak-password':
      return 'Use a longer, less predictable password.';
    case 'auth/network-request-failed':
      return 'No connection. Check your network and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again in a few minutes.';
    default:
      return error instanceof Error ? error.message : 'Could not sign you in.';
  }
}

export async function signIn({ email, password }: Credentials): Promise<AuthSession> {
  const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
  return toSession(credential.user);
}

export async function signUp({ email, password }: Credentials): Promise<AuthSession> {
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  return toSession(credential.user);
}

export async function signOutUser(): Promise<void> {
  await signOut(firebaseAuth);
}

/** Fires immediately with the restored user, then on every auth change. */
export function subscribeToAuth(
  callback: (session: AuthSession | null) => void,
): () => void {
  return onAuthStateChanged(firebaseAuth, (user) => {
    callback(user ? toSession(user) : null);
  });
}
