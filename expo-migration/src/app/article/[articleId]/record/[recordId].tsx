import { RecordSettingsScreen } from '@features/records';
import { useLocalSearchParams } from 'expo-router';

export default function RecordRoute() {
  const { articleId, recordId } = useLocalSearchParams<{
    articleId: string;
    recordId: string;
  }>();
  return <RecordSettingsScreen articleId={articleId} recordId={recordId} />;
}
