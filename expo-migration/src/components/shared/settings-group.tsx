import { Divider } from '@ui/divider';
import { VStack } from '@ui/vstack';
import { Children, type ReactNode } from 'react';

/** Rounded card that hairlines its children apart, iOS-settings style. */
export function SettingsGroup({ children }: { children: ReactNode }) {
  const rows = Children.toArray(children);

  return (
    <VStack className="mx-4 overflow-hidden rounded-2xl border border-border bg-card">
      {rows.map((row, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: rows are a static, ordered list
        <VStack key={index}>
          {index > 0 ? <Divider className="bg-border" /> : null}
          {row}
        </VStack>
      ))}
    </VStack>
  );
}
