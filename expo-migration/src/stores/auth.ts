/**
 * The signed-in session. Lives in `@/stores` rather than inside the auth
 * feature because the sync feature reads the uid too — keeping it here is what
 * stops `auth` and `sync` importing each other in a cycle.
 */

import { type AuthSession, authSessionSchema } from '@features/auth/types/user';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';

type AuthState = {
  session: AuthSession | null;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
    }),
    {
      name: 'voicegram.auth',
      storage: createJSONStorage(() => zustandStorage),
      /** A malformed or expired session must not leave the app half-signed-in. */
      merge: (persisted, current) => {
        const parsed = authSessionSchema.safeParse(
          (persisted as { session?: unknown } | null)?.session,
        );
        const isLive = parsed.success && parsed.data.expiresAt > Date.now();
        return { ...current, session: isLive ? parsed.data : null };
      },
    },
  ),
);

export const useCurrentUser = () => useAuthStore((state) => state.session?.user ?? null);
export const useIsAuthenticated = () => useAuthStore((state) => state.session !== null);
