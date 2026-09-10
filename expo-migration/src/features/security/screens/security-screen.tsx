import { Switch } from '@ui/switch';
import { Text } from '@ui/text';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import {
  ConfirmDialog,
  FingerprintIcon,
  KeypadIcon,
  Screen,
  SectionLabel,
  SettingsGroup,
  SettingsRow,
} from '@/components/shared';
import { SetPinDialog } from '../components/set-pin-dialog';
import { type BiometricKind, biometricLabel, getBiometricKind } from '../lib/biometrics';
import { clearPin } from '../lib/pin';
import { useSecurityStore } from '../store';

/** PIN and biometric unlock. Biometrics are only offered once a PIN exists. */
export function SecurityScreen() {
  const pinEnabled = useSecurityStore((state) => state.pinEnabled);
  const biometricsEnabled = useSecurityStore((state) => state.biometricsEnabled);
  const setPinEnabled = useSecurityStore((state) => state.setPinEnabled);
  const setBiometricsEnabled = useSecurityStore((state) => state.setBiometricsEnabled);

  const [kind, setKind] = useState<BiometricKind>('none');
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [isRemovingPin, setIsRemovingPin] = useState(false);

  useEffect(() => {
    void getBiometricKind().then(setKind);
  }, []);

  const removePin = () => {
    setIsRemovingPin(false);
    void clearPin();
    setPinEnabled(false);
  };

  return (
    <Screen>
      <ScrollView contentContainerClassName="pb-10">
        <SectionLabel>App lock</SectionLabel>
        <SettingsGroup>
          <SettingsRow
            label="PIN code"
            description={
              pinEnabled ? 'Required every time the app opens' : 'Not set up yet'
            }
            icon={KeypadIcon}
            accessory={
              <Switch
                value={pinEnabled}
                onValueChange={(next) =>
                  next ? setIsSettingPin(true) : setIsRemovingPin(true)
                }
              />
            }
          />
          {pinEnabled ? (
            <SettingsRow
              label="Change PIN"
              showChevron
              onPress={() => setIsSettingPin(true)}
            />
          ) : null}
          <SettingsRow
            label={biometricLabel(kind)}
            description={
              kind === 'none'
                ? 'No biometrics enrolled on this device'
                : 'Unlock without typing your PIN'
            }
            icon={FingerprintIcon}
            accessory={
              <Switch
                value={biometricsEnabled}
                isDisabled={!pinEnabled || kind === 'none'}
                onValueChange={setBiometricsEnabled}
              />
            }
          />
        </SettingsGroup>

        <Text size="xs" className="px-6 pt-4 text-muted-foreground">
          Your PIN is stored in the device keychain, never in the app's own storage, and
          never leaves this device.
        </Text>
      </ScrollView>

      <SetPinDialog
        isOpen={isSettingPin}
        onCancel={() => setIsSettingPin(false)}
        onDone={() => {
          setIsSettingPin(false);
          setPinEnabled(true);
        }}
      />

      <ConfirmDialog
        isOpen={isRemovingPin}
        title="Turn off PIN?"
        message="Anyone with this device will be able to open Voicegram and your recordings."
        confirmLabel="Turn off"
        destructive
        onCancel={() => setIsRemovingPin(false)}
        onConfirm={removePin}
      />
    </Screen>
  );
}
