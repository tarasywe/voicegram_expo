import type { Article } from '@features/articles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '@/stores/auth';
import { useLibraryStore } from '@/stores/library';
import { downloadArticle } from './lib/download-article';
import { uploadArticle } from './lib/upload-article';
import { syncKeys } from './queries';
import { useSyncStore } from './store';

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong.';

/** Uploads a local article to the cloud, reporting progress as it goes. */
export function useUploadArticle() {
  const user = useCurrentUser();
  const queryClient = useQueryClient();
  const markSynced = useLibraryStore((state) => state.markSynced);
  const { begin, setProgress, fail, finish } = useSyncStore.getState();

  return useMutation({
    mutationKey: ['sync', 'upload'],
    mutationFn: async (article: Article) => {
      if (!user) throw new Error('Sign in to sync this article.');

      begin(article.id, 'upload', article.records.length);
      try {
        await uploadArticle(user.uid, article, (progress, done) =>
          setProgress(article.id, progress, done),
        );
      } catch (error) {
        fail(article.id, errorMessage(error));
        throw error;
      }
      return article.id;
    },
    onSuccess: (articleId) => {
      markSynced(articleId, Date.now());
      finish(articleId);
      if (user) {
        void queryClient.invalidateQueries({ queryKey: syncKeys.articles(user.uid) });
      }
    },
  });
}

/** Pulls a cloud article — metadata and audio — into the local library. */
export function useDownloadArticle() {
  const user = useCurrentUser();
  const adoptArticle = useLibraryStore((state) => state.adoptArticle);
  const { begin, setProgress, fail, finish } = useSyncStore.getState();

  return useMutation({
    mutationKey: ['sync', 'download'],
    mutationFn: async (articleId: string) => {
      if (!user) throw new Error('Sign in to download this article.');

      begin(articleId, 'download', 0);
      try {
        const article = await downloadArticle(
          user.uid,
          articleId,
          (progress, done, total) => {
            setProgress(articleId, progress, done);
            if (total > 0) {
              useSyncStore.setState((state) => {
                const current = state.transfers[articleId];
                if (!current || current.total === total) return state;
                return {
                  transfers: { ...state.transfers, [articleId]: { ...current, total } },
                };
              });
            }
          },
        );
        if (!article) throw new Error('That article is no longer in the cloud.');
        return article;
      } catch (error) {
        fail(articleId, errorMessage(error));
        throw error;
      }
    },
    onSuccess: (article) => {
      adoptArticle(article);
      finish(article.id);
    },
  });
}
