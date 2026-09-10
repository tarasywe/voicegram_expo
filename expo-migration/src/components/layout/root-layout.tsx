import { AppLock } from '@features/security';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NavigationThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { queryClient } from '@/lib/query-client';
import { navigationTheme, ThemeProvider, useResolvedTheme } from '@/theme';
import '@/global.css';

const GestureRoot = withUniwind(GestureHandlerRootView);

void SplashScreen.preventAutoHideAsync();

export function RootLayout() {
  useEffect(() => {
    // Stores hydrate synchronously from MMKV, so there is nothing to wait for.
    void SplashScreen.hideAsync();
  }, []);

  return (
    <GestureRoot className="flex-1">
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <KeyboardProvider>
              <AppLock>
                <RootStack />
              </AppLock>
            </KeyboardProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureRoot>
  );
}

function RootStack() {
  const resolved = useResolvedTheme();

  return (
    <NavigationThemeProvider value={navigationTheme(resolved)}>
      <StatusBar style={resolved === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="article/[articleId]/index" options={{ title: 'Article' }} />
        <Stack.Screen
          name="article/[articleId]/settings"
          options={{ title: 'Article settings' }}
        />
        <Stack.Screen
          name="article/[articleId]/record/[recordId]"
          options={{ title: 'Recording' }}
        />
        <Stack.Screen name="settings/appearance" options={{ title: 'Theme' }} />
        <Stack.Screen name="settings/language" options={{ title: 'Language' }} />
        <Stack.Screen name="settings/security" options={{ title: 'App lock' }} />
        <Stack.Screen name="settings/about" options={{ title: 'About' }} />
      </Stack>
    </NavigationThemeProvider>
  );
}
