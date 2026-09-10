import { Button, ButtonText } from '@ui/button';
import { Heading } from '@ui/heading';
import { Input, InputField } from '@ui/input';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@ui/modal';
import { Text } from '@ui/text';
import { useEffect, useState } from 'react';

type PromptDialogProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  placeholder: string;
  initialValue?: string;
  confirmLabel?: string;
  maxLength: number;
  onCancel: () => void;
  onConfirm: (value: string) => void;
};

/**
 * Single-field naming dialog — new article, rename article, name a new record.
 * Confirm stays disabled until the trimmed value is non-empty.
 */
export function PromptDialog({
  isOpen,
  title,
  description,
  placeholder,
  initialValue = '',
  confirmLabel = 'Save',
  maxLength,
  onCancel,
  onConfirm,
}: PromptDialogProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (isOpen) setValue(initialValue);
  }, [isOpen, initialValue]);

  const trimmed = value.trim();
  const submit = () => {
    if (trimmed.length === 0) return;
    onConfirm(trimmed);
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} avoidKeyboard size="md">
      <ModalBackdrop />
      <ModalContent className="rounded-2xl border-border bg-card">
        <ModalHeader>
          <Heading size="md" className="text-foreground">
            {title}
          </Heading>
        </ModalHeader>
        <ModalBody>
          {description ? (
            <Text size="sm" className="mb-3 text-muted-foreground">
              {description}
            </Text>
          ) : null}
          <Input className="border-input bg-background">
            <InputField
              value={value}
              onChangeText={setValue}
              placeholder={placeholder}
              maxLength={maxLength}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={submit}
              className="text-foreground"
            />
          </Input>
        </ModalBody>
        <ModalFooter className="gap-2">
          <Button variant="outline" onPress={onCancel} className="flex-1">
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button onPress={submit} isDisabled={trimmed.length === 0} className="flex-1">
            <ButtonText>{confirmLabel}</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
