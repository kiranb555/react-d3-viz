import { describe, it, expect } from 'vitest';
import { funnelLayout } from '../src/core/funnel';

const EPS = 1e-6;

describe('funnelLayout — bounds', () => {
  it('keeps every trapezoid x-coordinate within [-width/2, width/2]', () => {
    const W = 400;
    const H = 300;
    const stages = funnelLayout([1000, 600, 300, 120, 40], { width: W, height: H });
    stages.forEach((s) => {
      expect(s.topWidth / 2).toBeLessThanOrEqual(W / 2 + EPS);
      expect(s.bottomWidth / 2).toBeLessThanOrEqual(W / 2 + EPS);
    });
  });

  it('keeps every trapezoid y-coordinate within [0, height]', () => {
    const W = 400;
    const H = 300;
    const stages = funnelLayout([1000, 600, 300, 120, 40], { width: W, height: H });
    stages.forEach((s) => {
      expect(s.y).toBeGreaterThanOrEqual(-EPS);
      expect(s.y + s.height).toBeLessThanOrEqual(H + EPS);
    });
  });

  it('lays out equal-height bands accounting for gap', () => {
    const W = 400;
    const H = 300;
    const gap = 4;
    const values = [1000, 600, 300, 120];
    const stages = funnelLayout(values, { width: W, height: H, gap });
    const n = values.length;
    const expectedHeight = (H - gap * (n - 1)) / n;
    stages.forEach((s, i) => {
      expect(s.height).toBeCloseTo(expectedHeight, 6);
      expect(s.y).toBeCloseTo(i * (expectedHeight + gap), 6);
    });
  });
});

describe('funnelLayout — proportionality', () => {
  it('scales bottomWidth linearly with value relative to max(values)', () => {
    const W = 500;
    const values = [1000, 500, 250];
    const stages = funnelLayout(values, { width: W, height: 300, minWidthRatio: 0 });
    const max = Math.max(...values);
    stages.forEach((s, i) => {
      expect(s.bottomWidth).toBeCloseTo((values[i] / max) * W, 6);
    });
  });

  it('the max-value stage bottomWidth fills the full width', () => {
    const W = 500;
    const values = [200, 800, 100];
    const stages = funnelLayout(values, { width: W, height: 300, minWidthRatio: 0 });
    expect(stages[1].bottomWidth).toBeCloseTo(W, 6);
  });
});

describe('funnelLayout — continuity', () => {
  it('stage i topWidth equals stage i-1 bottomWidth', () => {
    const stages = funnelLayout([1000, 600, 300, 120, 40], { width: 400, height: 300 });
    for (let i = 1; i < stages.length; i++) {
      expect(stages[i].topWidth).toBeCloseTo(stages[i - 1].bottomWidth, 6);
    }
  });

  it('stage 0 topWidth equals its own scaled bottomWidth', () => {
    const stages = funnelLayout([1000, 600, 300], { width: 400, height: 300 });
    expect(stages[0].topWidth).toBeCloseTo(stages[0].bottomWidth, 6);
  });
});

describe('funnelLayout — drop-off', () => {
  it('computes dropOffPct with the documented formula', () => {
    const values = [1000, 600, 300, 120];
    const stages = funnelLayout(values, { width: 400, height: 300 });
    for (let i = 1; i < stages.length; i++) {
      const expected = ((values[i - 1] - values[i]) / values[i - 1]) * 100;
      expect(stages[i].dropOffPct).toBeCloseTo(expected, 6);
    }
  });

  it('dropOffPct is null for stage 0', () => {
    const stages = funnelLayout([1000, 600, 300], { width: 400, height: 300 });
    expect(stages[0].dropOffPct).toBeNull();
  });

  it('computes pctOfFirst relative to stage 0', () => {
    const values = [1000, 600, 300];
    const stages = funnelLayout(values, { width: 400, height: 300 });
    stages.forEach((s, i) => {
      expect(s.pctOfFirst).toBeCloseTo((values[i] / values[0]) * 100, 6);
    });
    expect(stages[0].pctOfFirst).toBeCloseTo(100, 6);
  });
});

describe('funnelLayout — edge cases', () => {
  it('returns [] for an empty array', () => {
    expect(funnelLayout([], { width: 400, height: 300 })).toEqual([]);
  });

  it('handles a single stage without a taper (top === bottom, full width)', () => {
    const stages = funnelLayout([500], { width: 400, height: 300 });
    expect(stages).toHaveLength(1);
    expect(stages[0].topWidth).toBeCloseTo(stages[0].bottomWidth, 6);
    expect(stages[0].bottomWidth).toBeCloseTo(400, 6);
    expect(stages[0].dropOffPct).toBeNull();
  });

  it('produces a uniform-width stack for all-equal values, with no NaN', () => {
    const stages = funnelLayout([50, 50, 50, 50], { width: 400, height: 300 });
    stages.forEach((s) => {
      expect(s.bottomWidth).toBeCloseTo(400, 6);
      expect(s.topWidth).toBeCloseTo(400, 6);
      expect(Number.isNaN(s.bottomWidth)).toBe(false);
      expect(Number.isNaN(s.topWidth)).toBe(false);
      expect(Number.isNaN(s.dropOffPct ?? 0)).toBe(false);
    });
  });

  it('floors a zero mid-funnel value at minWidthRatio * width instead of collapsing to 0/NaN', () => {
    const W = 400;
    const minWidthRatio = 0.08;
    const stages = funnelLayout([1000, 0, 300], { width: W, height: 300, minWidthRatio });
    expect(stages[1].bottomWidth).toBeCloseTo(minWidthRatio * W, 6);
    expect(Number.isNaN(stages[1].bottomWidth)).toBe(false);
    expect(stages[1].bottomWidth).toBeGreaterThan(0);
  });

  it('handles all-zero values without NaN, flooring every band', () => {
    const W = 400;
    const minWidthRatio = 0.08;
    const stages = funnelLayout([0, 0, 0], { width: W, height: 300, minWidthRatio });
    stages.forEach((s) => {
      expect(s.bottomWidth).toBeCloseTo(minWidthRatio * W, 6);
      expect(Number.isNaN(s.bottomWidth)).toBe(false);
      expect(Number.isNaN(s.topWidth)).toBe(false);
    });
  });

  it('does not overflow the container width for non-monotonic values', () => {
    const W = 400;
    // A later stage larger than an earlier one.
    const stages = funnelLayout([300, 900, 200], { width: W, height: 300 });
    stages.forEach((s) => {
      expect(s.topWidth).toBeLessThanOrEqual(W + EPS);
      expect(s.bottomWidth).toBeLessThanOrEqual(W + EPS);
      expect(s.topWidth).toBeGreaterThanOrEqual(0);
      expect(s.bottomWidth).toBeGreaterThanOrEqual(0);
    });
  });

  it('never produces negative widths for negative values', () => {
    const stages = funnelLayout([1000, -50, 300], { width: 400, height: 300 });
    stages.forEach((s) => {
      expect(s.bottomWidth).toBeGreaterThan(0);
      expect(s.topWidth).toBeGreaterThan(0);
    });
  });
});

describe('funnelLayout — path & centroid', () => {
  it('produces a closed 4-point path string for the vertical (default) orientation', () => {
    const stages = funnelLayout([1000, 500], { width: 400, height: 300 });
    stages.forEach((s) => {
      expect(s.path.startsWith('M ')).toBe(true);
      expect(s.path.trim().endsWith('Z')).toBe(true);
      expect(s.path.match(/L /g)?.length).toBe(3);
    });
  });

  it('centroid sits at the vertical midpoint of the band, x centered at 0', () => {
    const stages = funnelLayout([1000, 500, 250], { width: 400, height: 300 });
    stages.forEach((s) => {
      expect(s.centroid[0]).toBeCloseTo(0, 6);
      expect(s.centroid[1]).toBeCloseTo(s.y + s.height / 2, 6);
    });
  });

  it('assigns sequential index and a default label', () => {
    const stages = funnelLayout([1000, 500], { width: 400, height: 300 });
    expect(stages[0].index).toBe(0);
    expect(stages[1].index).toBe(1);
    expect(typeof stages[0].label).toBe('string');
  });
});

describe('funnelLayout — horizontal orientation', () => {
  it('transposes the main taper axis onto x', () => {
    const W = 400;
    const H = 200;
    const stages = funnelLayout([1000, 500, 250], { width: W, height: H, orientation: 'horizontal' });
    // Main axis (stacking) runs along x now, so centroid x should progress stage to stage.
    expect(stages[1].centroid[0]).toBeGreaterThan(stages[0].centroid[0]);
    // Cross axis (taper) is centered at y = 0.
    stages.forEach((s) => expect(s.centroid[1]).toBeCloseTo(0, 6));
  });
});
