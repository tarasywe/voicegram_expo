import { GluestackUIProvider } from '@ui/gluestack-ui-provider';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Uniwind } from 'uniwind';
import { useResolvedTheme } from './use-resolved-theme';

/**
 * Bridges the persisted preference to UniWind so every `dark:` utility in the
 * tree flips at once, and mounts the gluestack overlay/toast providers.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const resolved = useResolvedTheme();

  useEffect(() => {
    Uniwind.setTheme(resolved);
  }, [resolved]);

  return <GluestackUIProvider mode={resolved}>{children}</GluestackUIProvider>;
}
