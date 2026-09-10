import { ArticleSettingsScreen } from '@features/articles';
import { useLocalSearchParams } from 'expo-router';

export default function ArticleSettingsRoute() {
  const { articleId } = useLocalSearchParams<{ articleId: string }>();
  return <ArticleSettingsScreen articleId={articleId} />;
}
