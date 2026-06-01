import { describe, it, expect } from 'vitest';
import { numericDomain, linear, band, point } from '../src/core/scales';

describe('numericDomain', () => {
  it('includes zero for all-positive data by default', () => {
    const [lo] = numericDomain([10, 20, 30]);
    expect(lo).toBe(0);
  });

  it('pads the top so the max does not touch the edge', () => {
    const [, hi] = numericDomain([0, 100], { padTop: 0.1 });
    expect(hi).toBeCloseTo(110);
  });

  it('falls back to [0,1] for empty input', () => {
    expect(numericDomain([])).toEqual([0, 1]);
  });

  it('gives a flat series breathing room', () => {
    const [lo, hi] = numericDomain([5, 5, 5], { includeZero: false });
    expect(hi).toBeGreaterThan(lo);
  });

  it('ignores non-finite values', () => {
    const [lo, hi] = numericDomain([NaN, Infinity, 10]);
    expect(Number.isFinite(lo)).toBe(true);
    expect(Number.isFinite(hi)).toBe(true);
  });
});

describe('linear', () => {
  it('maps domain to range', () => {
    const s = linear([0, 10], [0, 100]);
    expect(s(5)).toBe(50);
  });
});

describe('band', () => {
  it('places bands within the range with padding', () => {
    const s = band(['a', 'b', 'c'], [0, 300]);
    expect(s('a')).toBeGreaterThanOrEqual(0);
    expect((s('a') ?? 0) + s.bandwidth()).toBeLessThanOrEqual(300);
    expect(s.bandwidth()).toBeGreaterThan(0);
  });
});

describe('point', () => {
  it('spreads categories across the range', () => {
    const s = point(['a', 'b', 'c'], [0, 100]);
    expect(s('a')).toBeLessThan(s('c')!);
  });
});
