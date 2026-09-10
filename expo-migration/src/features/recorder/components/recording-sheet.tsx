import { Button, ButtonText } from '@ui/button';
import { HStack } from '@ui/hstack';
import { Icon } from '@ui/icon';
import { Modal, ModalBackdrop, ModalBody, ModalContent } from '@ui/modal';
import { Pressable } from '@ui/pressable';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { useEffect, useRef, useState } from 'react';
import { MicIcon, PromptDialog, StopIcon } from '@/components/shared';
import { NAMING, RECORDING } from '@/config/constants';
import { formatDuration } from '@/utils/format';
import { useClipRecorder } from '../hooks/use-clip-recorder';
import { RecordingPulse } from './recording-pulse';

type RecordingSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clip: { uri: string; durationSec: number; title: string }) => void;
};

/**
 * The full capture flow in one modal: tap to record, auto-stop at the 15s cap,
 * then name the clip. Closing before naming discards the take.
 */
export function RecordingSheet({ isOpen, onClose, onSave }: RecordingSheetProps) {
  const { status, elapsedSec, secondsLeft, clip, start, stop, reset } = useClipRecorder();
  const [isNaming, setIsNaming] = useState(false);
  /** Guards against a re-render restarting the take mid-recording. */
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Opening the sheet *is* the intent to record — no second tap needed.
    if (!isOpen) {
      hasStartedRef.current = false;
      return;
    }
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    void start();
  }, [isOpen, start]);

  useEffect(() => {
    if (status === 'captured' && clip) setIsNaming(true);
  }, [status, clip]);

  const dismiss = () => {
    setIsNaming(false);
    void reset();
    onClose();
  };

  const confirmName = (title: string) => {
    if (!clip) return;
    setIsNaming(false);
    onSave({ uri: clip.uri, durationSec: clip.durationSec, title });
    void reset();
    onClose();
  };

  const isRecording = status === 'recording';
  const isNearLimit = secondsLeft <= 5;

  return (
    <>
      <Modal isOpen={isOpen && !isNaming} onClose={dismiss} size="lg">
        <ModalBackdrop />
        <ModalContent className="rounded-3xl border-border bg-card">
          <ModalBody className="my-2">
            <VStack className="items-center gap-4 py-4">
              <Text
                size="sm"
                bold
                className="uppercase tracking-widest text-muted-foreground"
              >
                {status === 'denied' ? 'Microphone blocked' : 'Recording'}
              </Text>

              {status === 'denied' ? (
                <Text size="sm" className="px-6 text-center text-muted-foreground">
                  Voicegram needs microphone access to capture a clip. Enable it in your
                  device settings and try again.
                </Text>
              ) : (
                <>
                  <RecordingPulse active={isRecording}>
                    <Pressable
                      onPress={() => void stop()}
                      disabled={!isRecording}
                      accessibilityRole="button"
                      accessibilityLabel="Stop recording"
                      className="h-28 w-28 items-center justify-center rounded-full bg-record data-[active=true]:opacity-90 data-[disabled=true]:opacity-50"
                    >
                      <Icon
                        as={isRecording ? StopIcon : MicIcon}
                        size="xl"
                        className="text-record-foreground"
                      />
                    </Pressable>
                  </RecordingPulse>

                  <VStack className="items-center gap-1">
                    <Text size="3xl" bold className="text-foreground">
                      {formatDuration(elapsedSec)}
                    </Text>
                    <Text
                      size="sm"
                      className={
                        isNearLimit ? 'text-destructive' : 'text-muted-foreground'
                      }
                    >
                      {isRecording
                        ? `${secondsLeft}s left`
                        : `Up to ${RECORDING.maxDurationSec}s per clip`}
                    </Text>
                  </VStack>
                </>
              )}

              <HStack className="w-full gap-2 px-2 pt-2">
                <Button variant="outline" onPress={dismiss} className="flex-1">
                  <ButtonText>Cancel</ButtonText>
                </Button>
                <Button
                  onPress={() => void stop()}
                  isDisabled={!isRecording}
                  className="flex-1"
                >
                  <ButtonText>Done</ButtonText>
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <PromptDialog
        isOpen={isNaming}
        title="Name this recording"
        description={clip ? `Captured ${formatDuration(clip.durationSec)}.` : undefined}
        placeholder="e.g. Intro line"
        confirmLabel="Save"
        maxLength={NAMING.maxRecordName}
        onCancel={dismiss}
        onConfirm={confirmName}
      />
    </>
  );
}
