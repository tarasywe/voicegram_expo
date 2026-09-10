import type { Href } from 'expo-router';

/**
 * Every navigation target in the app. Screens and components must route
 * through these builders — never through a hardcoded path string.
 */
export const links = {
  articles: '/(tabs)' as Href,
  profile: '/(tabs)/profile' as Href,
  settings: '/(tabs)/settings' as Href,

  article: (articleId: string) => `/article/${articleId}` as Href,
  articleSettings: (articleId: string) => `/article/${articleId}/settings` as Href,
  record: (articleId: string, recordId: string) =>
    `/article/${articleId}/record/${recordId}` as Href,

  settingsAppearance: '/settings/appearance' as Href,
  settingsSecurity: '/settings/security' as Href,
  settingsLanguage: '/settings/language' as Href,
  settingsAbout: '/settings/about' as Href,
} as const;
