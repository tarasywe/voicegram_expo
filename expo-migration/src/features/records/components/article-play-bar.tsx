import { Button, ButtonIcon, ButtonText } from '@ui/button';
import { HStack } from '@ui/hstack';
import { PlayIcon } from '@ui/icon';
import { Progress, ProgressFilledTrack } from '@ui/progress';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { PauseIcon, StopIcon } from '@/components/shared';
import { formatDuration, pluralize } from '@/utils/format';

type ArticlePlayBarProps = {
  recordCount: number;
  durationSec: number;
  isPlaying: boolean;
  isPaused: boolean;
  /** 0–1 across the whole run; only rendered while playing. */
  progress: number;
  elapsedSec: number;
  onToggle: () => void;
  onStop: () => void;
};

/** Header strip of the article screen: what's inside, and one big play control. */
export function ArticlePlayBar({
  recordCount,
  durationSec,
  isPlaying,
  isPaused,
  progress,
  elapsedSec,
  onToggle,
  onStop,
}: ArticlePlayBarProps) {
  const isLoaded = isPlaying || isPaused;
  return (
    <VStack className="mx-4 mb-4 gap-3 rounded-2xl bg-surface p-4">
      <HStack className="items-center gap-4">
        <VStack className="flex-1 gap-0.5">
          <Text size="lg" bold className="text-foreground">
            {isLoaded
              ? `${formatDuration(elapsedSec)} / ${formatDuration(durationSec)}`
              : formatDuration(durationSec)}
          </Text>
          <Text size="xs" className="uppercase tracking-wider text-muted-foreground">
            {pluralize(recordCount, 'record')}
          </Text>
        </VStack>

        <HStack className="items-center gap-2">
          {isLoaded ? (
            <Button
              onPress={onStop}
              variant="secondary"
              size="lg"
              className="rounded-full px-4"
              accessibilityLabel="Stop playback"
            >
              <ButtonIcon as={StopIcon} />
            </Button>
          ) : null}

          <Button
            onPress={onToggle}
            isDisabled={recordCount === 0}
            variant={isPlaying ? 'secondary' : 'default'}
            size="lg"
            className="rounded-full px-6"
          >
            <ButtonIcon as={isPlaying ? PauseIcon : PlayIcon} />
            <ButtonText>{isPlaying ? 'Pause' : isPaused ? 'Resume' : 'Play'}</ButtonText>
          </Button>
        </HStack>
      </HStack>

      {isLoaded ? (
        <Progress
          value={Math.round(Math.min(1, Math.max(0, progress)) * 100)}
          className="h-1.5 bg-border"
        >
          <ProgressFilledTrack className="bg-primary" />
        </Progress>
      ) : null}
    </VStack>
  );
}
