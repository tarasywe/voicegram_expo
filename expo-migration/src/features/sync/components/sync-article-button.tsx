import type { Article } from '@features/articles';
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '@ui/button';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { CloudUploadIcon } from '@/components/shared';
import { useIsAuthenticated } from '@/stores/auth';
import { useUploadArticle } from '../mutations';
import { useTransfer } from '../store';
import { TransferBar } from './transfer-bar';

/**
 * The article screen's sync control. Signed out it explains itself rather than
 * disappearing, so the feature is discoverable before you have an account.
 */
export function SyncArticleButton({ article }: { article: Article }) {
  const isAuthenticated = useIsAuthenticated();
  const upload = useUploadArticle();
  const transfer = useTransfer(article.id);
  const isBusy = transfer !== undefined && transfer.error === null;

  if (!isAuthenticated) {
    return (
      <Text size="xs" className="px-1 text-muted-foreground">
        Sign in on the Profile tab to sync this article to the cloud.
      </Text>
    );
  }

  const syncedLabel = article.syncedAt
    ? `Last synced ${new Date(article.syncedAt).toLocaleDateString()}`
    : 'Not synced yet';

  return (
    <VStack className="gap-2">
      <Button
        onPress={() => upload.mutate(article)}
        isDisabled={isBusy || article.records.length === 0}
        variant="outline"
        size="lg"
        className="rounded-full"
      >
        {isBusy ? <ButtonSpinner /> : <ButtonIcon as={CloudUploadIcon} />}
        <ButtonText>{isBusy ? 'Syncing…' : 'Sync to cloud'}</ButtonText>
      </Button>

      {transfer ? (
        <TransferBar transfer={transfer} />
      ) : (
        <Text size="xs" className="px-1 text-muted-foreground">
          {article.records.length === 0
            ? 'Record something first — there is nothing to sync yet.'
            : syncedLabel}
        </Text>
      )}
    </VStack>
  );
}
