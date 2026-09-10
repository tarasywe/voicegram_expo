import { Button, ButtonText } from '@ui/button';
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter } from '@ui/modal';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { useEffect, useState } from 'react';
import { PIN_LENGTH, setPin } from '../lib/pin';
import { PinPad } from './pin-pad';

type SetPinDialogProps = {
  isOpen: boolean;
  onCancel: () => void;
  onDone: () => void;
};

/** Two-step PIN setup: choose, then confirm. Mismatches restart the flow. */
export function SetPinDialog({ isOpen, onCancel, onDone }: SetPinDialogProps) {
  const [step, setStep] = useState<'choose' | 'confirm'>('choose');
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) return;
    setStep('choose');
    setFirst('');
    setSecond('');
    setError(null);
  }, [isOpen]);

  useEffect(() => {
    if (step !== 'choose' || first.length !== PIN_LENGTH) return;
    setStep('confirm');
  }, [step, first]);

  useEffect(() => {
    if (step !== 'confirm' || second.length !== PIN_LENGTH) return;

    if (second !== first) {
      setError('Those did not match. Start again.');
      setStep('choose');
      setFirst('');
      setSecond('');
      return;
    }

    void setPin(second).then((ok) => {
      if (ok) onDone();
      else setError('Could not save that PIN.');
    });
  }, [step, second, first, onDone]);

  const value = step === 'choose' ? first : second;
  const onChange = step === 'choose' ? setFirst : setSecond;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="lg">
      <ModalBackdrop />
      <ModalContent className="rounded-3xl border-border bg-card">
        <ModalBody className="my-2">
          <VStack className="items-center gap-6 py-2">
            <VStack className="items-center gap-1">
              <Text size="lg" bold className="text-foreground">
                {step === 'choose' ? 'Choose a PIN' : 'Confirm your PIN'}
              </Text>
              <Text
                size="sm"
                className={error ? 'text-destructive' : 'text-muted-foreground'}
              >
                {error ?? `${PIN_LENGTH} digits`}
              </Text>
            </VStack>

            <PinPad
              value={value}
              onChange={(next) => {
                setError(null);
                onChange(next);
              }}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onPress={onCancel} className="flex-1">
            <ButtonText>Cancel</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
