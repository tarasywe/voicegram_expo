import { z } from 'zod';
import { articleSchema } from './article';

/** Shape persisted to MMKV by the zustand `persist` middleware. */
export const librarySnapshotSchema = z.object({
  articles: z.array(articleSchema),
});

export type LibrarySnapshot = z.infer<typeof librarySnapshotSchema>;
