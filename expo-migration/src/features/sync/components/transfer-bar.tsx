import { Progress, ProgressFilledTrack } from '@ui/progress';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import type { TransferState } from '../store';

/** Inline progress for one article's upload or download. */
export function TransferBar({ transfer }: { transfer: TransferState }) {
  const percent = Math.round(transfer.progress * 100);
  const verb = transfer.kind === 'upload' ? 'Uploading' : 'Downloading';

  if (transfer.error) {
    return (
      <Text size="xs" className="text-destructive">
        {transfer.error}
      </Text>
    );
  }

  return (
    <VStack className="gap-1.5">
      <Text size="xs" className="text-muted-foreground">
        {transfer.total > 0
          ? `${verb} ${transfer.done}/${transfer.total} · ${percent}%`
          : `${verb}…`}
      </Text>
      <Progress value={percent} className="h-1.5 bg-border">
        <ProgressFilledTrack className="bg-primary" />
      </Progress>
    </VStack>
  );
}
