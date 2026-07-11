import { describe, it, expect } from 'vitest';
import { linePath, areaPath, pieArcs, resolveCurve, arcPath } from '../src/core/shapes';

describe('linePath', () => {
  it('produces a path string starting with a moveto', () => {
    const d = linePath([
      { x: 0, y: 0 },
      { x: 10, y: 20 },
    ], 'linear');
    expect(d.startsWith('M')).toBe(true);
  });

  it('returns empty string for no points', () => {
    expect(linePath([])).toBe('');
  });

  it('skips undefined points (gaps)', () => {
    const d = linePath([
      { x: 0, y: 0 },
      { x: 5, y: 5, defined: false },
      { x: 10, y: 0 },
    ], 'linear');
    // A gap creates two separate subpaths -> two movetos.
    expect((d.match(/M/g) ?? []).length).toBe(2);
  });
});

describe('areaPath', () => {
  it('produces a closed-ish area path', () => {
    const d = areaPath([
      { x: 0, y: 10 },
      { x: 10, y: 0 },
    ], 100, 'linear');
    expect(d.length).toBeGreaterThan(0);
    expect(d.startsWith('M')).toBe(true);
  });
});

describe('pieArcs', () => {
  it('creates one arc per value covering the full circle', () => {
    const arcs = pieArcs([1, 1, 2], 100);
    expect(arcs).toHaveLength(3);
    const total = arcs[arcs.length - 1].endAngle - arcs[0].startAngle;
    expect(total).toBeCloseTo(Math.PI * 2);
  });

  it('supports a donut (innerRadius > 0)', () => {
    const arcs = pieArcs([1, 1], 100, 50);
    expect(arcs[0].path.length).toBeGreaterThan(0);
  });

  it('preserves original index', () => {
    const arcs = pieArcs([5, 3, 8]);
    expect(arcs.map((a) => a.index)).toEqual([0, 1, 2]);
  });
});

describe('resolveCurve', () => {
  it('returns a curve factory for each name', () => {
    (['linear', 'monotone', 'catmullRom', 'step'] as const).forEach((c) => {
      expect(typeof resolveCurve(c)).toBe('function');
    });
  });
});

describe('arcPath', () => {
  it('produces a path string starting with a moveto', () => {
    const { path } = arcPath(0, Math.PI / 2, 100, 50);
    expect(path.startsWith('M')).toBe(true);
  });

  it('computes the centroid at the arc angular/radial midpoint', () => {
    // d3-arc angle convention: 0 rad = 12 o'clock, increasing clockwise.
    // A point at angle a, radius r is (r*sin(a), -r*cos(a)).
    const { centroid } = arcPath(0, Math.PI / 2, 100, 50);
    const midAngle = Math.PI / 4;
    const midR = 75;
    expect(centroid[0]).toBeCloseTo(midR * Math.sin(midAngle), 5);
    expect(centroid[1]).toBeCloseTo(-midR * Math.cos(midAngle), 5);
  });

  it('defaults innerRadius/cornerRadius to 0 when omitted', () => {
    const withDefaults = arcPath(0, Math.PI / 2, 100);
    const explicitZero = arcPath(0, Math.PI / 2, 100, 0, 0);
    expect(withDefaults.path).toBe(explicitZero.path);
  });

  it('supports a full-circle open arc (0 to 2π) without throwing', () => {
    const { path } = arcPath(0, Math.PI * 2, 100);
    expect(path.length).toBeGreaterThan(0);
  });

  it('is a standalone helper — does not require a d3.pie() datum object', () => {
    // Regression guard: arcPath must build the generator with constant
    // start/end angles, not rely on a per-datum accessor like pieArcs does.
    const a = arcPath(-Math.PI / 2, Math.PI / 2, 50, 20, 4);
    expect(a.path).toContain('M');
    expect(Number.isFinite(a.centroid[0])).toBe(true);
    expect(Number.isFinite(a.centroid[1])).toBe(true);
  });
});
