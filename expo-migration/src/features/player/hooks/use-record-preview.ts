import type { AudioRecord } from '@features/articles';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { useEffect, useRef, useState } from 'react';
import { recordUri } from '@/lib/audio-files';

type RecordPreviewState = {
  isPlaying: boolean;
  toggle: () => void;
  stop: () => void;
};

/** Plays one clip once, ignoring its repeat/delay settings. */
export function useRecordPreview(
  articleId: string | undefined,
  record: AudioRecord | undefined,
): RecordPreviewState {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);

  const stop = () => {
    playerRef.current?.remove();
    playerRef.current = null;
    setIsPlaying(false);
  };

  const toggle = () => {
    if (isPlaying) {
      stop();
      return;
    }
    if (!articleId || !record) return;

    void setAudioModeAsync({ playsInSilentMode: true });

    const player = createAudioPlayer(recordUri(articleId, record.originId ?? record.id));
    playerRef.current = player;
    setIsPlaying(true);

    const subscription = player.addListener('playbackStatusUpdate', (status) => {
      if (!status.didJustFinish) return;
      subscription.remove();
      stop();
    });

    player.play();
  };

  useEffect(
    () => () => {
      playerRef.current?.remove();
      playerRef.current = null;
    },
    [],
  );

  return { isPlaying, toggle, stop };
}
