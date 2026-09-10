import { HStack } from '@ui/hstack';
import { ChevronRightIcon, Icon } from '@ui/icon';
import { Pressable } from '@ui/pressable';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import type { ComponentProps, ReactNode } from 'react';

type SettingsRowProps = {
  label: string;
  description?: string;
  icon?: ComponentProps<typeof Icon>['as'];
  /** Control rendered on the trailing edge (switch, value text, stepper…). */
  accessory?: ReactNode;
  onPress?: () => void;
  /** Shows a chevron and makes the whole row tappable. */
  showChevron?: boolean;
  destructive?: boolean;
};

export function SettingsRow({
  label,
  description,
  icon,
  accessory,
  onPress,
  showChevron = false,
  destructive = false,
}: SettingsRowProps) {
  const body = (
    <HStack className="min-h-14 items-center gap-3 px-5 py-3">
      {icon ? (
        <VStack className="h-9 w-9 items-center justify-center rounded-lg bg-secondary">
          <Icon
            as={icon}
            size="sm"
            className={destructive ? 'text-destructive' : 'text-primary'}
          />
        </VStack>
      ) : null}

      <VStack className="flex-1 gap-0.5">
        <Text size="md" className={destructive ? 'text-destructive' : 'text-foreground'}>
          {label}
        </Text>
        {description ? (
          <Text size="xs" className="text-muted-foreground">
            {description}
          </Text>
        ) : null}
      </VStack>

      {accessory}
      {showChevron ? (
        <Icon as={ChevronRightIcon} size="sm" className="text-muted-foreground" />
      ) : null}
    </HStack>
  );

  if (!onPress) return <VStack className="bg-card">{body}</VStack>;

  return (
    <Pressable
      onPress={onPress}
      className="bg-card data-[active=true]:bg-accent"
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {body}
    </Pressable>
  );
}
