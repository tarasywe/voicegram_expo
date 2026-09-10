import type { RemoteArticle, RemoteRecord } from '../types/remote';

export function makeRemoteArticleFixture(
  overrides: Partial<RemoteArticle> = {},
): RemoteArticle {
  return {
    name: 'Autogenne',
    random: false,
    repeat: false,
    size: 41_984,
    author: 'uid-1',
    ...overrides,
  };
}

export function makeRemoteRecordFixture(
  overrides: Partial<RemoteRecord> = {},
): RemoteRecord {
  return {
    id: 'rec-1',
    title: 'Coundiwn',
    duration: 8,
    size: 20_480,
    position: 0,
    repeat: 1,
    delay: 0,
    enable: true,
    ...overrides,
  };
}
