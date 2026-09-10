import { ArticleRecordsScreen } from '@features/records';
import { useLocalSearchParams } from 'expo-router';

export default function ArticleRoute() {
  const { articleId } = useLocalSearchParams<{ articleId: string }>();
  return <ArticleRecordsScreen articleId={articleId} />;
}
