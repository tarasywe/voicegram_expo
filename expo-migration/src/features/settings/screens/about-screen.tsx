import { Icon } from '@ui/icon';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import Constants from 'expo-constants';
import { Linking, ScrollView } from 'react-native';
import {
  Screen,
  SectionLabel,
  SettingsGroup,
  SettingsRow,
  WaveformIcon,
} from '@/components/shared';
import { RECORDING } from '@/config/constants';

const PRIVACY_URL = 'https://voicegram.app/privacy';

export function AboutScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const runtime = Constants.expoConfig?.runtimeVersion;

  return (
    <Screen>
      <ScrollView contentContainerClassName="pb-10">
        <VStack className="items-center gap-3 px-6 pt-6 pb-2">
          <VStack className="h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
            <Icon as={WaveformIcon} size="xl" className="text-primary" />
          </VStack>
          <Text size="2xl" bold className="text-foreground">
            Voicegram
          </Text>
          <Text size="sm" className="px-4 text-center text-muted-foreground">
            {`Record clips of up to ${RECORDING.maxDurationSec} seconds, arrange them into an article, and play the whole thing back — repeats, pauses and all.`}
          </Text>
        </VStack>

        <SectionLabel>App</SectionLabel>
        <SettingsGroup>
          <SettingsRow
            label="Version"
            accessory={
              <Text size="sm" className="text-muted-foreground">
                {version}
              </Text>
            }
          />
          <SettingsRow
            label="Runtime"
            accessory={
              <Text size="sm" className="text-muted-foreground">
                {typeof runtime === 'string' ? runtime : version}
              </Text>
            }
          />
          <SettingsRow
            label="Privacy policy"
            showChevron
            onPress={() => void Linking.openURL(PRIVACY_URL)}
          />
        </SettingsGroup>

        <Text size="xs" className="px-6 pt-6 text-muted-foreground">
          Recordings stay on this device until you sign in and choose to sync them.
        </Text>
      </ScrollView>
    </Screen>
  );
}
