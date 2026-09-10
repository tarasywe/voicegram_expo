/** Locales the UI offers. `system` follows the device's own preference. */
export const LANGUAGES = [
  { code: 'system', label: 'System default', native: '' },
  { code: 'en', label: 'English', native: 'English' },
  { code: 'uk', label: 'Ukrainian', native: 'Українська' },
  { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'es', label: 'Spanish', native: 'Español' },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['code'];

export const languageLabel = (code: LanguageCode) =>
  LANGUAGES.find((language) => language.code === code)?.label ?? 'English';
