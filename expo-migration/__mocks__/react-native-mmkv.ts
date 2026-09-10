/**
 * In-memory stand-in for MMKV. The real one is a Nitro native module and is
 * unavailable under Jest; every store in the app talks to it through
 * `src/lib/storage.ts`, so this is the single place tests need it faked.
 */
const stores = new Map<string, Map<string, string>>();

const storeFor = (id: string) => {
  const existing = stores.get(id);
  if (existing) return existing;
  const created = new Map<string, string>();
  stores.set(id, created);
  return created;
};

export const createMMKV = ({ id = 'default' }: { id?: string } = {}) => {
  const values = storeFor(id);
  return {
    getString: (key: string) => values.get(key),
    set: (key: string, value: string) => {
      values.set(key, String(value));
    },
    remove: (key: string) => values.delete(key),
    clearAll: () => values.clear(),
  };
};

/** Test-only helper: wipe every fake store between suites. */
export const __resetMMKV = () => stores.clear();
