import { create } from 'zustand';

export type PlaybackStatus = 'idle' | 'playing' | 'paused';

type PlaybackState = {
  status: PlaybackStatus;
  /** The article being played, or null when nothing is loaded. */
  articleId: string | null;
  articleName: string;
  /** Which record is audible right now — drives the row highlight. */
  currentRecordId: string | null;
  elapsedSec: number;
  totalSec: number;
};

type PlaybackActions = {
  /** Internal — the playback engine owns these; screens use the engine. */
  reset: () => void;
  load: (articleId: string, articleName: string, totalSec: number) => void;
  patch: (next: Partial<PlaybackState>) => void;
};

const initial: PlaybackState = {
  status: 'idle',
  articleId: null,
  articleName: '',
  currentRecordId: null,
  elapsedSec: 0,
  totalSec: 0,
};

/**
 * Playback outlives the article screen, so its state cannot live in a hook —
 * leaving the screen must not silence the audio. The engine in
 * `lib/playback-engine.ts` writes here; components only read.
 */
export const usePlaybackStore = create<PlaybackState & PlaybackActions>()((set) => ({
  ...initial,
  reset: () => set(initial),
  load: (articleId, articleName, totalSec) =>
    set({ articleId, articleName, totalSec, elapsedSec: 0, currentRecordId: null }),
  patch: (next) => set(next),
}));

/** True when this specific article is the one loaded in the player. */
export const useIsArticleLoaded = (articleId: string | undefined) =>
  usePlaybackStore((state) => state.articleId === articleId && state.status !== 'idle');
