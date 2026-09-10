import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';
import { subscribeToAuth } from '../api/firebase-auth';

/**
 * Keeps the store in step with Firebase, which restores the signed-in user
 * from its own native persistence on launch. Mounted once, in the root layout.
 */
export function useAuthListener(): void {
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(
    () =>
      subscribeToAuth((session) => {
        if (session) setSession(session);
        else clearSession();
      }),
    [setSession, clearSession],
  );
}
