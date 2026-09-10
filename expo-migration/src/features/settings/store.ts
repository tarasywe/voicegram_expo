import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { LANGUAGES, type LanguageCode } from './lib/languages';

type SettingsState = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
};

const isKnown = (value: unknown): value is LanguageCode =>
  LANGUAGES.some((language) => language.code === value);

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'system',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'voicegram.settings',
      storage: createJSONStorage(() => zustandStorage),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as { language?: unknown };
        return {
          ...current,
          language: isKnown(saved.language) ? saved.language : 'system',
        };
      },
    },
  ),
);
