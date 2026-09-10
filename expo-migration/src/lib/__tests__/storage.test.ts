import { storage, zustandStorage } from '../storage';

describe('zustandStorage', () => {
  it('round-trips a value and reports null once removed', () => {
    zustandStorage.setItem('probe', '{"a":1}');
    expect(zustandStorage.getItem('probe')).toBe('{"a":1}');

    zustandStorage.removeItem('probe');
    expect(zustandStorage.getItem('probe')).toBeNull();
  });

  it('reports null for a key that was never written', () => {
    expect(zustandStorage.getItem('never-written')).toBeNull();
  });
});

describe('storage', () => {
  it('returns undefined rather than null for a missing key', () => {
    expect(storage.getString('missing')).toBeUndefined();
  });
});
