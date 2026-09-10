import type { Article } from '@features/articles';
import * as engine from '../lib/playback-engine';
import { usePlaybackStore } from '../store';

type ArticlePlayerState = {
  /** True only while *this* article is the one playing. */
  isPlaying: boolean;
  isPaused: boolean;
  currentRecordId: string | null;
  /** 0–1 across the whole run; 0 when another article is loaded. */
  progress: number;
  elapsedSec: number;
  totalSec: number;
  play: () => void;
  stop: () => void;
  toggle: () => void;
};

/**
 * Binds a screen to the shared playback engine. Deliberately does *not* stop
 * playback on unmount — leaving the article keeps the audio going, and the
 * now-playing bar takes over the controls.
 */
export function useArticlePlayer(article: Article | undefined): ArticlePlayerState {
  const status = usePlaybackStore((state) => state.status);
  const loadedId = usePlaybackStore((state) => state.articleId);
  const currentRecordId = usePlaybackStore((state) => state.currentRecordId);
  const elapsedSec = usePlaybackStore((state) => state.elapsedSec);
  const totalSec = usePlaybackStore((state) => state.totalSec);

  const isThisArticle = article !== undefined && loadedId === article.id;

  return {
    isPlaying: isThisArticle && status === 'playing',
    isPaused: isThisArticle && status === 'paused',
    currentRecordId: isThisArticle ? currentRecordId : null,
    progress: isThisArticle && totalSec > 0 ? Math.min(1, elapsedSec / totalSec) : 0,
    elapsedSec: isThisArticle ? elapsedSec : 0,
    totalSec: isThisArticle ? totalSec : 0,
    play: () => {
      if (article) engine.play(article);
    },
    stop: engine.stop,
    toggle: () => {
      if (article) engine.toggle(article);
    },
  };
}
