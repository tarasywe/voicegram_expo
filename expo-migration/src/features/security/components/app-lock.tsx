import type { ReactNode } from 'react';
import { LockScreen } from '../screens/lock-screen';
import { useSecurityStore } from '../store';

/** Wraps the navigator: renders the lock screen instead of the app when locked. */
export function AppLock({ children }: { children: ReactNode }) {
  const pinEnabled = useSecurityStore((state) => state.pinEnabled);
  const isUnlocked = useSecurityStore((state) => state.isUnlocked);

  if (pinEnabled && !isUnlocked) return <LockScreen />;
  return <>{children}</>;
}
