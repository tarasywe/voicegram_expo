import { HStack } from '@ui/hstack';
import { ChevronRightIcon, Icon, RepeatIcon, SettingsIcon } from '@ui/icon';
import { Pressable } from '@ui/pressable';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { ShuffleIcon, WaveformIcon } from '@/components/shared';
import { formatBytes, formatDuration, pluralize } from '@/utils/format';
import { articleDurationSec, articleSizeBytes } from '../lib/article-stats';
import type { Article } from '../types/article';

type ArticleRowProps = {
  article: Article;
  onPress: () => void;
  onSettingsPress: () => void;
};

export function ArticleRow({ article, onPress, onSettingsPress }: ArticleRowProps) {
  const subtitle = [
    pluralize(article.records.length, 'record'),
    formatDuration(articleDurationSec(article)),
    formatBytes(articleSizeBytes(article)),
  ].join(' · ');

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={[
        `Open ${article.name}`,
        article.randomOrder ? 'shuffle on' : null,
        article.loop ? 'loop on' : null,
      ]
        .filter(Boolean)
        .join(', ')}
      className="mx-4 mb-3 rounded-2xl border border-border bg-card data-[active=true]:bg-accent"
    >
      <HStack className="items-center gap-3 p-4">
        <VStack className="h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
          <Icon as={WaveformIcon} size="md" className="text-primary" />
        </VStack>

        <VStack className="flex-1 gap-1">
          <HStack className="items-center gap-1.5">
            <Text size="md" bold isTruncated className="flex-shrink text-foreground">
              {article.name}
            </Text>
            {article.randomOrder ? (
              <Icon as={ShuffleIcon} size="2xs" className="text-primary" />
            ) : null}
            {article.loop ? (
              <Icon as={RepeatIcon} size="2xs" className="text-primary" />
            ) : null}
          </HStack>
          <Text size="xs" className="text-muted-foreground">
            {subtitle}
          </Text>
        </VStack>

        <Pressable
          onPress={onSettingsPress}
          accessibilityRole="button"
          accessibilityLabel={`Settings for ${article.name}`}
          hitSlop={12}
          className="h-9 w-9 items-center justify-center rounded-full data-[active=true]:bg-secondary"
        >
          <Icon as={SettingsIcon} size="sm" className="text-muted-foreground" />
        </Pressable>

        <Icon as={ChevronRightIcon} size="sm" className="text-muted-foreground" />
      </HStack>
    </Pressable>
  );
}
