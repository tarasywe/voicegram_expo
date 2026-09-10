import { useColorScheme } from 'react-native';
import { useThemeStore } from './store';

export type ResolvedTheme = 'light' | 'dark';

/**
 * The scheme actually rendered: the user's choice, or the OS appearance when
 * the preference is `system`.
 */
export function useResolvedTheme(): ResolvedTheme {
  const mode = useThemeStore((s) => s.mode);
  const system = useColorScheme();
  if (mode === 'system') return system === 'dark' ? 'dark' : 'light';
  return mode;
}
