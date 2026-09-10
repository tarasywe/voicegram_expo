import { useQuery } from '@tanstack/react-query';
import { useCurrentUser } from '@/stores/auth';
import { useLibraryStore } from '@/stores/library';
import { fetchUserArticles } from './api/remote-articles';
import type { CloudArticle } from './types/remote';

export const syncKeys = {
  all: ['sync'] as const,
  articles: (uid: string) => ['sync', 'articles', uid] as const,
};

/**
 * Every article the signed-in account owns in the cloud, each flagged with
 * whether it is already on this device. Reads only — downloads live in
 * `mutations.ts`.
 */
export function useCloudArticles() {
  const user = useCurrentUser();
  const local = useLibraryStore((state) => state.articles);

  const query = useQuery({
    queryKey: syncKeys.articles(user?.uid ?? 'anonymous'),
    queryFn: () => fetchUserArticles(user?.uid ?? ''),
    enabled: Boolean(user?.uid),
    staleTime: 60_000,
  });

  const localIds = new Set(local.map((article) => article.id));
  const articles: CloudArticle[] = (query.data ?? []).map((article) => ({
    ...article,
    isOnDevice: localIds.has(article.id),
  }));

  return { ...query, articles };
}

/** Cloud articles that have not been downloaded to this device yet. */
export function useCloudOnlyArticles(): CloudArticle[] {
  const { articles } = useCloudArticles();
  return articles.filter((article) => !article.isOnDevice);
}
