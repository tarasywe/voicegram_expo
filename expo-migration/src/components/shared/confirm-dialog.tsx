import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@ui/alert-dialog';
import { Button, ButtonText } from '@ui/button';
import { Heading } from '@ui/heading';
import { Text } from '@ui/text';

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  destructive = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog isOpen={isOpen} onClose={onCancel} size="md">
      <AlertDialogBackdrop />
      <AlertDialogContent className="rounded-2xl border-border bg-card">
        <AlertDialogHeader>
          <Heading size="md" className="text-foreground">
            {title}
          </Heading>
        </AlertDialogHeader>
        <AlertDialogBody className="mt-2 mb-4">
          <Text size="sm" className="text-muted-foreground">
            {message}
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter className="gap-2">
          <Button variant="outline" onPress={onCancel} className="flex-1">
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            variant={destructive ? 'destructive' : 'default'}
            onPress={onConfirm}
            className="flex-1"
          >
            <ButtonText>{confirmLabel}</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
