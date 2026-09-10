import { get, ref } from '@react-native-firebase/database';
import { firebaseDb } from '@/lib/firebase';
import {
  type RemoteArticle,
  type RemoteRecord,
  remoteArticleSchema,
  remoteRecordIndexSchema,
  remoteRecordSchema,
} from '../types/remote';
import { dbPaths } from './paths';

const readValue = async (path: string): Promise<unknown> => {
  const snapshot = await get(ref(firebaseDb, path));
  return snapshot.val();
};

/**
 * Every article the account owns, keyed by id. Rows that fail to parse are
 * skipped rather than failing the whole listing — this data was written by an
 * older app and one bad row should not hide the rest.
 */
export async function fetchUserArticles(
  uid: string,
): Promise<Array<RemoteArticle & { id: string }>> {
  const raw = await readValue(dbPaths.userArticles(uid));
  if (!raw || typeof raw !== 'object') return [];

  return Object.entries(raw as Record<string, unknown>).flatMap(([id, value]) => {
    const parsed = remoteArticleSchema.safeParse(value);
    return parsed.success ? [{ ...parsed.data, id }] : [];
  });
}

export async function fetchArticle(
  uid: string,
  aid: string,
): Promise<RemoteArticle | null> {
  const parsed = remoteArticleSchema.safeParse(
    await readValue(dbPaths.userArticle(uid, aid)),
  );
  return parsed.success ? parsed.data : null;
}

/** Record ids belonging to an article, from the `articles/{aid}/records` index. */
export async function fetchArticleRecordIds(aid: string): Promise<string[]> {
  const parsed = remoteRecordIndexSchema.safeParse(
    await readValue(dbPaths.articleRecords(aid)),
  );
  return parsed.success ? Object.keys(parsed.data) : [];
}

/** Full settings for one record, or `null` when the row is missing/corrupt. */
export async function fetchRecord(rid: string): Promise<RemoteRecord | null> {
  const raw = await readValue(dbPaths.record(rid));
  if (!raw || typeof raw !== 'object') return null;

  // The id lives in the key, not always in the row.
  const parsed = remoteRecordSchema.safeParse({ id: rid, ...(raw as object) });
  return parsed.success ? parsed.data : null;
}

/** All records of an article, skipping any that cannot be read. */
export async function fetchArticleRecords(aid: string): Promise<RemoteRecord[]> {
  const ids = await fetchArticleRecordIds(aid);
  const records = await Promise.all(ids.map(fetchRecord));
  return records.filter((record): record is RemoteRecord => record !== null);
}
