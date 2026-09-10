import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';

type SecurityState = {
  /** A PIN exists in the keychain and is required to open the app. */
  pinEnabled: boolean;
  /** Face ID / fingerprint may be used instead of typing the PIN. */
  biometricsEnabled: boolean;
  /** False until the current session has been unlocked. */
  isUnlocked: boolean;

  setPinEnabled: (enabled: boolean) => void;
  setBiometricsEnabled: (enabled: boolean) => void;
  unlock: () => void;
  lock: () => void;
};

export const useSecurityStore = create<SecurityState>()(
  persist(
    (set) => ({
      pinEnabled: false,
      biometricsEnabled: false,
      isUnlocked: true,

      setPinEnabled: (pinEnabled) =>
        set(pinEnabled ? { pinEnabled } : { pinEnabled, biometricsEnabled: false }),
      setBiometricsEnabled: (biometricsEnabled) => set({ biometricsEnabled }),
      unlock: () => set({ isUnlocked: true }),
      lock: () => set({ isUnlocked: false }),
    }),
    {
      name: 'voicegram.security',
      storage: createJSONStorage(() => zustandStorage),
      /** Lock state is per-session: a relaunch always starts locked. */
      partialize: (state) => ({
        pinEnabled: state.pinEnabled,
        biometricsEnabled: state.biometricsEnabled,
      }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<SecurityState>;
        const pinEnabled = saved.pinEnabled === true;
        return {
          ...current,
          pinEnabled,
          biometricsEnabled: pinEnabled && saved.biometricsEnabled === true,
          isUnlocked: !pinEnabled,
        };
      },
    },
  ),
);
