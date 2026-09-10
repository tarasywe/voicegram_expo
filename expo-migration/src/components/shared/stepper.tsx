import { HStack } from '@ui/hstack';
import { AddIcon, Icon, RemoveIcon } from '@ui/icon';
import { Pressable } from '@ui/pressable';
import { Text } from '@ui/text';

type StepperProps = {
  value: number;
  min: number;
  max: number;
  step?: number;
  /** Preset ladder to walk instead of a fixed step — for ranges too wide to
   *  step through one unit at a time. Overrides `step` when given. */
  options?: readonly number[];
  onChange: (next: number) => void;
  /** Rendered next to the value, e.g. `s` for seconds. */
  suffix?: string;
  label: string;
};

/** Nearest ladder entry in `direction`, or the current value at either end. */
function stepThrough(
  options: readonly number[],
  value: number,
  direction: 1 | -1,
): number {
  const candidates =
    direction === 1
      ? options.filter((option) => option > value)
      : options.filter((option) => option < value);
  if (candidates.length === 0) return value;
  return direction === 1 ? Math.min(...candidates) : Math.max(...candidates);
}

/** Compact −/value/+ control for the record settings screen. */
export function Stepper({
  value,
  min,
  max,
  step = 1,
  options,
  onChange,
  suffix = '',
  label,
}: StepperProps) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));
  const decrement = () =>
    options ? stepThrough(options, value, -1) : clamp(value - step);
  const increment = () =>
    options ? stepThrough(options, value, 1) : clamp(value + step);
  const atMin = options ? value <= Math.min(...options) : value <= min;
  const atMax = options ? value >= Math.max(...options) : value >= max;

  return (
    <HStack className="items-center gap-1 rounded-full bg-secondary p-1">
      <Pressable
        onPress={() => onChange(decrement())}
        disabled={atMin}
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
        onPress={() => onChange(increment())}
        disabled={atMax}
        accessibilityRole="button"
        accessibilityLabel={`Increase ${label}`}
        className="h-8 w-8 items-center justify-center rounded-full data-[active=true]:bg-accent data-[disabled=true]:opacity-40"
      >
        <Icon as={AddIcon} size="sm" className="text-secondary-foreground" />
      </Pressable>
    </HStack>
  );
}
