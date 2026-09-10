import { Icon } from '@ui/icon';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import type { ComponentProps } from 'react';

type EmptyStateProps = {
  icon: ComponentProps<typeof Icon>['as'];
  title: string;
  description: string;
};

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <VStack className="flex-1 items-center justify-center gap-3 px-10 py-16">
      <VStack className="h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
        <Icon as={icon} size="xl" className="text-muted-foreground" />
      </VStack>
      <Text size="lg" bold className="text-center text-foreground">
        {title}
      </Text>
      <Text size="sm" className="text-center text-muted-foreground">
        {description}
      </Text>
    </VStack>
  );
}
