import { useSyncStore } from '../store';

const store = () => useSyncStore.getState();

beforeEach(() => {
  useSyncStore.setState({ transfers: {} });
});

describe('useSyncStore', () => {
  it('tracks a transfer from start to finish', () => {
    store().begin('art-1', 'upload', 3);
    expect(store().transfers['art-1']).toMatchObject({
      kind: 'upload',
      progress: 0,
      done: 0,
      total: 3,
      error: null,
    });

    store().setProgress('art-1', 0.5, 1);
    expect(store().transfers['art-1']?.progress).toBe(0.5);
    expect(store().transfers['art-1']?.done).toBe(1);

    store().finish('art-1');
    expect(store().transfers['art-1']).toBeUndefined();
  });

  it('clamps progress into 0–1', () => {
    store().begin('art-1', 'download', 1);
    store().setProgress('art-1', 5, 1);
    expect(store().transfers['art-1']?.progress).toBe(1);

    store().setProgress('art-1', -2, 1);
    expect(store().transfers['art-1']?.progress).toBe(0);
  });

  it('keeps a failed transfer visible so the error can be shown', () => {
    store().begin('art-1', 'upload', 2);
    store().fail('art-1', 'Network is down');

    expect(store().transfers['art-1']?.error).toBe('Network is down');
  });

  it('ignores updates for a transfer that is not running', () => {
    store().setProgress('missing', 0.5, 1);
    store().fail('missing', 'nope');
    expect(store().transfers).toEqual({});
  });

  it('tracks several articles independently', () => {
    store().begin('a', 'upload', 1);
    store().begin('b', 'download', 2);
    store().setProgress('a', 1, 1);

    expect(store().transfers['a']?.progress).toBe(1);
    expect(store().transfers['b']?.progress).toBe(0);

    store().finish('a');
    expect(store().transfers['b']).toBeDefined();
  });
});
