import type { Article } from '@features/articles';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { RECORDING } from '@/config/constants';
import { recordUri } from '@/lib/audio-files';
import { usePlaybackStore } from '../store';
import { buildQueue, type QueueEntry, queueDurationSec } from './build-queue';

type Player = ReturnType<typeof createAudioPlayer>;

/**
 * Module-level playback, deliberately outside React.
 *
 * A run must survive the article screen unmounting — the user can leave the
 * article and keep listening, driven from the now-playing bar — so the audio
 * players and timers are held here and only the resulting state is pushed into
 * the store.
 *
 * Every run carries an id; callbacks belonging to a superseded run drop out
 * instead of fighting the newer one.
 */

let runId = 0;
let queue: QueueEntry[] = [];
let index = 0;
let player: Player | null = null;
let ticker: ReturnType<typeof setInterval> | null = null;
let delayTimer: ReturnType<typeof setTimeout> | null = null;
/** Seconds of the run completed before the current entry started. */
let entryOffsetSec = 0;
/** When paused mid-silence, how much of the delay was still to run. */
let pendingDelayMs = 0;
let delayStartedAt = 0;
let loopArticle = false;
let articleId: string | null = null;

const store = () => usePlaybackStore.getState();

function clearTicker() {
  if (!ticker) return;
  clearInterval(ticker);
  ticker = null;
}

function clearDelay() {
  if (!delayTimer) return;
  clearTimeout(delayTimer);
  delayTimer = null;
}

function releasePlayer() {
  player?.remove();
  player = null;
}

function startTicker() {
  clearTicker();
  ticker = setInterval(() => {
    const played = player?.currentTime ?? 0;
    store().patch({ elapsedSec: entryOffsetSec + played });
  }, RECORDING.statusIntervalMs);
}

function playEntry(currentRun: number, at: number) {
  if (currentRun !== runId) return;

  const entry = queue[at];
  if (!entry) {
    if (loopArticle) {
      entryOffsetSec = 0;
      store().patch({ elapsedSec: 0 });
      playEntry(currentRun, 0);
      return;
    }
    stop();
    return;
  }

  index = at;
  entryOffsetSec = entry.offsetSec;
  store().patch({ currentRecordId: entry.record.id, status: 'playing' });

  if (!articleId) return;
  const sourceId = entry.record.originId ?? entry.record.id;
  const next = createAudioPlayer(recordUri(articleId, sourceId));
  player = next;

  const advance = () => {
    if (currentRun !== runId) return;
    next.remove();
    if (player === next) player = null;

    // Hold the readout at the clip's end through its silent tail.
    entryOffsetSec = entry.offsetSec + entry.record.durationSec;

    const delayMs = entry.record.delaySec * 1000;
    if (delayMs > 0) {
      pendingDelayMs = delayMs;
      delayStartedAt = Date.now();
      delayTimer = setTimeout(() => playEntry(currentRun, at + 1), delayMs);
    } else {
      playEntry(currentRun, at + 1);
    }
  };

  const subscription = next.addListener('playbackStatusUpdate', (status) => {
    if (!status.didJustFinish) return;
    subscription.remove();
    advance();
  });

  next.play();
}

/** Starts (or restarts) an article from the beginning. */
export function play(article: Article): void {
  const built = buildQueue(article);
  if (built.length === 0) return;

  runId += 1;
  clearTicker();
  clearDelay();
  releasePlayer();

  queue = built;
  loopArticle = article.loop;
  articleId = article.id;
  entryOffsetSec = 0;
  pendingDelayMs = 0;

  store().load(article.id, article.name, queueDurationSec(built));
  void setAudioModeAsync({ playsInSilentMode: true });

  startTicker();
  playEntry(runId, 0);
}

export function pause(): void {
  if (store().status !== 'playing') return;

  clearTicker();
  if (delayTimer) {
    // Preserve what is left of the silence so resume does not restart it.
    pendingDelayMs = Math.max(0, pendingDelayMs - (Date.now() - delayStartedAt));
    clearDelay();
  }
  player?.pause();
  store().patch({ status: 'paused' });
}

export function resume(): void {
  if (store().status !== 'paused') return;

  store().patch({ status: 'playing' });
  startTicker();

  if (player) {
    player.play();
    return;
  }

  // Paused during a delay: run out the remainder, then carry on.
  const currentRun = runId;
  delayStartedAt = Date.now();
  delayTimer = setTimeout(() => playEntry(currentRun, index + 1), pendingDelayMs);
}

export function stop(): void {
  runId += 1;
  clearTicker();
  clearDelay();
  releasePlayer();
  queue = [];
  index = 0;
  entryOffsetSec = 0;
  pendingDelayMs = 0;
  articleId = null;
  store().reset();
}

/** Play/pause for the article currently loaded; starts it if it is not. */
export function toggle(article: Article): void {
  const { status, articleId: loadedId } = store();

  if (loadedId !== article.id || status === 'idle') {
    play(article);
    return;
  }
  if (status === 'playing') pause();
  else resume();
}
