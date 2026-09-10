import { HStack } from '@ui/hstack';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { formatBytes } from '@/utils/format';
import { articleSizeBytes } from '../lib/article-stats';
import type { Article } from '../types/article';

/** One-line "what's in the library" strip under the Articles header. */
export function LibrarySummary({ articles }: { articles: Article[] }) {
  const records = articles.reduce((total, article) => total + article.records.length, 0);
  const bytes = articles.reduce((total, article) => total + articleSizeBytes(article), 0);

  return (
    <HStack className="mx-4 mb-4 gap-3 rounded-2xl bg-surface px-4 py-3">
      <Stat label="Articles" value={String(articles.length)} />
      <Divider />
      <Stat label="Records" value={String(records)} />
      <Divider />
      <Stat label="On device" value={formatBytes(bytes)} />
    </HStack>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <VStack className="flex-1 gap-0.5">
      <Text size="lg" bold className="text-foreground">
        {value}
      </Text>
      <Text size="2xs" className="uppercase tracking-wider text-muted-foreground">
        {label}
      </Text>
    </VStack>
  );
}

function Divider() {
  return <VStack className="w-px self-stretch bg-border" />;
}
