import { describe, it, expect } from 'vitest';
import { gaugeLayout, DEFAULT_START_ANGLE, DEFAULT_END_ANGLE } from '../src/core/gauge';
import { linear } from '../src/core/scales';
import { arcPath } from '../src/core/shapes';

const DEG = Math.PI / 180;

describe('gaugeLayout — valueAngle bounds & clamping', () => {
  it('clamps an out-of-range-below value to startAngle', () => {
    const r = gaugeLayout(-50, { min: 0, max: 100, radius: 100, startAngle: -135 * DEG, endAngle: 135 * DEG });
    expect(r.valueAngle).toBeCloseTo(-135 * DEG, 6);
  });

  it('clamps an out-of-range-above value to endAngle', () => {
    const r = gaugeLayout(500, { min: 0, max: 100, radius: 100, startAngle: -135 * DEG, endAngle: 135 * DEG });
    expect(r.valueAngle).toBeCloseTo(135 * DEG, 6);
  });

  it('keeps valueAngle within [startAngle, endAngle] across a sweep of values', () => {
    const startAngle = -135 * DEG;
    const endAngle = 135 * DEG;
    for (const v of [-1000, -1, 0, 1, 25, 50, 75, 99, 100, 101, 99999]) {
      const r = gaugeLayout(v, { min: 0, max: 100, radius: 100, startAngle, endAngle });
      expect(r.valueAngle).toBeGreaterThanOrEqual(Math.min(startAngle, endAngle) - 1e-9);
      expect(r.valueAngle).toBeLessThanOrEqual(Math.max(startAngle, endAngle) + 1e-9);
    }
  });

  it('defaults to a speedometer-style -135°..+135° sweep when startAngle/endAngle are omitted', () => {
    expect(DEFAULT_START_ANGLE).toBeCloseTo(-135 * DEG, 6);
    expect(DEFAULT_END_ANGLE).toBeCloseTo(135 * DEG, 6);
    const atMin = gaugeLayout(0, { min: 0, max: 100, radius: 100 });
    const atMax = gaugeLayout(100, { min: 0, max: 100, radius: 100 });
    expect(atMin.valueAngle).toBeCloseTo(-135 * DEG, 6);
    expect(atMax.valueAngle).toBeCloseTo(135 * DEG, 6);
  });
});

describe('gaugeLayout — proportionality', () => {
  it('is linear in value: matches core/scales.ts linear() directly', () => {
    const min = 0;
    const max = 200;
    const startAngle = -135 * DEG;
    const endAngle = 135 * DEG;
    const scale = linear([min, max], [startAngle, endAngle]);
    for (const v of [0, 10, 50, 100, 150, 200]) {
      const r = gaugeLayout(v, { min, max, radius: 100, startAngle, endAngle });
      expect(r.valueAngle).toBeCloseTo(scale(v), 6);
    }
  });

  it('maps the midpoint of [min,max] to the angular midpoint of [startAngle,endAngle]', () => {
    const startAngle = -135 * DEG;
    const endAngle = 135 * DEG;
    const r = gaugeLayout(50, { min: 0, max: 100, radius: 100, startAngle, endAngle });
    expect(r.valueAngle).toBeCloseTo((startAngle + endAngle) / 2, 6);
  });
});

describe('gaugeLayout — threshold bands', () => {
  it('produces contiguous (non-overlapping) band angle edges spanning the full sweep when bands fully cover [min,max]', () => {
    const min = 0;
    const max = 100;
    const startAngle = -135 * DEG;
    const endAngle = 135 * DEG;
    const bands = [
      { from: 0, to: 40, color: 'red' },
      { from: 40, to: 70, color: 'yellow' },
      { from: 70, to: 100, color: 'green' },
    ];
    const scale = linear([min, max], [startAngle, endAngle]);
    const edges = [min, 40, 70, max].map((v) => scale(v));

    // Strictly increasing => contiguous, no overlap, no gap.
    for (let i = 1; i < edges.length; i++) {
      expect(edges[i]).toBeGreaterThan(edges[i - 1]);
    }
    expect(edges[0]).toBeCloseTo(Math.min(startAngle, endAngle), 6);
    expect(edges[edges.length - 1]).toBeCloseTo(Math.max(startAngle, endAngle), 6);

    // gaugeLayout's bandArcs must use exactly this same angle math (round-trip
    // through the shared, separately-tested arcPath helper).
    const result = gaugeLayout(50, { min, max, radius: 100, startAngle, endAngle, bands });
    expect(result.bandArcs).toHaveLength(3);
    bands.forEach((band, i) => {
      const a0 = scale(band.from);
      const a1 = scale(band.to);
      const expected = arcPath(Math.min(a0, a1), Math.max(a0, a1), 100, 0).path;
      expect(result.bandArcs[i].path).toBe(expected);
      expect(result.bandArcs[i].color).toBe(band.color);
      expect(result.bandArcs[i].from).toBe(band.from);
      expect(result.bandArcs[i].to).toBe(band.to);
    });
  });

  it('handles bands that do not cover the full range without throwing', () => {
    const result = gaugeLayout(50, {
      min: 0,
      max: 100,
      radius: 100,
      bands: [{ from: 20, to: 30, color: 'blue' }],
    });
    expect(result.bandArcs).toHaveLength(1);
    expect(result.bandArcs[0].path.length).toBeGreaterThan(0);
  });

  it('empty thresholds array still produces a valid trackPath/valuePath', () => {
    const result = gaugeLayout(50, { min: 0, max: 100, radius: 100, bands: [] });
    expect(result.bandArcs).toEqual([]);
    expect(result.trackPath.length).toBeGreaterThan(0);
    expect(result.valuePath.length).toBeGreaterThan(0);
  });

  it('omitted thresholds (no bands key) still produce a valid trackPath/valuePath', () => {
    const result = gaugeLayout(50, { min: 0, max: 100, radius: 100 });
    expect(result.bandArcs).toEqual([]);
    expect(result.trackPath.length).toBeGreaterThan(0);
    expect(result.valuePath.length).toBeGreaterThan(0);
  });
});

describe('gaugeLayout — needle trig correctness', () => {
  it('points straight up (angle 0) when valueAngle === 0', () => {
    const r = gaugeLayout(0, { min: 0, max: 100, radius: 100, startAngle: 0, endAngle: Math.PI / 2 });
    expect(r.needle).not.toBeNull();
    const { x1, y1, x2, y2 } = r.needle!;
    expect(x1).toBe(0);
    expect(y1).toBe(0);
    expect(x2).toBeCloseTo(0, 6);
    expect(y2).toBeLessThan(0); // pointing up (negative y = up in SVG space)
  });

  it('points to the right (angle 90°) when valueAngle === π/2', () => {
    const r = gaugeLayout(100, { min: 0, max: 100, radius: 100, startAngle: 0, endAngle: Math.PI / 2 });
    const { x2, y2 } = r.needle!;
    expect(y2).toBeCloseTo(0, 6);
    expect(x2).toBeGreaterThan(0); // pointing right
  });

  it('needle tip length is constant regardless of value/angle (only direction changes)', () => {
    const a = gaugeLayout(0, { min: 0, max: 100, radius: 100, startAngle: 0, endAngle: Math.PI / 2 });
    const b = gaugeLayout(100, { min: 0, max: 100, radius: 100, startAngle: 0, endAngle: Math.PI / 2 });
    const lenA = Math.hypot(a.needle!.x2, a.needle!.y2);
    const lenB = Math.hypot(b.needle!.x2, b.needle!.y2);
    expect(lenA).toBeCloseTo(lenB, 6);
    expect(lenA).toBeGreaterThan(0);
  });

  it('matches the (r*sin(a), -r*cos(a)) convention at a known non-cardinal angle', () => {
    const startAngle = -135 * DEG;
    const endAngle = 135 * DEG;
    const r = gaugeLayout(75, { min: 0, max: 100, radius: 100, startAngle, endAngle });
    const len = Math.hypot(r.needle!.x2, r.needle!.y2);
    expect(r.needle!.x2).toBeCloseTo(len * Math.sin(r.valueAngle), 6);
    expect(r.needle!.y2).toBeCloseTo(-len * Math.cos(r.valueAngle), 6);
  });
});

describe('gaugeLayout — edge cases', () => {
  it('min === max does not divide by zero / produce NaN', () => {
    const r = gaugeLayout(10, { min: 10, max: 10, radius: 100 });
    expect(Number.isNaN(r.valueAngle)).toBe(false);
    expect(Number.isFinite(r.valueAngle)).toBe(true);
    expect(r.trackPath.length).toBeGreaterThan(0);
    expect(r.valuePath.length).toBeGreaterThan(0);
  });

  it('min === max clamps any input value to a single point without throwing', () => {
    expect(() => gaugeLayout(-999, { min: 5, max: 5, radius: 100 })).not.toThrow();
    expect(() => gaugeLayout(999, { min: 5, max: 5, radius: 100 })).not.toThrow();
    const r1 = gaugeLayout(-999, { min: 5, max: 5, radius: 100 });
    const r2 = gaugeLayout(999, { min: 5, max: 5, radius: 100 });
    expect(r1.valueAngle).toBeCloseTo(r2.valueAngle, 6);
  });

  it('radius <= 0 produces a null needle instead of NaN geometry', () => {
    const r = gaugeLayout(50, { min: 0, max: 100, radius: 0 });
    expect(r.needle).toBeNull();
  });

  it('handles a reversed sweep (endAngle < startAngle) without throwing', () => {
    const r = gaugeLayout(50, { min: 0, max: 100, radius: 100, startAngle: 135 * DEG, endAngle: -135 * DEG });
    expect(Number.isFinite(r.valueAngle)).toBe(true);
    expect(r.trackPath.length).toBeGreaterThan(0);
  });
});

describe('gaugeLayout — ticks', () => {
  it('generates tickCount ticks spanning [min, max] inclusive of both endpoints', () => {
    const r = gaugeLayout(50, { min: 0, max: 100, radius: 100, tickCount: 5 });
    expect(r.ticks).toHaveLength(5);
    expect(r.ticks[0].value).toBeCloseTo(0, 6);
    expect(r.ticks[r.ticks.length - 1].value).toBeCloseTo(100, 6);
  });

  it('positions each tick at (radius*sin(angle), -radius*cos(angle))', () => {
    const r = gaugeLayout(50, { min: 0, max: 100, radius: 100, tickCount: 3 });
    r.ticks.forEach((tick) => {
      expect(tick.x).toBeCloseTo(100 * Math.sin(tick.angle), 6);
      expect(tick.y).toBeCloseTo(-100 * Math.cos(tick.angle), 6);
    });
  });

  it('defaults to a reasonable tick count when omitted', () => {
    const r = gaugeLayout(50, { min: 0, max: 100, radius: 100 });
    expect(r.ticks.length).toBeGreaterThan(0);
  });

  it('tickCount 0 produces no ticks', () => {
    const r = gaugeLayout(50, { min: 0, max: 100, radius: 100, tickCount: 0 });
    expect(r.ticks).toEqual([]);
  });
});
