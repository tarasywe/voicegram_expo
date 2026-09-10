/**
 * The on-device library. Lives in `@/stores` rather than inside the articles
 * feature because the sync feature writes to it too — keeping it here is what
 * stops `articles` and `sync` importing each other in a cycle.
 */

import {
  addRecord,
  insertRecordAfter,
  makeArticle,
  makeRecord,
  removeRecord,
  reorderRecords,
  replaceRecord,
  touch,
} from '@features/articles/lib/article-ops';
import type { Article, AudioRecord } from '@features/articles/types/article';
import { librarySnapshotSchema } from '@features/articles/types/library';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  adoptRecording,
  copyRecording,
  deleteArticleDirectory,
  deleteRecording,
  recordSize,
} from '@/lib/audio-files';
import { zustandStorage } from '@/lib/storage';
import { makeId } from '@/utils/id';

type NewRecordInput = {
  articleId: string;
  title: string;
  durationSec: number;
  /** Temp uri handed back by the recorder; moved into the library on save. */
  sourceUri: string;
};

type LibraryState = {
  articles: Article[];

  createArticle: (name: string) => string;
  renameArticle: (articleId: string, name: string) => void;
  updateArticle: (
    articleId: string,
    patch: Partial<Pick<Article, 'randomOrder' | 'loop' | 'isPublic'>>,
  ) => void;
  deleteArticle: (articleId: string) => void;

  /** Inserts (or replaces) an article downloaded from the cloud. */
  adoptArticle: (article: Article) => void;
  /** Records that the article now matches what is in the cloud. */
  markSynced: (articleId: string, syncedAt: number) => void;

  saveRecord: (input: NewRecordInput) => string | null;
  updateRecord: (
    articleId: string,
    recordId: string,
    patch: Partial<Omit<AudioRecord, 'id'>>,
  ) => void;
  duplicateRecord: (articleId: string, recordId: string) => string | null;
  deleteRecord: (articleId: string, recordId: string) => void;
  moveRecord: (articleId: string, from: number, to: number) => void;
};

const applyToArticle = (
  articles: Article[],
  articleId: string,
  transform: (article: Article) => Article,
) => articles.map((article) => (article.id === articleId ? transform(article) : article));

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      articles: [],

      createArticle: (name) => {
        const id = makeId();
        set((state) => ({
          articles: [makeArticle(id, name, Date.now()), ...state.articles],
        }));
        return id;
      },

      adoptArticle: (article) =>
        set((state) => {
          const exists = state.articles.some((entry) => entry.id === article.id);
          return {
            articles: exists
              ? state.articles.map((entry) => (entry.id === article.id ? article : entry))
              : [article, ...state.articles],
          };
        }),

      markSynced: (articleId, syncedAt) =>
        set((state) => ({
          articles: applyToArticle(state.articles, articleId, (article) => ({
            ...article,
            syncedAt,
          })),
        })),

      renameArticle: (articleId, name) =>
        set((state) => ({
          articles: applyToArticle(state.articles, articleId, (article) =>
            touch({ ...article, name: name.trim() }, Date.now()),
          ),
        })),

      updateArticle: (articleId, patch) =>
        set((state) => ({
          articles: applyToArticle(state.articles, articleId, (article) =>
            touch({ ...article, ...patch }, Date.now()),
          ),
        })),

      deleteArticle: (articleId) => {
        deleteArticleDirectory(articleId);
        set((state) => ({
          articles: state.articles.filter((article) => article.id !== articleId),
        }));
      },

      saveRecord: ({ articleId, title, durationSec, sourceUri }) => {
        const exists = get().articles.some((article) => article.id === articleId);
        if (!exists) return null;

        const recordId = makeId();
        adoptRecording(sourceUri, articleId, recordId);
        const record = makeRecord(
          recordId,
          title,
          durationSec,
          recordSize(articleId, recordId),
          Date.now(),
        );

        set((state) => ({
          articles: applyToArticle(state.articles, articleId, (article) =>
            addRecord(article, record, Date.now()),
          ),
        }));
        return recordId;
      },

      updateRecord: (articleId, recordId, patch) =>
        set((state) => ({
          articles: applyToArticle(state.articles, articleId, (article) =>
            replaceRecord(article, recordId, patch, Date.now()),
          ),
        })),

      duplicateRecord: (articleId, recordId) => {
        const article = get().articles.find((entry) => entry.id === articleId);
        const source = article?.records.find((entry) => entry.id === recordId);
        if (!article || !source) return null;

        const cloneId = makeId();
        copyRecording(articleId, recordId, cloneId);
        const clone = makeRecord(
          cloneId,
          `${source.title} (copy)`,
          source.durationSec,
          recordSize(articleId, cloneId),
          Date.now(),
          source.originId ?? source.id,
        );

        set((state) => ({
          articles: applyToArticle(state.articles, articleId, (entry) =>
            insertRecordAfter(entry, recordId, clone, Date.now()),
          ),
        }));
        return cloneId;
      },

      deleteRecord: (articleId, recordId) => {
        deleteRecording(articleId, recordId);
        set((state) => ({
          articles: applyToArticle(state.articles, articleId, (article) =>
            removeRecord(article, recordId, Date.now()),
          ),
        }));
      },

      moveRecord: (articleId, from, to) =>
        set((state) => ({
          articles: applyToArticle(state.articles, articleId, (article) =>
            reorderRecords(article, from, to, Date.now()),
          ),
        })),
    }),
    {
      name: 'voicegram.library',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ articles: state.articles }),
      /** A corrupted or older snapshot must not brick the app — start empty. */
      merge: (persisted, current) => {
        const parsed = librarySnapshotSchema.safeParse(persisted);
        return { ...current, articles: parsed.success ? parsed.data.articles : [] };
      },
    },
  ),
);
