import { HStack } from '@ui/hstack';
import { Icon } from '@ui/icon';
import { Pressable } from '@ui/pressable';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { CloudDownloadIcon } from '@/components/shared';
import { formatBytes } from '@/utils/format';
import { useTransfer } from '../store';
import type { CloudArticle } from '../types/remote';
import { TransferBar } from './transfer-bar';

type CloudArticleRowProps = {
  article: CloudArticle;
  onDownload: () => void;
};

/** An article that exists in the cloud but is not on this device yet. */
export function CloudArticleRow({ article, onDownload }: CloudArticleRowProps) {
  const transfer = useTransfer(article.id);
  const isBusy = transfer !== undefined && transfer.error === null;

  return (
    <Pressable
      onPress={onDownload}
      disabled={isBusy}
      accessibilityRole="button"
      accessibilityLabel={`Download ${article.name}`}
      className="mx-4 mb-3 rounded-2xl border border-dashed border-border bg-card data-[active=true]:bg-accent data-[disabled=true]:opacity-70"
    >
      <VStack className="gap-3 p-4">
        <HStack className="items-center gap-3">
          <VStack className="h-11 w-11 items-center justify-center rounded-xl bg-secondary">
            <Icon as={CloudDownloadIcon} size="md" className="text-muted-foreground" />
          </VStack>

          <VStack className="flex-1 gap-1">
            <Text size="md" bold isTruncated className="text-foreground">
              {article.name}
            </Text>
            <Text size="xs" className="text-muted-foreground">
              {`In the cloud · ${formatBytes(article.size)}`}
            </Text>
          </VStack>

          {isBusy ? null : (
            <Text size="xs" bold className="uppercase tracking-wider text-primary">
              Download
            </Text>
          )}
        </HStack>

        {transfer ? <TransferBar transfer={transfer} /> : null}
      </VStack>
    </Pressable>
  );
}
