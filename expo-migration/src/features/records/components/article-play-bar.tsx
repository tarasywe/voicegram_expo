import { Button, ButtonIcon, ButtonText } from '@ui/button';
import { HStack } from '@ui/hstack';
import { PlayIcon } from '@ui/icon';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { StopIcon } from '@/components/shared';
import { formatDuration, pluralize } from '@/utils/format';

type ArticlePlayBarProps = {
  recordCount: number;
  durationSec: number;
  isPlaying: boolean;
  onToggle: () => void;
};

/** Header strip of the article screen: what's inside, and one big play control. */
export function ArticlePlayBar({
  recordCount,
  durationSec,
  isPlaying,
  onToggle,
}: ArticlePlayBarProps) {
  return (
    <HStack className="mx-4 mb-4 items-center gap-4 rounded-2xl bg-surface p-4">
      <VStack className="flex-1 gap-0.5">
        <Text size="lg" bold className="text-foreground">
          {formatDuration(durationSec)}
        </Text>
        <Text size="xs" className="uppercase tracking-wider text-muted-foreground">
          {pluralize(recordCount, 'record')}
        </Text>
      </VStack>

      <Button
        onPress={onToggle}
        isDisabled={recordCount === 0}
        variant={isPlaying ? 'secondary' : 'default'}
        size="lg"
        className="rounded-full px-6"
      >
        <ButtonIcon as={isPlaying ? StopIcon : PlayIcon} />
        <ButtonText>{isPlaying ? 'Stop' : 'Play'}</ButtonText>
      </Button>
    </HStack>
  );
}
