import type { ResolvedTheme } from './use-resolved-theme';

/**
 * JS mirror of the tokens in `src/global.css`.
 *
 * Components style themselves with UniWind classes — this exists only for the
 * native navigation chrome (stack headers, tab bar), which takes colours as
 * plain values and cannot read a className. Keep it in sync with global.css;
 * that file stays the source of truth.
 */
export type Palette = {
  background: string;
  card: string;
  foreground: string;
  mutedForeground: string;
  primary: string;
  border: string;
};

const light: Palette = {
  background: '#FFFFFF',
  card: '#FFFFFF',
  foreground: '#1E293B',
  mutedForeground: '#64748B',
  primary: '#0891B2',
  border: '#E2E8F0',
};

const dark: Palette = {
  background: '#0F172A',
  card: '#1E293B',
  foreground: '#F8FAFC',
  mutedForeground: '#94A3B8',
  primary: '#0EA5E9',
  border: '#475569',
};

export const palettes: Record<ResolvedTheme, Palette> = { light, dark };
