import { usePlaybackStore } from '../store';

const store = () => usePlaybackStore.getState();

beforeEach(() => {
  store().reset();
});

describe('usePlaybackStore', () => {
  it('starts idle, with nothing loaded', () => {
    expect(store().status).toBe('idle');
    expect(store().articleId).toBeNull();
    expect(store().articleName).toBe('');
  });

  it('loads an article and clears any previous position', () => {
    store().patch({ elapsedSec: 42, currentRecordId: 'old' });
    store().load('art-1', 'Album', 120);

    expect(store().articleId).toBe('art-1');
    expect(store().articleName).toBe('Album');
    expect(store().totalSec).toBe(120);
    expect(store().elapsedSec).toBe(0);
    expect(store().currentRecordId).toBeNull();
  });

  it('reset returns every field to idle, which is what hides the bar', () => {
    store().load('art-1', 'Album', 120);
    store().patch({ status: 'playing', elapsedSec: 10, currentRecordId: 'rec-1' });

    store().reset();

    expect(store()).toMatchObject({
      status: 'idle',
      articleId: null,
      articleName: '',
      currentRecordId: null,
      elapsedSec: 0,
      totalSec: 0,
    });
  });

  it('moves between playing and paused without losing position', () => {
    store().load('art-1', 'Album', 60);
    store().patch({ status: 'playing', elapsedSec: 15 });
    store().patch({ status: 'paused' });

    expect(store().status).toBe('paused');
    expect(store().elapsedSec).toBe(15);
    expect(store().articleId).toBe('art-1');
  });
});
