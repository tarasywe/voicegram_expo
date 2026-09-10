import { HStack } from '@ui/hstack';
import { AddIcon, Icon, RemoveIcon } from '@ui/icon';
import { Pressable } from '@ui/pressable';
import { Text } from '@ui/text';

type StepperProps = {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (next: number) => void;
  /** Rendered next to the value, e.g. `s` for seconds. */
  suffix?: string;
  label: string;
};

/** Compact −/value/+ control for the record settings screen. */
export function Stepper({
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix = '',
  label,
}: StepperProps) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));

  return (
    <HStack className="items-center gap-1 rounded-full bg-secondary p-1">
      <Pressable
        onPress={() => onChange(clamp(value - step))}
        disabled={value <= min}
        accessibilityRole="button"
        accessibilityLabel={`Decrease ${label}`}
        className="h-8 w-8 items-center justify-center rounded-full data-[active=true]:bg-accent data-[disabled=true]:opacity-40"
      >
        <Icon as={RemoveIcon} size="sm" className="text-secondary-foreground" />
      </Pressable>

      <Text size="sm" bold className="min-w-10 text-center text-secondary-foreground">
        {`${value}${suffix}`}
      </Text>

      <Pressable
        onPress={() => onChange(clamp(value + step))}
        disabled={value >= max}
        accessibilityRole="button"
        accessibilityLabel={`Increase ${label}`}
        className="h-8 w-8 items-center justify-center rounded-full data-[active=true]:bg-accent data-[disabled=true]:opacity-40"
      >
        <Icon as={AddIcon} size="sm" className="text-secondary-foreground" />
      </Pressable>
    </HStack>
  );
}
