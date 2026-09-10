import { Icon } from '@ui/icon';
import { Pressable } from '@ui/pressable';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { FingerprintIcon, Screen, WaveformIcon } from '@/components/shared';
import { PinPad } from '../components/pin-pad';
import {
  authenticateWithBiometrics,
  type BiometricKind,
  biometricLabel,
  getBiometricKind,
} from '../lib/biometrics';
import { PIN_LENGTH, verifyPin } from '../lib/pin';
import { useSecurityStore } from '../store';

/** Shown in place of the app until the PIN or a biometric check succeeds. */
export function LockScreen() {
  const unlock = useSecurityStore((state) => state.unlock);
  const biometricsEnabled = useSecurityStore((state) => state.biometricsEnabled);

  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState<BiometricKind>('none');

  useEffect(() => {
    void getBiometricKind().then(setKind);
  }, []);

  const tryBiometrics = async () => {
    const ok = await authenticateWithBiometrics('Unlock Voicegram');
    if (ok) unlock();
  };

  useEffect(() => {
    if (!biometricsEnabled || kind === 'none') return;
    void authenticateWithBiometrics('Unlock Voicegram').then((ok) => {
      if (ok) unlock();
    });
  }, [biometricsEnabled, kind, unlock]);

  useEffect(() => {
    if (pin.length !== PIN_LENGTH) return;

    void verifyPin(pin).then((ok) => {
      if (ok) {
        unlock();
        return;
      }
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError('Wrong PIN. Try again.');
      setPin('');
    });
  }, [pin, unlock]);

  return (
    <Screen edges="both">
      <VStack className="flex-1 items-center justify-center gap-10 px-6">
        <VStack className="items-center gap-3">
          <VStack className="h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Icon as={WaveformIcon} size="xl" className="text-primary" />
          </VStack>
          <Text size="xl" bold className="text-foreground">
            Voicegram is locked
          </Text>
          <Text size="sm" className="text-muted-foreground">
            {error ?? 'Enter your PIN to continue'}
          </Text>
        </VStack>

        <PinPad
          value={pin}
          onChange={(next) => {
            setError(null);
            setPin(next);
          }}
          accessory={
            biometricsEnabled && kind !== 'none' ? (
              <Pressable
                onPress={() => void tryBiometrics()}
                accessibilityRole="button"
                accessibilityLabel={`Unlock with ${biometricLabel(kind)}`}
                className="h-[72px] w-[72px] items-center justify-center rounded-full data-[active=true]:bg-secondary"
              >
                <Icon as={FingerprintIcon} size="lg" className="text-primary" />
              </Pressable>
            ) : null
          }
        />
      </VStack>
    </Screen>
  );
}
