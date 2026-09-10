import type { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

const SafeArea = withUniwind(SafeAreaView);

const EDGE_SETS = {
  none: [],
  top: ['top'],
  bottom: ['bottom'],
  both: ['top', 'bottom'],
} as const;

type ScreenProps = {
  children: ReactNode;
  /** Which safe-area insets to apply on top of what the navigator handles. */
  edges?: keyof typeof EDGE_SETS;
  className?: string;
};

/**
 * Every screen's outermost element: paints the themed background and applies
 * the safe-area insets the navigator does not already handle.
 */
export function Screen({ children, edges = 'bottom', className }: ScreenProps) {
  return (
    <SafeArea
      edges={EDGE_SETS[edges]}
      className={`flex-1 bg-background ${className ?? ''}`}
    >
      {children}
    </SafeArea>
  );
}
