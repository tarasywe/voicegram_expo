import { getRandomBytes } from 'expo-crypto';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const ID_LENGTH = 10;

/**
 * Collision-resistant enough for a per-device library, and safe as a filename.
 * Uses expo-crypto rather than `crypto.getRandomValues` — React Native has no
 * WebCrypto global.
 */
export function makeId(): string {
  const bytes = getRandomBytes(ID_LENGTH);
  let out = '';
  for (const byte of bytes) {
    out += ALPHABET[byte % ALPHABET.length];
  }
  return out;
}
