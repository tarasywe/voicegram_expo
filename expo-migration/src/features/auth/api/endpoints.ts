/**
 * Auth endpoints. Firebase Auth replaces the `mock:` scheme in a later step —
 * the paths are kept here so only this file changes when it does.
 */
export const authEndpoints = {
  signIn: 'mock://auth/sign-in',
  signUp: 'mock://auth/sign-up',
  signOut: 'mock://auth/sign-out',
} as const;
