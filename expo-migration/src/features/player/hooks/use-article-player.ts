import type { Article } from '@features/articles';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { useEffect, useRef, useState } from 'react';
import { recordUri } from '@/lib/audio-files';
import { buildQueue, type QueueEntry } from '../lib/build-queue';

type ArticlePlayerState = {
  isPlaying: boolean;
  /** Which record is audible right now — drives the row highlight. */
  currentRecordId: string | null;
  play: () => void;
  stop: () => void;
  toggle: () => void;
};

/**
 * Sequences an article: each enabled clip is played `repeat` times with its
 * `delaySec` of silence in between, then the run either ends or loops.
 *
 * A clip is played by a throwaway `AudioPlayer` so a mid-run stop can never
 * leave a half-released native player behind. Every run carries an id; a run
 * whose id is stale drops its callbacks instead of fighting the newer one.
 */
export function useArticlePlayer(article: Article | undefined): ArticlePlayerState {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);

  const runIdRef = useRef(0);
  const playerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const teardown = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (playerRef.current) {
      playerRef.current.remove();
      playerRef.current = null;
    }
  };

  const stop = () => {
    runIdRef.current += 1;
    teardown();
    setIsPlaying(false);
    setCurrentRecordId(null);
  };

  const play = () => {
    if (!article) return;
    const queue = buildQueue(article);
    if (queue.length === 0) return;

    runIdRef.current += 1;
    const runId = runIdRef.current;
    teardown();
    setIsPlaying(true);

    void setAudioModeAsync({ playsInSilentMode: true });

    const isStale = () => runId !== runIdRef.current;

    const playEntry = (index: number) => {
      if (isStale()) return;

      const entry: QueueEntry | undefined = queue[index];
      if (!entry) {
        if (article.loop) {
          playEntry(0);
          return;
        }
        stop();
        return;
      }

      setCurrentRecordId(entry.record.id);

      const sourceId = entry.record.originId ?? entry.record.id;
      const player = createAudioPlayer(recordUri(article.id, sourceId));
      playerRef.current = player;

      const advance = () => {
        if (isStale()) return;
        player.remove();
        if (playerRef.current === player) playerRef.current = null;

        const delayMs = entry.record.delaySec * 1000;
        if (delayMs > 0) {
          timerRef.current = setTimeout(() => playEntry(index + 1), delayMs);
        } else {
          playEntry(index + 1);
        }
      };

      const subscription = player.addListener('playbackStatusUpdate', (status) => {
        if (!status.didJustFinish) return;
        subscription.remove();
        advance();
      });

      player.play();
    };

    playEntry(0);
  };

  const toggle = () => {
    if (isPlaying) stop();
    else play();
  };

  // Silence the run on unmount without depending on `stop`'s identity.
  useEffect(
    () => () => {
      runIdRef.current += 1;
      if (timerRef.current) clearTimeout(timerRef.current);
      playerRef.current?.remove();
      timerRef.current = null;
      playerRef.current = null;
    },
    [],
  );

  return { isPlaying, currentRecordId, play, stop, toggle };
}
