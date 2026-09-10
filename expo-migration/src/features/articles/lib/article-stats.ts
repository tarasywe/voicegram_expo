import type { Article, AudioRecord } from '../types/article';

/** Total bytes held by an article's clips. */
export function articleSizeBytes(article: Article): number {
  return article.records.reduce((total, record) => total + record.sizeBytes, 0);
}

/** How long one clip takes to play, including its repeats and trailing delay. */
export function recordPlaybackSec(record: AudioRecord): number {
  return (record.durationSec + record.delaySec) * record.repeat;
}

/** How long a full run of the article takes, skipping disabled clips. */
export function articleDurationSec(article: Article): number {
  return article.records
    .filter((record) => record.enabled)
    .reduce((total, record) => total + recordPlaybackSec(record), 0);
}

export function enabledRecords(article: Article): AudioRecord[] {
  return article.records.filter((record) => record.enabled);
}
