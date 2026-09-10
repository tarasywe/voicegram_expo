import { getRandomBytes } from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const KEYCHAIN_ENTRY = 'voicegram.mmkv.key';
const KEY_BYTES = 32;

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

/**
 * Per-device MMKV encryption key, kept in the iOS Keychain / Android Keystore
 * and generated on first launch — never shipped in the bundle or in a build
 * var.
 *
 * Deliberately synchronous: the persisted zustand stores hydrate at import
 * time, so the key has to exist before the first read or the store would be
 * opened unencrypted and then lose its data on the next launch.
 *
 * Returns `undefined` only where SecureStore is unavailable (web), in which
 * case MMKV falls back to an unencrypted store.
 */
export function getDeviceEncryptionKey(): string | undefined {
  try {
    const existing = SecureStore.getItem(KEYCHAIN_ENTRY);
    if (existing) return existing;

    const key = toHex(getRandomBytes(KEY_BYTES));
    SecureStore.setItem(KEYCHAIN_ENTRY, key, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    return key;
  } catch {
    return undefined;
  }
}
