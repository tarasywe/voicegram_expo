import { useLibraryStore } from '../store';
import type { Article } from '../types/article';

export function useArticles(): Article[] {
  return useLibraryStore((state) => state.articles);
}

export function useArticle(articleId: string | undefined): Article | undefined {
  return useLibraryStore((state) =>
    articleId ? state.articles.find((article) => article.id === articleId) : undefined,
  );
}

export function useRecord(articleId: string | undefined, recordId: string | undefined) {
  return useLibraryStore((state) => {
    if (!articleId || !recordId) return undefined;
    const article = state.articles.find((entry) => entry.id === articleId);
    return article?.records.find((record) => record.id === recordId);
  });
}
