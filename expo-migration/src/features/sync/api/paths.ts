/**
 * Remote layout, kept byte-compatible with the original app so articles synced
 * by it still download. Realtime Database:
 *
 *   users/{uid}/articles/{aid}   article metadata (name, random, repeat, size)
 *   articles/{aid}/records/{rid} record index for an article
 *   records/{rid}                the record's own settings
 *
 * Storage:
 *
 *   {uid}/{aid}/records/{rid}    the audio file
 */
export const dbPaths = {
  user: (uid: string) => `users/${uid}`,
  userArticles: (uid: string) => `users/${uid}/articles`,
  userArticle: (uid: string, aid: string) => `users/${uid}/articles/${aid}`,
  articleRecords: (aid: string) => `articles/${aid}/records`,
  article: (aid: string) => `articles/${aid}`,
  record: (rid: string) => `records/${rid}`,
} as const;

export const storagePaths = {
  record: (uid: string, aid: string, rid: string) => `${uid}/${aid}/records/${rid}`,
} as const;
