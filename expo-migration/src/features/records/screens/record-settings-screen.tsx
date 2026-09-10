import { useLibraryStore, useRecord } from '@features/articles';
import { useRecordPreview } from '@features/player';
import { Button, ButtonIcon, ButtonText } from '@ui/button';
import { ClockIcon, CopyIcon, PlayIcon, RepeatIcon, TrashIcon } from '@ui/icon';
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
  Stepper,
  StopIcon,
} from '@/components/shared';
import { NAMING, PLAYBACK } from '@/config/constants';
import { formatBytes, formatDuration } from '@/utils/format';

type RecordSettingsScreenProps = {
  articleId: string;
  recordId: string;
};

/** Everything a single clip can do: preview, tune, rename, duplicate, delete. */
export function RecordSettingsScreen({ articleId, recordId }: RecordSettingsScreenProps) {
  const router = useRouter();
  const record = useRecord(articleId, recordId);
  const updateRecord = useLibraryStore((state) => state.updateRecord);
  const deleteRecord = useLibraryStore((state) => state.deleteRecord);
  const duplicateRecord = useLibraryStore((state) => state.duplicateRecord);

  const preview = useRecordPreview(articleId, record);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!record) {
    return (
      <Screen>
        <Text className="p-6 text-muted-foreground">
          This recording no longer exists.
        </Text>
      </Screen>
    );
  }

  const handleDelete = () => {
    setIsDeleting(false);
    preview.stop();
    deleteRecord(articleId, record.id);
    router.back();
  };

  const handleDuplicate = () => {
    preview.stop();
    duplicateRecord(articleId, record.id);
    router.back();
  };

  return (
    <Screen>
      <ScrollView contentContainerClassName="pb-10">
        <VStack className="items-center gap-1 px-6 pt-4 pb-2">
          <Text size="2xl" bold className="text-center text-foreground">
            {record.title}
          </Text>
          <Text size="sm" className="text-muted-foreground">
            {`${formatDuration(record.durationSec)} · ${formatBytes(record.sizeBytes)}`}
          </Text>
        </VStack>

        <VStack className="px-4 pt-4">
          <Button
            onPress={preview.toggle}
            variant={preview.isPlaying ? 'secondary' : 'default'}
            size="lg"
            className="rounded-full"
          >
            <ButtonIcon as={preview.isPlaying ? StopIcon : PlayIcon} />
            <ButtonText>{preview.isPlaying ? 'Stop' : 'Play'}</ButtonText>
          </Button>
        </VStack>

        <SectionLabel>Playback</SectionLabel>
        <SettingsGroup>
          <SettingsRow
            label="Include in article"
            description="Skip this clip without deleting it"
            accessory={
              <Switch
                value={record.enabled}
                onValueChange={(enabled) =>
                  updateRecord(articleId, record.id, { enabled })
                }
              />
            }
          />
          <SettingsRow
            label="Repeats"
            description="How many times in a row this clip plays"
            icon={RepeatIcon}
            accessory={
              <Stepper
                label="repeats"
                value={record.repeat}
                min={PLAYBACK.minRepeat}
                max={PLAYBACK.maxRepeat}
                onChange={(repeat) => updateRecord(articleId, record.id, { repeat })}
              />
            }
          />
          <SettingsRow
            label="Delay"
            description="Silence added after this clip"
            icon={ClockIcon}
            accessory={
              <Stepper
                label="delay"
                value={record.delaySec}
                min={PLAYBACK.minDelaySec}
                max={PLAYBACK.maxDelaySec}
                options={PLAYBACK.delayOptionsSec}
                suffix="s"
                onChange={(delaySec) => updateRecord(articleId, record.id, { delaySec })}
              />
            }
          />
        </SettingsGroup>

        <SectionLabel>Manage</SectionLabel>
        <SettingsGroup>
          <SettingsRow label="Rename" showChevron onPress={() => setIsRenaming(true)} />
          <SettingsRow
            label="Duplicate"
            description="Copy the audio with fresh settings"
            icon={CopyIcon}
            onPress={handleDuplicate}
          />
          <SettingsRow
            label="Delete recording"
            icon={TrashIcon}
            destructive
            onPress={() => setIsDeleting(true)}
          />
        </SettingsGroup>
      </ScrollView>

      <PromptDialog
        isOpen={isRenaming}
        title="Rename recording"
        placeholder="Recording name"
        initialValue={record.title}
        maxLength={NAMING.maxRecordName}
        onCancel={() => setIsRenaming(false)}
        onConfirm={(title) => {
          setIsRenaming(false);
          updateRecord(articleId, record.id, { title });
        }}
      />

      <ConfirmDialog
        isOpen={isDeleting}
        title="Delete recording?"
        message={`“${record.title}” will be removed from this article. This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onCancel={() => setIsDeleting(false)}
        onConfirm={handleDelete}
      />
    </Screen>
  );
}
