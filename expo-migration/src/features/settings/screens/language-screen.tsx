import { CheckIcon, Icon } from '@ui/icon';
import { Text } from '@ui/text';
import { getLocales } from 'expo-localization';
import { ScrollView } from 'react-native';
import { Screen, SectionLabel, SettingsGroup, SettingsRow } from '@/components/shared';
import { LANGUAGES } from '../lib/languages';
import { useSettingsStore } from '../store';

export function LanguageScreen() {
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const deviceLocale = getLocales()[0]?.languageTag ?? 'en';

  return (
    <Screen>
      <ScrollView contentContainerClassName="pb-10">
        <SectionLabel>Language</SectionLabel>
        <SettingsGroup>
          {LANGUAGES.map((option) => (
            <SettingsRow
              key={option.code}
              label={option.label}
              {...(option.code === 'system'
                ? { description: `Your device is set to ${deviceLocale}` }
                : option.native
                  ? { description: option.native }
                  : {})}
              onPress={() => setLanguage(option.code)}
              accessory={
                language === option.code ? (
                  <Icon as={CheckIcon} size="sm" className="text-primary" />
                ) : null
              }
            />
          ))}
        </SettingsGroup>

        <Text size="xs" className="px-6 pt-4 text-muted-foreground">
          Translations land with the localization step; the preference is stored now so
          the choice survives that change.
        </Text>
      </ScrollView>
    </Screen>
  );
}
