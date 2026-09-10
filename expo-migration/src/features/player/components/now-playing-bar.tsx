import { HStack } from '@ui/hstack';
import { CloseIcon, Icon, PlayIcon } from '@ui/icon';
import { Pressable } from '@ui/pressable';
import { Progress, ProgressFilledTrack } from '@ui/progress';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { PauseIcon } from '@/components/shared';
import { formatDuration } from '@/utils/format';
import * as engine from '../lib/playback-engine';
import { usePlaybackStore } from '../store';

type NowPlayingBarProps = {
  /** Tapping the body opens the article it belongs to. */
  onPress?: (articleId: string) => void;
};

/**
 * Sits above the article list while something is playing, so a run can be
 * paused or stopped without opening the article. Renders nothing when the
 * player is idle, which is what makes Stop dismiss it.
 */
export function NowPlayingBar({ onPress }: NowPlayingBarProps) {
  const status = usePlaybackStore((state) => state.status);
  const articleId = usePlaybackStore((state) => state.articleId);
  const articleName = usePlaybackStore((state) => state.articleName);
  const elapsedSec = usePlaybackStore((state) => state.elapsedSec);
  const totalSec = usePlaybackStore((state) => state.totalSec);

  if (status === 'idle' || !articleId) return null;

  const isPlaying = status === 'playing';
  const percent = totalSec > 0 ? Math.round(Math.min(1, elapsedSec / totalSec) * 100) : 0;

  return (
    <VStack className="mx-4 mb-3 overflow-hidden rounded-2xl bg-linear-to-r from-primary to-info shadow-lg">
      <HStack className="items-center gap-3 p-3">
        <Pressable
          onPress={() => onPress?.(articleId)}
          accessibilityRole="button"
          accessibilityLabel={`Open ${articleName}`}
          className="flex-1"
        >
          <VStack className="gap-0.5">
            <Text size="sm" bold isTruncated className="text-primary-foreground">
              {articleName}
            </Text>
            <Text size="xs" className="text-primary-foreground/80">
              {`${formatDuration(elapsedSec)} / ${formatDuration(totalSec)}`}
            </Text>
          </VStack>
        </Pressable>

        <Pressable
          onPress={() => (isPlaying ? engine.pause() : engine.resume())}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pause' : 'Resume'}
          hitSlop={8}
          className="h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20 data-[active=true]:bg-primary-foreground/30"
        >
          <Icon
            as={isPlaying ? PauseIcon : PlayIcon}
            size="sm"
            className="text-primary-foreground"
          />
        </Pressable>

        <Pressable
          onPress={engine.stop}
          accessibilityRole="button"
          accessibilityLabel="Stop playback"
          hitSlop={8}
          className="h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20 data-[active=true]:bg-primary-foreground/30"
        >
          <Icon as={CloseIcon} size="sm" className="text-primary-foreground" />
        </Pressable>
      </HStack>

      <Progress value={percent} className="h-1 rounded-none bg-primary-foreground/25">
        <ProgressFilledTrack className="bg-primary-foreground" />
      </Progress>
    </VStack>
  );
}
