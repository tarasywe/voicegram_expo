import { useLibraryStore } from '../store';

/**
 * File I/O is mocked: these assertions are about the library's bookkeeping,
 * not about expo-file-system. `recordSize` is what ties the two together, so
 * it returns a fixed size and the store is expected to record it.
 */
jest.mock('@/lib/audio-files', () => ({
  adoptRecording: jest.fn(),
  copyRecording: jest.fn(),
  deleteRecording: jest.fn(),
  deleteArticleDirectory: jest.fn(),
  recordSize: jest.fn(() => 4096),
}));

const audioFiles = jest.requireMock('@/lib/audio-files') as {
  adoptRecording: jest.Mock;
  copyRecording: jest.Mock;
  deleteRecording: jest.Mock;
  deleteArticleDirectory: jest.Mock;
};

const store = () => useLibraryStore.getState();
const articleById = (id: string) => store().articles.find((article) => article.id === id);

beforeEach(() => {
  useLibraryStore.setState({ articles: [] });
  jest.clearAllMocks();
});

describe('createArticle', () => {
  it('puts the newest article first and trims its name', () => {
    store().createArticle('First');
    const secondId = store().createArticle('  Second  ');

    expect(store().articles.map((article) => article.name)).toEqual(['Second', 'First']);
    expect(articleById(secondId)?.name).toBe('Second');
  });
});

describe('saveRecord', () => {
  it('moves the clip into the library and stores its on-disk size', () => {
    const articleId = store().createArticle('Album');

    const recordId = store().saveRecord({
      articleId,
      title: 'Intro',
      durationSec: 7.5,
      sourceUri: 'file:///tmp/take.m4a',
    });

    expect(recordId).not.toBeNull();
    expect(audioFiles.adoptRecording).toHaveBeenCalledWith(
      'file:///tmp/take.m4a',
      articleId,
      recordId,
    );

    const record = articleById(articleId)?.records[0];
    expect(record?.title).toBe('Intro');
    expect(record?.sizeBytes).toBe(4096);
    expect(record?.repeat).toBe(1);
    expect(record?.enabled).toBe(true);
  });

  it('refuses to save into an article that no longer exists', () => {
    const result = store().saveRecord({
      articleId: 'gone',
      title: 'Orphan',
      durationSec: 3,
      sourceUri: 'file:///tmp/take.m4a',
    });

    expect(result).toBeNull();
    expect(audioFiles.adoptRecording).not.toHaveBeenCalled();
  });
});

describe('duplicateRecord', () => {
  it('copies the audio and points the clone at the original', () => {
    const articleId = store().createArticle('Album');
    const sourceId = store().saveRecord({
      articleId,
      title: 'Intro',
      durationSec: 4,
      sourceUri: 'file:///tmp/take.m4a',
    });
    if (!sourceId) throw new Error('expected the source record to be saved');

    const cloneId = store().duplicateRecord(articleId, sourceId);
    const records = articleById(articleId)?.records ?? [];

    expect(audioFiles.copyRecording).toHaveBeenCalledWith(articleId, sourceId, cloneId);
    expect(records.map((record) => record.title)).toEqual(['Intro', 'Intro (copy)']);
    expect(records[1]?.originId).toBe(sourceId);
  });

  it('chains originId back to the very first record', () => {
    const articleId = store().createArticle('Album');
    const sourceId = store().saveRecord({
      articleId,
      title: 'Intro',
      durationSec: 4,
      sourceUri: 'file:///tmp/take.m4a',
    });
    if (!sourceId) throw new Error('expected the source record to be saved');

    const firstClone = store().duplicateRecord(articleId, sourceId);
    if (!firstClone) throw new Error('expected the first clone to be created');
    const secondClone = store().duplicateRecord(articleId, firstClone);

    const clone = articleById(articleId)?.records.find(
      (record) => record.id === secondClone,
    );
    expect(clone?.originId).toBe(sourceId);
  });

  it('returns null for an unknown record', () => {
    const articleId = store().createArticle('Album');
    expect(store().duplicateRecord(articleId, 'missing')).toBeNull();
    expect(store().duplicateRecord('missing', 'missing')).toBeNull();
  });
});

describe('deletion', () => {
  it('removes the record and its audio file', () => {
    const articleId = store().createArticle('Album');
    const recordId = store().saveRecord({
      articleId,
      title: 'Intro',
      durationSec: 4,
      sourceUri: 'file:///tmp/take.m4a',
    });
    if (!recordId) throw new Error('expected the record to be saved');

    store().deleteRecord(articleId, recordId);

    expect(audioFiles.deleteRecording).toHaveBeenCalledWith(articleId, recordId);
    expect(articleById(articleId)?.records).toHaveLength(0);
  });

  it('removes the article directory along with the article', () => {
    const articleId = store().createArticle('Album');
    store().deleteArticle(articleId);

    expect(audioFiles.deleteArticleDirectory).toHaveBeenCalledWith(articleId);
    expect(articleById(articleId)).toBeUndefined();
  });
});

describe('moveRecord', () => {
  it('reorders within one article and leaves others untouched', () => {
    const articleId = store().createArticle('Album');
    const otherId = store().createArticle('Other');

    for (const title of ['a', 'b', 'c']) {
      store().saveRecord({
        articleId,
        title,
        durationSec: 2,
        sourceUri: `file:///tmp/${title}.m4a`,
      });
    }

    store().moveRecord(articleId, 2, 0);

    expect(articleById(articleId)?.records.map((r) => r.title)).toEqual(['c', 'a', 'b']);
    expect(articleById(otherId)?.records).toEqual([]);
  });
});
