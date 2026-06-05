import { describe, it, expect } from 'vitest';
import {
  calculateThresholds,
  getQuadrant,
  getQuadrantIndex,
  defaultQuadrantStyles,
} from '../src/core/quadrant';
import { defaultTheme } from '../src/theme/useTheme';

describe('quadrant compute', () => {
  describe('calculateThresholds', () => {
    it('calculates mean correctly', () => {
      const values = [1, 2, 3, 4, 5];
      expect(calculateThresholds(values, 'mean')).toBe(3);
    });

    it('calculates median correctly for odd-length array', () => {
      const values = [1, 2, 3, 4, 5];
      expect(calculateThresholds(values, 'median')).toBe(3);
    });

    it('calculates median correctly for even-length array', () => {
      const values = [1, 2, 3, 4];
      expect(calculateThresholds(values, 'median')).toBe(2.5);
    });

    it('handles single value', () => {
      const values = [5];
      expect(calculateThresholds(values, 'mean')).toBe(5);
      expect(calculateThresholds(values, 'median')).toBe(5);
    });

    it('handles negative values', () => {
      const values = [-5, -2, 0, 2, 5];
      expect(calculateThresholds(values, 'mean')).toBe(0);
      expect(calculateThresholds(values, 'median')).toBe(0);
    });

    it('handles duplicate values', () => {
      const values = [1, 1, 1, 1];
      expect(calculateThresholds(values, 'mean')).toBe(1);
      expect(calculateThresholds(values, 'median')).toBe(1);
    });
  });

  describe('getQuadrant', () => {
    it('returns -1 when value < threshold', () => {
      expect(getQuadrant(2, 5)).toBe(-1);
    });

    it('returns 1 when value >= threshold', () => {
      expect(getQuadrant(5, 5)).toBe(1);
      expect(getQuadrant(6, 5)).toBe(1);
    });
  });

  describe('getQuadrantIndex', () => {
    it('returns 0 for top-left (x < threshold, y >= threshold)', () => {
      expect(getQuadrantIndex(2, 5, 6, 5)).toBe(0);
    });

    it('returns 1 for top-right (x >= threshold, y >= threshold)', () => {
      expect(getQuadrantIndex(5, 5, 6, 5)).toBe(1);
    });

    it('returns 2 for bottom-left (x < threshold, y < threshold)', () => {
      expect(getQuadrantIndex(2, 5, 4, 5)).toBe(2);
    });

    it('returns 3 for bottom-right (x >= threshold, y < threshold)', () => {
      expect(getQuadrantIndex(5, 5, 4, 5)).toBe(3);
    });

    it('handles threshold boundaries correctly', () => {
      expect(getQuadrantIndex(5, 5, 5, 5)).toBe(1); // top-right at boundary
    });
  });

  describe('defaultQuadrantStyles', () => {
    it('returns array of 4 styles', () => {
      const styles = defaultQuadrantStyles(defaultTheme);
      expect(styles).toHaveLength(4);
    });

    it('each style has required properties', () => {
      const styles = defaultQuadrantStyles(defaultTheme);
      styles.forEach((style) => {
        expect(style).toHaveProperty('dividerStroke');
        expect(style).toHaveProperty('dividerStrokeWidth');
        expect(style).toHaveProperty('backgroundColor');
        expect(style).toHaveProperty('backgroundOpacity');
      });
    });

    it('divider stroke width is positive number', () => {
      const styles = defaultQuadrantStyles(defaultTheme);
      styles.forEach((style) => {
        expect(typeof style.dividerStrokeWidth).toBe('number');
        expect(style.dividerStrokeWidth).toBeGreaterThan(0);
      });
    });

    it('background opacity is between 0 and 1', () => {
      const styles = defaultQuadrantStyles(defaultTheme);
      styles.forEach((style) => {
        expect(style.backgroundOpacity).toBeGreaterThanOrEqual(0);
        expect(style.backgroundOpacity).toBeLessThanOrEqual(1);
      });
    });
  });
});
