import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { Link } from 'expo-router';
import { Screen } from '@/components/shared';
import { links } from '@/config/links';

export function NotFoundScreen() {
  return (
    <Screen edges="both">
      <VStack className="flex-1 items-center justify-center gap-3 px-8">
        <Text size="xl" bold className="text-foreground">
          Nothing here
        </Text>
        <Text size="sm" className="text-center text-muted-foreground">
          That screen does not exist any more.
        </Text>
        <Link href={links.articles}>
          <Text size="md" bold className="text-primary">
            Back to Articles
          </Text>
        </Link>
      </VStack>
    </Screen>
  );
}
