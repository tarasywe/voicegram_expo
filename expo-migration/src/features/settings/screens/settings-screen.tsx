import { useSecurityStore } from '@features/security';
import { InfoIcon, LockIcon, MoonIcon } from '@ui/icon';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import {
  LanguageIcon,
  Screen,
  SectionLabel,
  SettingsGroup,
  SettingsRow,
} from '@/components/shared';
import { links } from '@/config/links';
import { useThemeStore } from '@/theme';
import { languageLabel } from '../lib/languages';
import { useSettingsStore } from '../store';

const THEME_LABEL = { light: 'Light', dark: 'Dark', system: 'System' } as const;

/** Settings tab root — a hub, with each area on its own screen. */
export function SettingsScreen() {
  const router = useRouter();
  const themeMode = useThemeStore((state) => state.mode);
  const language = useSettingsStore((state) => state.language);
  const pinEnabled = useSecurityStore((state) => state.pinEnabled);

  return (
    <Screen edges="top">
      <VStack className="px-5 pt-2 pb-4">
        <Text size="3xl" bold className="text-foreground">
          Settings
        </Text>
      </VStack>

      <ScrollView contentContainerClassName="pb-10">
        <SectionLabel>Appearance</SectionLabel>
        <SettingsGroup>
          <SettingsRow
            label="Theme"
            icon={MoonIcon}
            showChevron
            accessory={
              <Text size="sm" className="text-muted-foreground">
                {THEME_LABEL[themeMode]}
              </Text>
            }
            onPress={() => router.push(links.settingsAppearance)}
          />
          <SettingsRow
            label="Language"
            icon={LanguageIcon}
            showChevron
            accessory={
              <Text size="sm" className="text-muted-foreground">
                {languageLabel(language)}
              </Text>
            }
            onPress={() => router.push(links.settingsLanguage)}
          />
        </SettingsGroup>

        <SectionLabel>Privacy</SectionLabel>
        <SettingsGroup>
          <SettingsRow
            label="App lock"
            description="PIN code and biometric unlock"
            icon={LockIcon}
            showChevron
            accessory={
              <Text size="sm" className="text-muted-foreground">
                {pinEnabled ? 'On' : 'Off'}
              </Text>
            }
            onPress={() => router.push(links.settingsSecurity)}
          />
        </SettingsGroup>

        <SectionLabel>About</SectionLabel>
        <SettingsGroup>
          <SettingsRow
            label="About Voicegram"
            icon={InfoIcon}
            showChevron
            onPress={() => router.push(links.settingsAbout)}
          />
        </SettingsGroup>
      </ScrollView>
    </Screen>
  );
}
