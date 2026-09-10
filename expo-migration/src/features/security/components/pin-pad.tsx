import { HStack } from '@ui/hstack';
import { CloseIcon, Icon } from '@ui/icon';
import { Pressable } from '@ui/pressable';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import * as Haptics from 'expo-haptics';
import { PIN_LENGTH } from '../lib/pin';

type PinPadProps = {
  value: string;
  onChange: (next: string) => void;
  /** Rendered in the bottom-left slot — e.g. a "Use Face ID" shortcut. */
  accessory?: React.ReactNode;
};

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
const ROWS = [0, 1, 2] as const;
const DOT_SLOTS = Array.from({ length: PIN_LENGTH }, (_, slot) => slot);

/** Numeric keypad plus the filled-dot indicator, sized for one-handed reach. */
export function PinPad({ value, onChange, accessory }: PinPadProps) {
  const press = (digit: string) => {
    if (value.length >= PIN_LENGTH) return;
    void Haptics.selectionAsync();
    onChange(value + digit);
  };

  const backspace = () => {
    if (value.length === 0) return;
    void Haptics.selectionAsync();
    onChange(value.slice(0, -1));
  };

  return (
    <VStack className="items-center gap-8">
      <HStack className="gap-4">
        {DOT_SLOTS.map((slot) => (
          <VStack
            key={slot}
            className={`h-4 w-4 rounded-full ${
              slot < value.length ? 'bg-primary' : 'bg-secondary'
            }`}
          />
        ))}
      </HStack>

      <VStack className="gap-3">
        {ROWS.map((row) => (
          <HStack key={`row-${row}`} className="gap-3">
            {KEYS.slice(row * 3, row * 3 + 3).map((digit) => (
              <PinKey key={digit} label={digit} onPress={() => press(digit)} />
            ))}
          </HStack>
        ))}

        <HStack className="gap-3">
          <VStack className="h-[72px] w-[72px] items-center justify-center">
            {accessory}
          </VStack>
          <PinKey label="0" onPress={() => press('0')} />
          <Pressable
            onPress={backspace}
            accessibilityRole="button"
            accessibilityLabel="Delete digit"
            className="h-[72px] w-[72px] items-center justify-center rounded-full data-[active=true]:bg-secondary"
          >
            <Icon as={CloseIcon} size="lg" className="text-muted-foreground" />
          </Pressable>
        </HStack>
      </VStack>
    </VStack>
  );
}

function PinKey({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="h-[72px] w-[72px] items-center justify-center rounded-full bg-secondary data-[active=true]:bg-accent"
    >
      <Text size="2xl" className="text-secondary-foreground">
        {label}
      </Text>
    </Pressable>
  );
}
