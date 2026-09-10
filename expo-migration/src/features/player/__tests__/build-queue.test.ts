import {
  makeArticleFixture,
  makeAudioRecordFixture,
} from '@features/articles/__mocks__/article-factories';
import { buildQueue } from '../lib/build-queue';

describe('buildQueue', () => {
  it('expands repeats in place', () => {
    const article = makeArticleFixture({
      records: [
        makeAudioRecordFixture({ title: 'a', repeat: 2 }),
        makeAudioRecordFixture({ title: 'b', repeat: 1 }),
      ],
    });

    expect(buildQueue(article).map((entry) => entry.record.title)).toEqual([
      'a',
      'a',
      'b',
    ]);
    expect(buildQueue(article).map((entry) => entry.pass)).toEqual([1, 2, 1]);
  });

  it('drops disabled records', () => {
    const article = makeArticleFixture({
      records: [
        makeAudioRecordFixture({ title: 'a', enabled: false, repeat: 3 }),
        makeAudioRecordFixture({ title: 'b' }),
      ],
    });
    expect(buildQueue(article).map((entry) => entry.record.title)).toEqual(['b']);
  });

  it('returns an empty queue when nothing is playable', () => {
    expect(buildQueue(makeArticleFixture())).toEqual([]);
    expect(
      buildQueue(
        makeArticleFixture({
          records: [makeAudioRecordFixture({ enabled: false })],
        }),
      ),
    ).toEqual([]);
  });

  it('keeps every clip when shuffling, only the order changes', () => {
    const article = makeArticleFixture({
      randomOrder: true,
      records: ['a', 'b', 'c', 'd'].map((title) => makeAudioRecordFixture({ title })),
    });

    const titles = buildQueue(article)
      .map((entry) => entry.record.title)
      .sort();
    expect(titles).toEqual(['a', 'b', 'c', 'd']);
  });
});
