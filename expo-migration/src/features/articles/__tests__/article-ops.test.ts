import {
  makeArticleFixture,
  makeAudioRecordFixture,
} from '../__mocks__/article-factories';
import {
  addRecord,
  insertRecordAfter,
  makeArticle,
  makeRecord,
  removeRecord,
  reorderRecords,
  replaceRecord,
} from '../lib/article-ops';

const NOW = 1_800_000_000_000;

describe('makeArticle', () => {
  it('trims the name and starts with sane defaults', () => {
    const article = makeArticle('a1', '  Morning  ', NOW);
    expect(article.name).toBe('Morning');
    expect(article.records).toEqual([]);
    expect(article.randomOrder).toBe(false);
    expect(article.loop).toBe(false);
    expect(article.syncedAt).toBeNull();
  });
});

describe('makeRecord', () => {
  it('omits originId unless the record is a duplicate', () => {
    expect(makeRecord('r1', 'Clip', 5, 100, NOW)).not.toHaveProperty('originId');
    expect(makeRecord('r2', 'Clip', 5, 100, NOW, 'r1').originId).toBe('r1');
  });
});

describe('record mutations', () => {
  it('appends a record and bumps updatedAt', () => {
    const article = makeArticleFixture();
    const record = makeAudioRecordFixture();

    const next = addRecord(article, record, NOW);
    expect(next.records).toHaveLength(1);
    expect(next.updatedAt).toBe(NOW);
    expect(article.records).toHaveLength(0);
  });

  it('patches a record without letting the id be overwritten', () => {
    const record = makeAudioRecordFixture({ repeat: 1 });
    const article = makeArticleFixture({ records: [record] });

    const next = replaceRecord(
      article,
      record.id,
      { repeat: 4, id: 'hijacked' } as Partial<typeof record>,
      NOW,
    );
    expect(next.records[0]?.repeat).toBe(4);
    expect(next.records[0]?.id).toBe(record.id);
  });

  it('leaves the article alone when the record id is unknown', () => {
    const article = makeArticleFixture({ records: [makeAudioRecordFixture()] });
    expect(replaceRecord(article, 'missing', { repeat: 9 }, NOW).records).toEqual(
      article.records,
    );
    expect(removeRecord(article, 'missing', NOW).records).toHaveLength(1);
  });

  it('removes a record by id', () => {
    const record = makeAudioRecordFixture();
    const article = makeArticleFixture({ records: [record] });
    expect(removeRecord(article, record.id, NOW).records).toHaveLength(0);
  });

  it('reorders records and ignores out-of-range moves', () => {
    const [a, b, c] = [
      makeAudioRecordFixture({ title: 'a' }),
      makeAudioRecordFixture({ title: 'b' }),
      makeAudioRecordFixture({ title: 'c' }),
    ];
    const article = makeArticleFixture({ records: [a, b, c] });

    expect(reorderRecords(article, 0, 2, NOW).records.map((r) => r.title)).toEqual([
      'b',
      'c',
      'a',
    ]);
    expect(reorderRecords(article, 0, 7, NOW).records.map((r) => r.title)).toEqual([
      'a',
      'b',
      'c',
    ]);
  });

  it('inserts a duplicate directly after its source', () => {
    const source = makeAudioRecordFixture({ title: 'source' });
    const tail = makeAudioRecordFixture({ title: 'tail' });
    const clone = makeAudioRecordFixture({ title: 'clone' });
    const article = makeArticleFixture({ records: [source, tail] });

    const next = insertRecordAfter(article, source.id, clone, NOW);
    expect(next.records.map((r) => r.title)).toEqual(['source', 'clone', 'tail']);
  });

  it('appends when the anchor record is gone', () => {
    const article = makeArticleFixture({ records: [makeAudioRecordFixture()] });
    const clone = makeAudioRecordFixture({ title: 'clone' });
    const next = insertRecordAfter(article, 'missing', clone, NOW);
    expect(next.records[next.records.length - 1]?.title).toBe('clone');
  });
});
