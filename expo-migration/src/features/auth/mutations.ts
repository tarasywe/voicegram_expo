import { useMutation } from '@tanstack/react-query';
import { mockSignIn, mockSignOut, mockSignUp } from './api/mock-auth';
import { useAuthStore } from './store';
import { type Credentials, credentialsSchema } from './types/user';

/** Writes only. Reads of the current session come from `useAuthStore`. */

export function useSignIn() {
  const setSession = useAuthStore((state) => state.setSession);
  return useMutation({
    mutationKey: ['auth', 'sign-in'],
    mutationFn: (credentials: Credentials) =>
      mockSignIn(credentialsSchema.parse(credentials)),
    onSuccess: setSession,
  });
}

export function useSignUp() {
  const setSession = useAuthStore((state) => state.setSession);
  return useMutation({
    mutationKey: ['auth', 'sign-up'],
    mutationFn: (credentials: Credentials) =>
      mockSignUp(credentialsSchema.parse(credentials)),
    onSuccess: setSession,
  });
}

export function useSignOut() {
  const clearSession = useAuthStore((state) => state.clearSession);
  return useMutation({
    mutationKey: ['auth', 'sign-out'],
    mutationFn: mockSignOut,
    onSuccess: clearSession,
  });
}
