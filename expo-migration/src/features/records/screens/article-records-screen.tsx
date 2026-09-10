import type { AudioRecord } from '@features/articles';
import { articleDurationSec, useArticle, useLibraryStore } from '@features/articles';
import { useArticlePlayer } from '@features/player';
import { RecordingSheet } from '@features/recorder';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import DragList, { type DragListRenderItemInfo } from 'react-native-draglist';
import { ActionFab, EmptyState, MicIcon, Screen } from '@/components/shared';
import { RECORDING } from '@/config/constants';
import { links } from '@/config/links';
import { ArticlePlayBar } from '../components/article-play-bar';
import { RecordRow } from '../components/record-row';

/**
 * The records inside one article: play them all, reorder by dragging, or
 * capture a new one. Reordering is only offered above a single record.
 */
export function ArticleRecordsScreen({ articleId }: { articleId: string }) {
  const router = useRouter();
  const article = useArticle(articleId);
  const moveRecord = useLibraryStore((state) => state.moveRecord);
  const saveRecord = useLibraryStore((state) => state.saveRecord);

  const [isRecording, setIsRecording] = useState(false);
  const player = useArticlePlayer(article);

  if (!article) {
    return (
      <Screen>
        <Text className="p-6 text-muted-foreground">This article no longer exists.</Text>
      </Screen>
    );
  }

  const isReorderable = article.records.length > 1;
  const isFull = article.records.length >= RECORDING.maxRecordsPerArticle;

  const renderItem = ({
    item,
    index,
    onDragStart,
    onDragEnd,
    isActive,
  }: DragListRenderItemInfo<AudioRecord>) => (
    <RecordRow
      record={item}
      index={index}
      isActive={player.currentRecordId === item.id}
      isDragging={isActive}
      {...(isReorderable ? { onDragStart, onDragEnd } : {})}
      onPress={() => router.push(links.record(article.id, item.id))}
    />
  );

  return (
    <Screen edges="bottom">
      <VStack className="px-5 pt-2 pb-4">
        <Text size="2xl" bold isTruncated className="text-foreground">
          {article.name}
        </Text>
        {isReorderable ? (
          <Text size="xs" className="text-muted-foreground">
            Drag the handle to change the playback order.
          </Text>
        ) : null}
      </VStack>

      <ArticlePlayBar
        recordCount={article.records.length}
        durationSec={articleDurationSec(article)}
        isPlaying={player.isPlaying}
        onToggle={player.toggle}
      />

      {isFull ? (
        <Text size="xs" className="mx-4 mb-3 text-warning">
          {`This article is full at ${RECORDING.maxRecordsPerArticle} records. Delete one to make room.`}
        </Text>
      ) : null}

      {article.records.length === 0 ? (
        <EmptyState
          icon={MicIcon}
          title="No recordings yet"
          description={`Tap the microphone to capture a clip of up to ${RECORDING.maxDurationSec} seconds.`}
        />
      ) : (
        <DragList
          data={article.records}
          keyExtractor={(record) => record.id}
          onReordered={(from, to) => moveRecord(article.id, from, to)}
          renderItem={renderItem}
          ListFooterComponent={<VStack className="h-32" />}
        />
      )}

      <ActionFab
        icon={MicIcon}
        tone="record"
        accessibilityLabel="Record a new clip"
        disabled={isFull}
        onPress={() => {
          player.stop();
          setIsRecording(true);
        }}
      />

      <RecordingSheet
        isOpen={isRecording}
        onClose={() => setIsRecording(false)}
        onSave={({ uri, durationSec, title }) => {
          saveRecord({ articleId: article.id, sourceUri: uri, durationSec, title });
        }}
      />
    </Screen>
  );
}
