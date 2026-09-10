import { formatBytes, formatDuration, pluralize } from '../format';

describe('formatDuration', () => {
  it('formats whole minutes and seconds', () => {
    expect(formatDuration(93)).toBe('01:33');
    expect(formatDuration(600)).toBe('10:00');
  });

  it('floors fractional seconds', () => {
    expect(formatDuration(9.9)).toBe('00:09');
  });

  it('falls back to zero for missing or nonsensical input', () => {
    expect(formatDuration(0)).toBe('00:00');
    expect(formatDuration(-5)).toBe('00:00');
    expect(formatDuration(Number.NaN)).toBe('00:00');
    expect(formatDuration(Number.POSITIVE_INFINITY)).toBe('00:00');
  });
});

describe('formatBytes', () => {
  it('scales to the nearest binary unit', () => {
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(41984)).toBe('41 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(5 * 1024 * 1024)).toBe('5.0 MB');
  });

  it('reports zero for empty or invalid sizes', () => {
    expect(formatBytes(0)).toBe('0 KB');
    expect(formatBytes(-1)).toBe('0 KB');
    expect(formatBytes(Number.NaN)).toBe('0 KB');
  });
});

describe('pluralize', () => {
  it('keeps the singular for exactly one', () => {
    expect(pluralize(1, 'record')).toBe('1 record');
    expect(pluralize(0, 'record')).toBe('0 records');
    expect(pluralize(2, 'record')).toBe('2 records');
  });

  it('accepts an irregular plural', () => {
    expect(pluralize(2, 'entry', 'entries')).toBe('2 entries');
  });
});
