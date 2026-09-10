import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { signIn, signOutUser, signUp, toAuthMessage } from './api/firebase-auth';
import { type Credentials, credentialsSchema } from './types/user';

/** Writes only. Reads of the current session come from `useAuthStore`. */

const asFriendlyError = (error: unknown) => {
  throw new Error(toAuthMessage(error));
};

export function useSignIn() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationKey: ['auth', 'sign-in'],
    mutationFn: (credentials: Credentials) =>
      signIn(credentialsSchema.parse(credentials)).catch(asFriendlyError),
    onSuccess: setSession,
  });
}

export function useSignUp() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationKey: ['auth', 'sign-up'],
    mutationFn: (credentials: Credentials) =>
      signUp(credentialsSchema.parse(credentials)).catch(asFriendlyError),
    onSuccess: setSession,
  });
}

export function useSignOut() {
  const clearSession = useAuthStore((state) => state.clearSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['auth', 'sign-out'],
    mutationFn: () => signOutUser().catch(asFriendlyError),
    onSuccess: () => {
      clearSession();
      // Cloud listings belong to the account that just left.
      queryClient.removeQueries({ queryKey: ['sync'] });
    },
  });
}
