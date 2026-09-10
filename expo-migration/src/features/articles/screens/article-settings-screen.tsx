import { GlobeIcon, PlayIcon, RepeatIcon, TrashIcon } from '@ui/icon';
import { Switch } from '@ui/switch';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import {
  ConfirmDialog,
  PromptDialog,
  Screen,
  SectionLabel,
  SettingsGroup,
  SettingsRow,
} from '@/components/shared';
import { NAMING } from '@/config/constants';
import { links } from '@/config/links';
import { useLibraryStore } from '@/stores/library';
import { formatBytes, formatDuration, pluralize } from '@/utils/format';
import { useArticle } from '../hooks/use-articles';
import { articleDurationSec, articleSizeBytes } from '../lib/article-stats';

/** Per-article playback flags plus the destructive rename/remove actions. */
export function ArticleSettingsScreen({ articleId }: { articleId: string }) {
  const router = useRouter();
  const article = useArticle(articleId);
  const updateArticle = useLibraryStore((state) => state.updateArticle);
  const renameArticle = useLibraryStore((state) => state.renameArticle);
  const deleteArticle = useLibraryStore((state) => state.deleteArticle);

  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!article) {
    return (
      <Screen>
        <Text className="p-6 text-muted-foreground">This article no longer exists.</Text>
      </Screen>
    );
  }

  const handleDelete = () => {
    setIsDeleting(false);
    deleteArticle(article.id);
    router.dismissTo(links.articles);
  };

  return (
    <Screen>
      <ScrollView contentContainerClassName="pb-10">
        <VStack className="items-center gap-1 px-6 pt-4 pb-2">
          <Text size="2xl" bold className="text-center text-foreground">
            {article.name}
          </Text>
          <Text size="sm" className="text-muted-foreground">
            {[
              pluralize(article.records.length, 'record'),
              formatDuration(articleDurationSec(article)),
              formatBytes(articleSizeBytes(article)),
            ].join(' · ')}
          </Text>
        </VStack>

        <SectionLabel>Playback</SectionLabel>
        <SettingsGroup>
          <SettingsRow
            label="Shuffle"
            description="Play the records in a random order"
            icon={PlayIcon}
            accessory={
              <Switch
                value={article.randomOrder}
                onValueChange={(randomOrder) =>
                  updateArticle(article.id, { randomOrder })
                }
              />
            }
          />
          <SettingsRow
            label="Loop"
            description="Start again when the article ends"
            icon={RepeatIcon}
            accessory={
              <Switch
                value={article.loop}
                onValueChange={(loop) => updateArticle(article.id, { loop })}
              />
            }
          />
        </SettingsGroup>

        <SectionLabel>Sharing</SectionLabel>
        <SettingsGroup>
          <SettingsRow
            label="Make public"
            description="Publish this article once you are signed in"
            icon={GlobeIcon}
            accessory={
              <Switch
                value={article.isPublic}
                onValueChange={(isPublic) => updateArticle(article.id, { isPublic })}
              />
            }
          />
        </SettingsGroup>

        <SectionLabel>Manage</SectionLabel>
        <SettingsGroup>
          <SettingsRow label="Rename" showChevron onPress={() => setIsRenaming(true)} />
          <SettingsRow
            label="Delete article"
            icon={TrashIcon}
            destructive
            onPress={() => setIsDeleting(true)}
          />
        </SettingsGroup>
      </ScrollView>

      <PromptDialog
        isOpen={isRenaming}
        title="Rename article"
        placeholder="Article name"
        initialValue={article.name}
        maxLength={NAMING.maxArticleName}
        onCancel={() => setIsRenaming(false)}
        onConfirm={(name) => {
          setIsRenaming(false);
          renameArticle(article.id, name);
        }}
      />

      <ConfirmDialog
        isOpen={isDeleting}
        title="Delete article?"
        message={`“${article.name}” and its ${pluralize(
          article.records.length,
          'recording',
        )} will be removed from this device. This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onCancel={() => setIsDeleting(false)}
        onConfirm={handleDelete}
      />
    </Screen>
  );
}
