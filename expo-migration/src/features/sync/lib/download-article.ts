import type { Article } from '@features/articles';
import { ensureArticleDirectory, recordFile } from '@/lib/audio-files';
import { fetchArticle, fetchArticleRecords } from '../api/remote-articles';
import { downloadRecordFile } from '../api/transfer';
import { fromRemoteArticle } from './mappers';

type ProgressReport = (progress: number, done: number, total: number) => void;

/**
 * Downloads one article: metadata, then every clip's audio into the library.
 *
 * Mirrors the original app's `downloadArticle` saga. A duplicate record has an
 * `origin`, and only the origin's object exists in storage — so each record's
 * bytes are pulled from its origin's path but written to its own local file,
 * exactly as the old app did.
 *
 * Returns the article ready to be inserted into the local library.
 */
export async function downloadArticle(
  uid: string,
  articleId: string,
  onProgress?: ProgressReport,
): Promise<Article | null> {
  const remote = await fetchArticle(uid, articleId);
  if (!remote) return null;

  const records = await fetchArticleRecords(articleId);
  const article = fromRemoteArticle(articleId, remote, records, Date.now());

  ensureArticleDirectory(articleId);

  const total = article.records.length;
  if (total === 0) {
    onProgress?.(1, 0, 0);
    return article;
  }

  const fractions = new Array<number>(total).fill(0);
  let done = 0;

  const report = () => {
    const sum = fractions.reduce((acc, value) => acc + value, 0);
    onProgress?.(sum / total, done, total);
  };

  for (const [index, record] of article.records.entries()) {
    const sourceId = record.originId ?? record.id;
    const destination = recordFile(articleId, record.id);

    try {
      await downloadRecordFile(
        uid,
        articleId,
        sourceId,
        destination.uri,
        ({ bytesTransferred, totalBytes }) => {
          fractions[index] = totalBytes > 0 ? bytesTransferred / totalBytes : 0;
          report();
        },
      );
    } catch {
      // One missing object must not abandon the rest of the article; the record
      // stays in the list and reads as 0 bytes until a later sync fixes it.
    }

    fractions[index] = 1;
    done += 1;
    report();
  }

  // Re-read the sizes actually written, so the library reports real usage.
  const withSizes = article.records.map((record) => {
    const file = recordFile(articleId, record.id);
    return { ...record, sizeBytes: file.exists ? file.size : 0 };
  });

  return { ...article, records: withSizes };
}
