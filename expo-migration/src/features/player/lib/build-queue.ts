import type { Article, AudioRecord } from '@features/articles';

export type QueueEntry = {
  record: AudioRecord;
  /** 1-based pass over this record; `repeat` copies are queued in a row. */
  pass: number;
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
 */
export function buildQueue(article: Article): QueueEntry[] {
  const enabled = article.records.filter((record) => record.enabled);
  const ordered = article.randomOrder ? shuffle(enabled) : enabled;

  return ordered.flatMap((record) =>
    Array.from({ length: record.repeat }, (_, index) => ({
      record,
      pass: index + 1,
    })),
  );
}
