import { describe, it, expect } from 'vitest';
import { linear, band } from '../src/core/scales';
import { continuousTicks, categoricalTicks } from '../src/core/ticks';

describe('continuousTicks', () => {
  it('produces nice tick values within range', () => {
    const s = linear([0, 100], [0, 500]);
    const ticks = continuousTicks(s, 5);
    expect(ticks.length).toBeGreaterThan(0);
    ticks.forEach((t) => {
      expect(t.position).toBeGreaterThanOrEqual(0);
      expect(t.position).toBeLessThanOrEqual(500);
      expect(typeof t.label).toBe('string');
    });
  });

  it('uses a custom formatter when provided', () => {
    const s = linear([0, 10], [0, 100]);
    const ticks = continuousTicks(s, 2, (v) => `$${v}`);
    expect(ticks[0].label.startsWith('$')).toBe(true);
  });
});

describe('categoricalTicks', () => {
  it('returns one tick per category centered on the band', () => {
    const s = band(['a', 'b', 'c'], [0, 300]);
    const ticks = categoricalTicks(s);
    expect(ticks.map((t) => t.label)).toEqual(['a', 'b', 'c']);
    const center = (s('a') ?? 0) + s.bandwidth() / 2;
    expect(ticks[0].position).toBeCloseTo(center);
  });
});
