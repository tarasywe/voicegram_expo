// expo-secure-store is native-only; the tests that touch it assert behaviour,
// not the keychain itself.
jest.mock('expo-secure-store', () => {
  const vault = new Map<string, string>();
  return {
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'whenUnlockedThisDeviceOnly',
    getItem: jest.fn((key: string) => vault.get(key) ?? null),
    setItem: jest.fn((key: string, value: string) => {
      vault.set(key, value);
    }),
    getItemAsync: jest.fn(async (key: string) => vault.get(key) ?? null),
    setItemAsync: jest.fn(async (key: string, value: string) => {
      vault.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key: string) => {
      vault.delete(key);
    }),
  };
});
