import { describe, it, expect } from 'vitest';
import { makeAccessor, getNumber, getCategory } from '../src/core/accessors';

describe('makeAccessor', () => {
  it('reads a value by key', () => {
    expect(makeAccessor<number>('y')({ y: 7 }, 0)).toBe(7);
  });
  it('passes through a function accessor', () => {
    expect(makeAccessor<number>((d) => (d.a as number) + 1)({ a: 1 }, 0)).toBe(2);
  });
});

describe('getNumber', () => {
  it('coerces to number', () => {
    expect(getNumber({ v: '12' }, 'v', 0)).toBe(12);
  });
  it('returns NaN for non-numeric', () => {
    expect(Number.isNaN(getNumber({ v: 'x' }, 'v', 0))).toBe(true);
  });
});

describe('getCategory', () => {
  it('stringifies the value', () => {
    expect(getCategory({ c: 5 }, 'c', 0)).toBe('5');
  });
});
