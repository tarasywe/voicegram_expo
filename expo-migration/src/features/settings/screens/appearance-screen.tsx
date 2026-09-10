import { CheckIcon, Icon, MoonIcon, SunIcon } from '@ui/icon';
import { Text } from '@ui/text';
import { ScrollView } from 'react-native';
import { Screen, SectionLabel, SettingsGroup, SettingsRow } from '@/components/shared';
import { type ThemeMode, useResolvedTheme, useThemeStore } from '@/theme';

const OPTIONS: { mode: ThemeMode; label: string; description: string }[] = [
  { mode: 'light', label: 'Light', description: 'Always use the light palette' },
  { mode: 'dark', label: 'Dark', description: 'Always use the dark palette' },
  {
    mode: 'system',
    label: 'System',
    description: 'Follow your device appearance setting',
  },
];

export function AppearanceScreen() {
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);
  const resolved = useResolvedTheme();

  return (
    <Screen>
      <ScrollView contentContainerClassName="pb-10">
        <SectionLabel>Theme</SectionLabel>
        <SettingsGroup>
          {OPTIONS.map((option) => (
            <SettingsRow
              key={option.mode}
              label={option.label}
              description={option.description}
              icon={option.mode === 'light' ? SunIcon : MoonIcon}
              onPress={() => setMode(option.mode)}
              accessory={
                mode === option.mode ? (
                  <Icon as={CheckIcon} size="sm" className="text-primary" />
                ) : null
              }
            />
          ))}
        </SettingsGroup>

        <Text size="xs" className="px-6 pt-4 text-muted-foreground">
          {`Currently showing the ${resolved} palette. Both themes are contrast-checked to WCAG AA.`}
        </Text>
      </ScrollView>
    </Screen>
  );
}
