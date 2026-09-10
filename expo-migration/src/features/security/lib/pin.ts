import * as SecureStore from 'expo-secure-store';

const PIN_ENTRY = 'voicegram.app.pin';

export const PIN_LENGTH = 4;

const isWellFormed = (pin: string) => pin.length === PIN_LENGTH && /^\d+$/.test(pin);

/** Stores the unlock PIN in the device keychain — never in MMKV. */
export async function setPin(pin: string): Promise<boolean> {
  if (!isWellFormed(pin)) return false;
  await SecureStore.setItemAsync(PIN_ENTRY, pin, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  return true;
}

export async function verifyPin(pin: string): Promise<boolean> {
  const stored = await SecureStore.getItemAsync(PIN_ENTRY);
  return stored !== null && stored === pin;
}

export async function hasPin(): Promise<boolean> {
  return (await SecureStore.getItemAsync(PIN_ENTRY)) !== null;
}

export async function clearPin(): Promise<void> {
  await SecureStore.deleteItemAsync(PIN_ENTRY);
}
