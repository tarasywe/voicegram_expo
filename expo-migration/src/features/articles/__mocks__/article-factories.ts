import type { Article, AudioRecord } from '../types/article';

let sequence = 0;
const nextId = (prefix: string) => {
  sequence += 1;
  return `${prefix}-${sequence}`;
};

export function makeAudioRecordFixture(
  overrides: Partial<AudioRecord> = {},
): AudioRecord {
  return {
    id: nextId('rec'),
    title: 'Intro line',
    durationSec: 8,
    sizeBytes: 20_480,
    enabled: true,
    repeat: 1,
    delaySec: 0,
    createdAt: 1_700_000_000_000,
    ...overrides,
  };
}

export function makeArticleFixture(overrides: Partial<Article> = {}): Article {
  return {
    id: nextId('art'),
    name: 'Autogenne',
    records: [],
    randomOrder: false,
    loop: false,
    isPublic: false,
    syncedAt: null,
    createdAt: 1_700_000_000_000,
    updatedAt: 1_700_000_000_000,
    ...overrides,
  };
}

/** Article with `count` enabled, one-second-apart records — the common case. */
export function makeArticleWithRecords(count: number): Article {
  return makeArticleFixture({
    records: Array.from({ length: count }, (_, index) =>
      makeAudioRecordFixture({ title: `Clip ${index + 1}` }),
    ),
  });
}
