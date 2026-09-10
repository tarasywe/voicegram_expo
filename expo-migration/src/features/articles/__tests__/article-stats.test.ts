import {
  makeArticleFixture,
  makeAudioRecordFixture,
} from '../__mocks__/article-factories';
import {
  articleDurationSec,
  articleSizeBytes,
  enabledRecords,
  recordPlaybackSec,
} from '../lib/article-stats';

describe('article stats', () => {
  it('sums the bytes of every record, enabled or not', () => {
    const article = makeArticleFixture({
      records: [
        makeAudioRecordFixture({ sizeBytes: 1000 }),
        makeAudioRecordFixture({ sizeBytes: 500, enabled: false }),
      ],
    });
    expect(articleSizeBytes(article)).toBe(1500);
  });

  it('counts repeats and the trailing delay in a record’s playback time', () => {
    const record = makeAudioRecordFixture({ durationSec: 5, delaySec: 2, repeat: 3 });
    expect(recordPlaybackSec(record)).toBe(21);
  });

  it('skips disabled records when timing the article', () => {
    const article = makeArticleFixture({
      records: [
        makeAudioRecordFixture({ durationSec: 10, delaySec: 0, repeat: 1 }),
        makeAudioRecordFixture({ durationSec: 10, enabled: false }),
      ],
    });
    expect(articleDurationSec(article)).toBe(10);
    expect(enabledRecords(article)).toHaveLength(1);
  });

  it('reports zero for an empty article', () => {
    const article = makeArticleFixture();
    expect(articleDurationSec(article)).toBe(0);
    expect(articleSizeBytes(article)).toBe(0);
  });
});
