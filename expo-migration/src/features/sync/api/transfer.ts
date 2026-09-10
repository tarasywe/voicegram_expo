import { ref as dbRef, remove, set } from '@react-native-firebase/database';
import {
  deleteObject,
  putFile,
  ref as storageRef,
  writeToFile,
} from '@react-native-firebase/storage';
import { firebaseDb, firebaseStorage } from '@/lib/firebase';
import type { RemoteArticle, RemoteRecord } from '../types/remote';
import { dbPaths, storagePaths } from './paths';

export type TransferProgress = {
  bytesTransferred: number;
  totalBytes: number;
};

/** Writes the article row and its record index + settings. */
export async function writeArticleMetadata(
  uid: string,
  aid: string,
  article: RemoteArticle & { author: string },
  records: RemoteRecord[],
): Promise<void> {
  await set(dbRef(firebaseDb, dbPaths.userArticle(uid, aid)), article);

  await Promise.all(
    records.map(async (record) => {
      await set(dbRef(firebaseDb, dbPaths.record(record.id)), record);
      await set(dbRef(firebaseDb, `${dbPaths.articleRecords(aid)}/${record.id}`), {
        id: record.id,
        title: record.title,
      });
    }),
  );
}

/** Patches a single field on the remote article row, e.g. `random`. */
export async function updateArticleField(
  uid: string,
  aid: string,
  field: string,
  value: unknown,
): Promise<void> {
  await set(dbRef(firebaseDb, `${dbPaths.userArticle(uid, aid)}/${field}`), value);
}

/** Uploads one clip, reporting byte progress as it goes. */
export function uploadRecordFile(
  uid: string,
  aid: string,
  rid: string,
  localPath: string,
  onProgress?: (progress: TransferProgress) => void,
): Promise<void> {
  const task = putFile(
    storageRef(firebaseStorage, storagePaths.record(uid, aid, rid)),
    localPath,
  );

  task.on('state_changed', (snapshot) => {
    onProgress?.({
      bytesTransferred: snapshot.bytesTransferred,
      totalBytes: snapshot.totalBytes,
    });
  });

  return Promise.resolve(task).then(() => undefined);
}

/** Downloads one clip to `localPath`, reporting byte progress as it goes. */
export function downloadRecordFile(
  uid: string,
  aid: string,
  rid: string,
  localPath: string,
  onProgress?: (progress: TransferProgress) => void,
): Promise<void> {
  const task = writeToFile(
    storageRef(firebaseStorage, storagePaths.record(uid, aid, rid)),
    localPath,
  );

  task.on('state_changed', (snapshot) => {
    onProgress?.({
      bytesTransferred: snapshot.bytesTransferred,
      totalBytes: snapshot.totalBytes,
    });
  });

  return Promise.resolve(task).then(() => undefined);
}

/** Removes an article and its records from the database and from storage. */
export async function deleteRemoteArticle(
  uid: string,
  aid: string,
  recordIds: string[],
): Promise<void> {
  await remove(dbRef(firebaseDb, dbPaths.article(aid)));
  await remove(dbRef(firebaseDb, dbPaths.userArticle(uid, aid)));

  await Promise.all(
    recordIds.map(async (rid) => {
      await remove(dbRef(firebaseDb, dbPaths.record(rid)));
      try {
        await deleteObject(
          storageRef(firebaseStorage, storagePaths.record(uid, aid, rid)),
        );
      } catch {
        // The object may already be gone; the database rows are what matter.
      }
    }),
  );
}
