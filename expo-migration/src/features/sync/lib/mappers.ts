import type { Article, AudioRecord } from '@features/articles';
import { PLAYBACK } from '@/config/constants';
import type { RemoteArticle, RemoteRecord } from '../types/remote';

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** Local record → the row shape `records/{rid}` expects. */
export function toRemoteRecord(record: AudioRecord, position: number): RemoteRecord {
  return {
    id: record.id,
    title: record.title,
    duration: record.durationSec,
    size: record.sizeBytes,
    position,
    repeat: record.repeat,
    delay: record.delaySec,
    enable: record.enabled,
    ...(record.originId ? { origin: record.originId } : {}),
  };
}

/** `records/{rid}` → a local record. Out-of-range settings are clamped. */
export function fromRemoteRecord(remote: RemoteRecord, now: number): AudioRecord {
  return {
    id: remote.id,
    title: remote.title,
    durationSec: Math.max(0, remote.duration),
    sizeBytes: Math.max(0, Math.round(remote.size)),
    enabled: remote.enable,
    repeat: clamp(Math.round(remote.repeat), PLAYBACK.minRepeat, PLAYBACK.maxRepeat),
    delaySec: clamp(Math.round(remote.delay), PLAYBACK.minDelaySec, PLAYBACK.maxDelaySec),
    createdAt: now,
    ...(remote.origin ? { originId: remote.origin } : {}),
  };
}

/**
 * Local article → the row shape `users/{uid}/articles/{aid}` expects.
 *
 * The write replaces the whole row, so every field the remote shape carries has
 * to be present — `shared` included, or publishing would be silently switched
 * off for an article that had it on.
 */
export function toRemoteArticle(
  article: Article,
  uid: string,
  sizeBytes: number,
): RemoteArticle & { author: string } {
  return {
    name: article.name,
    random: article.randomOrder,
    repeat: article.loop,
    size: sizeBytes,
    author: uid,
    shared: article.isPublic,
  };
}

/**
 * Remote article + its records → a local article. `position` decides order,
 * because the remote shape stores order as a field rather than as an array.
 */
export function fromRemoteArticle(
  id: string,
  remote: RemoteArticle,
  records: RemoteRecord[],
  now: number,
): Article {
  const ordered = [...records].sort((a, b) => a.position - b.position);

  return {
    id,
    name: remote.name,
    records: ordered.map((record) => fromRemoteRecord(record, now)),
    randomOrder: remote.random,
    loop: remote.repeat,
    isPublic: remote.shared ?? false,
    syncedAt: now,
    createdAt: now,
    updatedAt: now,
  };
}
