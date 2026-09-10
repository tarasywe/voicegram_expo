import { AddIcon } from '@ui/icon';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList } from 'react-native';
import {
  ActionFab,
  EmptyState,
  PromptDialog,
  Screen,
  WaveformIcon,
} from '@/components/shared';
import { NAMING } from '@/config/constants';
import { links } from '@/config/links';
import { ArticleRow } from '../components/article-row';
import { LibrarySummary } from '../components/library-summary';
import { useArticles } from '../hooks/use-articles';
import { useLibraryStore } from '../store';

/**
 * Home tab. An article is the container everything else hangs off, so this is
 * the only place a new one can be created.
 */
export function ArticlesScreen() {
  const router = useRouter();
  const articles = useArticles();
  const createArticle = useLibraryStore((state) => state.createArticle);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = (name: string) => {
    setIsCreating(false);
    const articleId = createArticle(name);
    router.push(links.article(articleId));
  };

  return (
    <Screen edges="top">
      <VStack className="px-5 pt-2 pb-4">
        <Text size="3xl" bold className="text-foreground">
          Articles
        </Text>
        <Text size="sm" className="text-muted-foreground">
          Group your clips into an album, then play the whole thing back.
        </Text>
      </VStack>

      {articles.length > 0 ? <LibrarySummary articles={articles} /> : null}

      <FlatList
        data={articles}
        keyExtractor={(article) => article.id}
        contentContainerClassName="pb-32"
        ListEmptyComponent={
          <EmptyState
            icon={WaveformIcon}
            title="No articles yet"
            description="Create an article first — recordings live inside one."
          />
        }
        renderItem={({ item }) => (
          <ArticleRow
            article={item}
            onPress={() => router.push(links.article(item.id))}
            onSettingsPress={() => router.push(links.articleSettings(item.id))}
          />
        )}
      />

      <ActionFab
        icon={AddIcon}
        accessibilityLabel="New article"
        onPress={() => setIsCreating(true)}
      />

      <PromptDialog
        isOpen={isCreating}
        title="New article"
        description="Name the album your recordings will go into."
        placeholder="e.g. Morning affirmations"
        confirmLabel="Create"
        maxLength={NAMING.maxArticleName}
        onCancel={() => setIsCreating(false)}
        onConfirm={handleCreate}
      />
    </Screen>
  );
}
