import type { Article, AudioRecord } from '@features/articles';

export type QueueEntry = {
  record: AudioRecord;
  /** 1-based pass over this record; `repeat` copies are queued in a row. */
  pass: number;
  /** Seconds this entry occupies, including its trailing delay. */
  spanSec: number;
  /** Seconds of the whole run elapsed before this entry starts. */
  offsetSec: number;
};

function shuffle<T>(items: readonly T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = next[i];
    const b = next[j];
    if (a === undefined || b === undefined) continue;
    next[i] = b;
    next[j] = a;
  }
  return next;
}

/**
 * Flattens an article into the exact sequence of clips to play: disabled
 * records dropped, `repeat` expanded, order shuffled when `randomOrder` is on.
 * Each entry carries its own span and start offset so the UI can show progress
 * without re-deriving the timeline.
 */
export function buildQueue(article: Article): QueueEntry[] {
  const enabled = article.records.filter((record) => record.enabled);
  const ordered = article.randomOrder ? shuffle(enabled) : enabled;

  let offsetSec = 0;
  const queue: QueueEntry[] = [];

  for (const record of ordered) {
    const spanSec = record.durationSec + record.delaySec;
    for (let pass = 1; pass <= record.repeat; pass += 1) {
      queue.push({ record, pass, spanSec, offsetSec });
      offsetSec += spanSec;
    }
  }

  return queue;
}

/** Total run length of a queue, in seconds. */
export function queueDurationSec(queue: readonly QueueEntry[]): number {
  return queue.reduce((total, entry) => total + entry.spanSec, 0);
}
