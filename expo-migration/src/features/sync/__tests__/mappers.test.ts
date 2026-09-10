import {
  makeArticleFixture,
  makeAudioRecordFixture,
} from '@features/articles/__mocks__/article-factories';
import {
  makeRemoteArticleFixture,
  makeRemoteRecordFixture,
} from '../__mocks__/remote-factories';
import {
  fromRemoteArticle,
  fromRemoteRecord,
  toRemoteArticle,
  toRemoteRecord,
} from '../lib/mappers';

const NOW = 1_800_000_000_000;

describe('toRemoteRecord', () => {
  it('maps local field names onto the legacy remote ones', () => {
    const record = makeAudioRecordFixture({
      title: 'Intro',
      durationSec: 9,
      sizeBytes: 1234,
      repeat: 3,
      delaySec: 5,
      enabled: false,
    });

    expect(toRemoteRecord(record, 2)).toMatchObject({
      title: 'Intro',
      duration: 9,
      size: 1234,
      position: 2,
      repeat: 3,
      delay: 5,
      enable: false,
    });
  });

  it('only writes origin for a duplicate', () => {
    expect(toRemoteRecord(makeAudioRecordFixture(), 0)).not.toHaveProperty('origin');
    expect(toRemoteRecord(makeAudioRecordFixture({ originId: 'src' }), 0).origin).toBe(
      'src',
    );
  });
});

describe('fromRemoteRecord', () => {
  it('clamps settings that fall outside what the UI allows', () => {
    const record = fromRemoteRecord(
      makeRemoteRecordFixture({ repeat: 999, delay: -4, duration: -1, size: -20 }),
      NOW,
    );

    expect(record.repeat).toBe(20);
    expect(record.delaySec).toBe(0);
    expect(record.durationSec).toBe(0);
    expect(record.sizeBytes).toBe(0);
  });

  it('round-trips a record without losing anything', () => {
    const original = makeAudioRecordFixture({ repeat: 4, delaySec: 3, durationSec: 7 });
    const restored = fromRemoteRecord(toRemoteRecord(original, 0), original.createdAt);

    expect(restored).toEqual(original);
  });
});

describe('fromRemoteArticle', () => {
  it('orders records by their remote position, not by key order', () => {
    const article = fromRemoteArticle(
      'art-1',
      makeRemoteArticleFixture(),
      [
        makeRemoteRecordFixture({ id: 'c', title: 'third', position: 2 }),
        makeRemoteRecordFixture({ id: 'a', title: 'first', position: 0 }),
        makeRemoteRecordFixture({ id: 'b', title: 'second', position: 1 }),
      ],
      NOW,
    );

    expect(article.records.map((r) => r.title)).toEqual(['first', 'second', 'third']);
  });

  it('maps the legacy random/repeat flags onto shuffle/loop', () => {
    const article = fromRemoteArticle(
      'art-1',
      makeRemoteArticleFixture({ random: true, repeat: true }),
      [],
      NOW,
    );

    expect(article.randomOrder).toBe(true);
    expect(article.loop).toBe(true);
    expect(article.syncedAt).toBe(NOW);
  });

  it('survives an article with no records', () => {
    const article = fromRemoteArticle('art-1', makeRemoteArticleFixture(), [], NOW);
    expect(article.records).toEqual([]);
  });
});

describe('toRemoteArticle', () => {
  it('stamps the author and the measured size', () => {
    const article = makeArticleFixture({ name: 'Album', randomOrder: true });
    expect(toRemoteArticle(article, 'uid-9', 5000)).toEqual({
      name: 'Album',
      random: true,
      repeat: false,
      size: 5000,
      author: 'uid-9',
      shared: false,
    });
  });

  it('carries the public flag, since the write replaces the whole row', () => {
    const article = makeArticleFixture({ isPublic: true });
    expect(toRemoteArticle(article, 'uid-9', 0).shared).toBe(true);
  });

  it('round-trips the public flag through the remote shape', () => {
    const article = makeArticleFixture({ isPublic: true, randomOrder: true, loop: true });
    const restored = fromRemoteArticle(
      article.id,
      toRemoteArticle(article, 'uid-9', 0),
      [],
      NOW,
    );

    expect(restored.isPublic).toBe(true);
    expect(restored.randomOrder).toBe(true);
    expect(restored.loop).toBe(true);
  });
});
