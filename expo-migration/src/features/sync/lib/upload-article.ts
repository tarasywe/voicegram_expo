import type { Article } from '@features/articles';
import { recordFile } from '@/lib/audio-files';
import { uploadRecordFile, writeArticleMetadata } from '../api/transfer';
import { toRemoteArticle, toRemoteRecord } from './mappers';

type ProgressReport = (progress: number, done: number) => void;

/** Inlined rather than imported from the articles feature, to keep this
 *  feature free of a runtime dependency on it (see @/stores/library). */
const totalSizeBytes = (article: Article) =>
  article.records.reduce((total, record) => total + record.sizeBytes, 0);

/**
 * Uploads one article: metadata first, then every clip's audio.
 *
 * Mirrors the original app's `syncArticle` saga, but the per-record byte
 * progress is folded into a single 0–1 figure so the UI has one number to
 * show. A duplicate record shares its origin's audio file, so the same object
 * is uploaded under both ids — matching what the old app's download expects.
 */
export async function uploadArticle(
  uid: string,
  article: Article,
  onProgress?: ProgressReport,
): Promise<void> {
  const remoteRecords = article.records.map((record, index) =>
    toRemoteRecord(record, index),
  );

  await writeArticleMetadata(
    uid,
    article.id,
    toRemoteArticle(article, uid, totalSizeBytes(article)),
    remoteRecords,
  );

  const total = article.records.length;
  if (total === 0) {
    onProgress?.(1, 0);
    return;
  }

  // Each record contributes an equal slice of the bar; within its slice the
  // byte progress moves it smoothly.
  const fractions = new Array<number>(total).fill(0);
  let done = 0;

  const report = () => {
    const sum = fractions.reduce((acc, value) => acc + value, 0);
    onProgress?.(sum / total, done);
  };

  for (const [index, record] of article.records.entries()) {
    const sourceId = record.originId ?? record.id;
    const file = recordFile(article.id, sourceId);

    if (!file.exists) {
      // Nothing to upload for this row; count it so the bar still completes.
      fractions[index] = 1;
      done += 1;
      report();
      continue;
    }

    await uploadRecordFile(
      uid,
      article.id,
      record.id,
      file.uri,
      ({ bytesTransferred, totalBytes }) => {
        fractions[index] = totalBytes > 0 ? bytesTransferred / totalBytes : 0;
        report();
      },
    );

    fractions[index] = 1;
    done += 1;
    report();
  }
}
