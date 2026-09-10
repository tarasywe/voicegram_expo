import { Text } from '@ui/text';

/** Uppercase group heading used above settings and list sections. */
export function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      size="xs"
      bold
      className="px-5 pt-6 pb-2 uppercase tracking-widest text-muted-foreground"
    >
      {children}
    </Text>
  );
}
