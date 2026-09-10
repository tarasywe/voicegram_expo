import * as LocalAuthentication from 'expo-local-authentication';

export type BiometricKind = 'face' | 'fingerprint' | 'iris' | 'none';

/** What the device can actually offer, so the UI never promises Face ID blindly. */
export async function getBiometricKind(): Promise<BiometricKind> {
  const [hasHardware, isEnrolled] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
  ]);
  if (!hasHardware || !isEnrolled) return 'none';

  const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
    return 'face';
  }
  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
    return 'fingerprint';
  }
  if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) return 'iris';
  return 'none';
}

export const biometricLabel = (kind: BiometricKind) =>
  ({
    face: 'Face ID',
    fingerprint: 'Fingerprint',
    iris: 'Iris',
    none: 'Biometrics',
  })[kind];

export async function authenticateWithBiometrics(reason: string): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: reason,
    fallbackLabel: 'Use PIN',
    disableDeviceFallback: false,
  });
  return result.success;
}
