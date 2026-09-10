import type { AudioRecord } from '@features/articles';
import { HStack } from '@ui/hstack';
import { GripVerticalIcon, Icon, SettingsIcon } from '@ui/icon';
import { Pressable } from '@ui/pressable';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { PauseIcon } from '@/components/shared';
import { formatDuration } from '@/utils/format';

type RecordRowProps = {
  record: AudioRecord;
  index: number;
  /** True while this clip is the one the article player is on. */
  isActive: boolean;
  isDragging: boolean;
  /** Only wired when the article has more than one record. */
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onPress: () => void;
};

export function RecordRow({
  record,
  index,
  isActive,
  isDragging,
  onDragStart,
  onDragEnd,
  onPress,
}: RecordRowProps) {
  const meta = [
    formatDuration(record.durationSec),
    record.repeat > 1 ? `×${record.repeat}` : null,
    record.delaySec > 0 ? `+${record.delaySec}s` : null,
    record.enabled ? null : 'muted',
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Configure ${record.title}`}
      className={`mx-4 mb-2 rounded-2xl border bg-card data-[active=true]:bg-accent ${
        isDragging ? 'border-primary shadow-lg' : 'border-border'
      } ${isActive ? 'border-primary' : ''} ${record.enabled ? '' : 'opacity-60'}`}
    >
      <HStack className="items-center gap-3 p-3">
        {onDragStart ? (
          <Pressable
            onPressIn={onDragStart}
            onPressOut={onDragEnd}
            accessibilityRole="button"
            accessibilityLabel={`Reorder ${record.title}`}
            hitSlop={10}
            className="h-9 w-7 items-center justify-center"
          >
            <Icon as={GripVerticalIcon} size="sm" className="text-muted-foreground" />
          </Pressable>
        ) : null}

        <VStack
          className={`h-9 w-9 items-center justify-center rounded-lg ${
            isActive ? 'bg-primary' : 'bg-secondary'
          }`}
        >
          {isActive ? (
            <Icon as={PauseIcon} size="xs" className="text-primary-foreground" />
          ) : (
            <Text size="sm" bold className="text-secondary-foreground">
              {index + 1}
            </Text>
          )}
        </VStack>

        <VStack className="flex-1 gap-0.5">
          <Text size="md" isTruncated className="text-foreground">
            {record.title}
          </Text>
          <Text size="xs" className="text-muted-foreground">
            {meta}
          </Text>
        </VStack>

        <Icon as={SettingsIcon} size="sm" className="text-muted-foreground" />
      </HStack>
    </Pressable>
  );
}
