import { Directory, File, Paths } from 'expo-file-system';

const ROOT = 'articles';
const EXTENSION = 'm4a';

function articleDirectory(articleId: string): Directory {
  return new Directory(Paths.document, ROOT, articleId);
}

/** Creates `documents/articles/<articleId>/` if it is not there yet. */
export function ensureArticleDirectory(articleId: string): Directory {
  const dir = articleDirectory(articleId);
  if (!dir.exists) dir.create({ intermediates: true });
  return dir;
}

export function recordFile(articleId: string, recordId: string): File {
  return new File(articleDirectory(articleId), `${recordId}.${EXTENSION}`);
}

export function recordUri(articleId: string, recordId: string): string {
  return recordFile(articleId, recordId).uri;
}

/** `0` when the clip is missing — callers treat that as "not downloaded yet". */
export function recordSize(articleId: string, recordId: string): number {
  const file = recordFile(articleId, recordId);
  return file.exists ? file.size : 0;
}

/** Moves a freshly captured clip from the recorder's temp uri into the library. */
export function adoptRecording(
  sourceUri: string,
  articleId: string,
  recordId: string,
): void {
  ensureArticleDirectory(articleId);
  const source = new File(sourceUri);
  const destination = recordFile(articleId, recordId);
  if (destination.exists) destination.delete();
  source.moveSync(destination);
}

/** Used by "duplicate" — a copy shares the audio but gets its own settings. */
export function copyRecording(
  articleId: string,
  sourceRecordId: string,
  targetRecordId: string,
): void {
  const source = recordFile(articleId, sourceRecordId);
  if (!source.exists) return;
  source.copySync(recordFile(articleId, targetRecordId));
}

export function deleteRecording(articleId: string, recordId: string): void {
  const file = recordFile(articleId, recordId);
  if (file.exists) file.delete();
}

export function deleteArticleDirectory(articleId: string): void {
  const dir = articleDirectory(articleId);
  if (dir.exists) dir.delete();
}
