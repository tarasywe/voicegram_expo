import { DarkTheme, DefaultTheme, type ThemeProvider } from 'expo-router';
import type { ComponentProps } from 'react';
import { palettes } from './palette';
import type { ResolvedTheme } from './use-resolved-theme';

/**
 * Derived from the provider rather than imported as a named `Theme` type —
 * expo-router only started exporting that type in a later 57.0.x, and the SDK
 * is pinned back (see BUILD.md §6).
 */
type NavigationTheme = ComponentProps<typeof ThemeProvider>['value'];

/** Feeds the app palette to react-navigation's own theming. */
export function navigationTheme(resolved: ResolvedTheme): NavigationTheme {
  const palette = palettes[resolved];
  const base = resolved === 'dark' ? DarkTheme : DefaultTheme;

  return {
    ...base,
    dark: resolved === 'dark',
    colors: {
      ...base.colors,
      primary: palette.primary,
      background: palette.background,
      card: palette.card,
      text: palette.foreground,
      border: palette.border,
      notification: palette.primary,
    },
  };
}
