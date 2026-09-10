import { remoteArticleSchema, remoteRecordSchema } from '../types/remote';

/**
 * The original app wrote `delay` and `repeat` through a `Picker`, whose values
 * are strings. A strict `z.number()` fell through to the catch and silently
 * zeroed every delay, so downloaded articles reported a shorter duration than
 * they actually play for. These cover that shape.
 */

const record = (overrides: Record<string, unknown> = {}) =>
  remoteRecordSchema.parse({
    id: 'rec-1',
    title: 'Clip',
    duration: 5,
    size: 100,
    position: 0,
    repeat: 1,
    delay: 0,
    enable: true,
    ...overrides,
  });

describe('remoteRecordSchema — numbers the old app stored as strings', () => {
  it('keeps a string delay instead of zeroing it', () => {
    expect(record({ delay: '30' }).delay).toBe(30);
  });

  it('keeps every delay the old picker offered', () => {
    for (const value of ['0', '1', '2', '5', '10', '20', '30', '60', '120']) {
      expect(record({ delay: value }).delay).toBe(Number(value));
    }
  });

  it('keeps a string repeat, duration, size and position', () => {
    const parsed = record({ repeat: '3', duration: '12', size: '2048', position: '4' });
    expect(parsed.repeat).toBe(3);
    expect(parsed.duration).toBe(12);
    expect(parsed.size).toBe(2048);
    expect(parsed.position).toBe(4);
  });

  it('still falls back when a value is genuinely unusable', () => {
    expect(record({ delay: 'later' }).delay).toBe(0);
    expect(record({ repeat: null }).repeat).toBe(1);
  });
});

describe('remoteRecordSchema — booleans the old app may have stored as strings', () => {
  it('reads "false" as false rather than as a truthy string', () => {
    expect(record({ enable: 'false' }).enable).toBe(false);
  });

  it('reads "true" and 1 as true', () => {
    expect(record({ enable: 'true' }).enable).toBe(true);
    expect(record({ enable: 1 }).enable).toBe(true);
  });

  it('reads 0 as false', () => {
    expect(record({ enable: 0 }).enable).toBe(false);
  });

  it('defaults to enabled when the field is missing', () => {
    expect(record({ enable: undefined }).enable).toBe(true);
  });
});

describe('remoteArticleSchema', () => {
  it('reads shuffle and loop flags written as strings', () => {
    const parsed = remoteArticleSchema.parse({
      name: 'Album',
      random: 'true',
      repeat: 'false',
      size: '4096',
    });

    expect(parsed.random).toBe(true);
    expect(parsed.repeat).toBe(false);
    expect(parsed.size).toBe(4096);
  });

  it('falls back to a usable article when fields are missing', () => {
    const parsed = remoteArticleSchema.parse({ name: '' });
    expect(parsed.name).toBe('Untitled');
    expect(parsed.size).toBe(0);
  });
});
