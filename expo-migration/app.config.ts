import type { ConfigContext, ExpoConfig } from 'expo/config';

const BUNDLE_ID = 'com.voicegram';

/**
 * EAS project id. Injected by `eas init`; kept in the environment so that a
 * fresh clone can `expo prebuild` without an Expo account.
 */
const easProjectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID ?? '';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Voicegram',
  slug: 'voicegram',
  scheme: 'voicegram',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: BUNDLE_ID,
    supportsTablet: true,
    googleServicesFile: './GoogleService-Info.plist',
    infoPlist: {
      NSMicrophoneUsageDescription:
        'Voicegram needs the microphone to record the short audio clips that make up your articles.',
      NSFaceIDUsageDescription:
        'Voicegram uses Face ID to unlock the app and protect your recordings.',
      UIBackgroundModes: ['audio'],
    },
  },
  android: {
    package: BUNDLE_ID,
    googleServicesFile: './google-services.json',
    predictiveBackGestureEnabled: false,
    adaptiveIcon: {
      backgroundColor: '#0891B2',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    permissions: [
      'android.permission.RECORD_AUDIO',
      'android.permission.USE_BIOMETRIC',
      'android.permission.USE_FINGERPRINT',
    ],
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      '@react-native-firebase/app',
      {
        // firebase-ios-sdk's SPM products are static libraries, so each
        // RNFirebase pod would embed its own copy and collide at link time
        // under `useFrameworks: 'static'`. CocoaPods resolves it once instead.
        ios: { disableSPM: true },
      },
    ],
    '@react-native-firebase/auth',
    [
      'expo-build-properties',
      {
        // RNFirebase ships static xcframeworks; CocoaPods needs to match.
        ios: { useFrameworks: 'static' },
      },
    ],
    [
      'expo-splash-screen',
      {
        image: './assets/splash-icon.png',
        imageWidth: 180,
        resizeMode: 'contain',
        backgroundColor: '#FFFFFF',
        dark: { backgroundColor: '#0F172A' },
      },
    ],
    [
      'expo-audio',
      {
        microphonePermission:
          'Voicegram needs the microphone to record the short audio clips that make up your articles.',
      },
    ],
    'expo-secure-store',
    'expo-localization',
    'expo-image',
    [
      'expo-local-authentication',
      {
        faceIDPermission:
          'Voicegram uses Face ID to unlock the app and protect your recordings.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  updates: {
    enabled: easProjectId.length > 0,
    fallbackToCacheTimeout: 0,
    ...(easProjectId ? { url: `https://u.expo.dev/${easProjectId}` } : {}),
  },
  runtimeVersion: { policy: 'appVersion' },
  ...(easProjectId ? { extra: { eas: { projectId: easProjectId } } } : {}),
});
