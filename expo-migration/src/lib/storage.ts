import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';
import { getDeviceEncryptionKey } from './device-key';

const encryptionKey = getDeviceEncryptionKey();

/**
 * The one MMKV instance, encrypted with the device key. Created eagerly so it
 * is ready before the persisted zustand stores hydrate on import.
 */
const instance = createMMKV(
  encryptionKey ? { id: 'voicegram', encryptionKey } : { id: 'voicegram' },
);

export const storage = {
  getString: (key: string) => instance.getString(key),
  set: (key: string, value: string) => instance.set(key, value),
  remove: (key: string) => instance.remove(key),
};

/** Adapter for `zustand/middleware`'s `persist`. */
export const zustandStorage: StateStorage = {
  getItem: (name) => storage.getString(name) ?? null,
  setItem: (name, value) => storage.set(name, value),
  removeItem: (name) => storage.remove(name),
};
