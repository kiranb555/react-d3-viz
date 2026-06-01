import { describe, it, expect } from 'vitest';
import { clamp01, lerp, lerpArray, easing } from '../src/core/interpolate';

describe('clamp01', () => {
  it('clamps below 0 and above 1', () => {
    expect(clamp01(-2)).toBe(0);
    expect(clamp01(5)).toBe(1);
    expect(clamp01(0.3)).toBe(0.3);
  });
});

describe('lerp', () => {
  it('interpolates endpoints and midpoint', () => {
    expect(lerp(0, 10, 0)).toBe(0);
    expect(lerp(0, 10, 1)).toBe(10);
    expect(lerp(0, 10, 0.5)).toBe(5);
  });
});

describe('lerpArray', () => {
  it('interpolates element-wise', () => {
    expect(lerpArray([0, 0], [10, 20], 0.5)).toEqual([5, 10]);
  });
});

describe('easing', () => {
  it('all easings map 0->0 and 1->1', () => {
    Object.values(easing).forEach((fn) => {
      expect(fn(0)).toBeCloseTo(0);
      expect(fn(1)).toBeCloseTo(1);
    });
  });
});
