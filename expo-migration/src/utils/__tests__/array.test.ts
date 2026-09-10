import { moveItem } from '../array';

describe('moveItem', () => {
  const items = ['a', 'b', 'c', 'd'] as const;

  it('moves an item forward and backward', () => {
    expect(moveItem(items, 0, 2)).toEqual(['b', 'c', 'a', 'd']);
    expect(moveItem(items, 3, 1)).toEqual(['a', 'd', 'b', 'c']);
  });

  it('never mutates the input', () => {
    const source = [...items];
    moveItem(source, 0, 3);
    expect(source).toEqual(['a', 'b', 'c', 'd']);
  });

  it('returns a copy when the move is a no-op or out of range', () => {
    expect(moveItem(items, 1, 1)).toEqual(['a', 'b', 'c', 'd']);
    expect(moveItem(items, -1, 2)).toEqual(['a', 'b', 'c', 'd']);
    expect(moveItem(items, 0, 9)).toEqual(['a', 'b', 'c', 'd']);
    expect(moveItem([], 0, 0)).toEqual([]);
  });
});
