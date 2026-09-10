import { PLAYBACK } from '@/config/constants';
import { moveItem } from '@/utils/array';
import type { Article, AudioRecord } from '../types/article';

/** Pure transforms over the library. The store owns persistence and file I/O. */

export function makeArticle(id: string, name: string, now: number): Article {
  return {
    id,
    name: name.trim(),
    records: [],
    randomOrder: false,
    loop: false,
    isPublic: false,
    syncedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

export function makeRecord(
  id: string,
  title: string,
  durationSec: number,
  sizeBytes: number,
  now: number,
  originId?: string,
): AudioRecord {
  return {
    id,
    title: title.trim(),
    durationSec,
    sizeBytes,
    enabled: true,
    repeat: PLAYBACK.minRepeat,
    delaySec: PLAYBACK.minDelaySec,
    createdAt: now,
    ...(originId ? { originId } : {}),
  };
}

export function touch(article: Article, now: number): Article {
  return { ...article, updatedAt: now };
}

export function addRecord(article: Article, record: AudioRecord, now: number): Article {
  return touch({ ...article, records: [...article.records, record] }, now);
}

export function replaceRecord(
  article: Article,
  recordId: string,
  patch: Partial<AudioRecord>,
  now: number,
): Article {
  const records = article.records.map((record) =>
    record.id === recordId ? { ...record, ...patch, id: record.id } : record,
  );
  return touch({ ...article, records }, now);
}

export function removeRecord(article: Article, recordId: string, now: number): Article {
  return touch(
    { ...article, records: article.records.filter((r) => r.id !== recordId) },
    now,
  );
}

export function reorderRecords(
  article: Article,
  from: number,
  to: number,
  now: number,
): Article {
  return touch({ ...article, records: moveItem(article.records, from, to) }, now);
}

export function insertRecordAfter(
  article: Article,
  afterRecordId: string,
  record: AudioRecord,
  now: number,
): Article {
  const index = article.records.findIndex((r) => r.id === afterRecordId);
  if (index === -1) return addRecord(article, record, now);
  const records = [...article.records];
  records.splice(index + 1, 0, record);
  return touch({ ...article, records }, now);
}
