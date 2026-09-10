import { makeId } from '../id';

jest.mock('expo-crypto', () => ({
  getRandomBytes: jest.fn((count: number) =>
    Uint8Array.from({ length: count }, (_, index) => index),
  ),
}));

describe('makeId', () => {
  it('produces a fixed-length id from the alphabet only', () => {
    expect(makeId()).toMatch(/^[A-Za-z0-9]{10}$/);
  });

  it('never returns an empty string', () => {
    expect(makeId().length).toBeGreaterThan(0);
  });
});
