import { describe, it, expect } from 'vitest';
import { candlestickGeometry, type OHLC } from '../src/core/candlestick';

// Simple inverted-linear pixel mapper: price 0 -> pixel 300, price 100 -> pixel 0.
// (mirrors a typical d3 linear y scale with range [innerHeight, 0])
const yPixel = (v: number) => 300 - v * 3;

const BANDWIDTH = 20;

describe('candlestickGeometry', () => {
  it('bounds: body/wick pixel coordinates fall within the range implied by yPixel', () => {
    const values: OHLC[] = [
      { open: 10, high: 30, low: 5, close: 25 },
      { open: 40, high: 55, low: 35, close: 42 },
    ];
    const xCenters = [10, 30];
    const geo = candlestickGeometry(values, xCenters, BANDWIDTH, yPixel);

    expect(geo).toHaveLength(2);
    geo.forEach((g, i) => {
      const v = values[i];
      const expectedTop = yPixel(v.high);
      const expectedBottom = yPixel(v.low);
      // wick top should be <= wick bottom in pixel space (since yPixel is inverted)
      expect(g.wickY1).toBeCloseTo(expectedTop);
      expect(g.wickY2).toBeCloseTo(expectedBottom);
      // body should sit within the wick's pixel span
      expect(g.bodyY).toBeGreaterThanOrEqual(Math.min(g.wickY1, g.wickY2) - 1e-6);
      expect(g.bodyY + g.bodyHeight).toBeLessThanOrEqual(Math.max(g.wickY1, g.wickY2) + 1e-6);
    });
  });

  it('no-overlap: adjacent candle bodies never overlap horizontally', () => {
    const values: OHLC[] = [
      { open: 10, high: 20, low: 5, close: 15 },
      { open: 15, high: 25, low: 10, close: 20 },
      { open: 20, high: 30, low: 15, close: 25 },
    ];
    // Centers spaced by exactly `BANDWIDTH` (as a band scale with paddingInner=0 would produce).
    const xCenters = [10, 30, 50];
    const geo = candlestickGeometry(values, xCenters, BANDWIDTH, yPixel, { bodyWidthRatio: 0.7 });

    for (let i = 0; i < geo.length - 1; i++) {
      const a = geo[i];
      const b = geo[i + 1];
      expect(a.bodyX + a.bodyWidth).toBeLessThanOrEqual(b.bodyX + 1e-6);
    }
  });

  it('proportionality: bodyHeight scales with |close - open| under a linear yPixel', () => {
    const values: OHLC[] = [
      { open: 10, high: 20, low: 5, close: 15 }, // |close-open| = 5
      { open: 10, high: 30, low: 5, close: 20 }, // |close-open| = 10
    ];
    const xCenters = [10, 30];
    const geo = candlestickGeometry(values, xCenters, BANDWIDTH, yPixel);

    // yPixel has slope -3, so pixel delta = 3 * price delta (unfloor'd).
    expect(geo[0].bodyHeight).toBeCloseTo(5 * 3);
    expect(geo[1].bodyHeight).toBeCloseTo(10 * 3);
    // Roughly double the price delta -> roughly double the body height.
    expect(geo[1].bodyHeight).toBeCloseTo(geo[0].bodyHeight * 2);
  });

  it('wick spans exactly high..low', () => {
    const values: OHLC[] = [{ open: 10, high: 42, low: 3, close: 20 }];
    const geo = candlestickGeometry(values, [10], BANDWIDTH, yPixel);
    expect(geo[0].wickY1).toBeCloseTo(yPixel(42));
    expect(geo[0].wickY2).toBeCloseTo(yPixel(3));
  });

  it('correctness: isUp === (close >= open)', () => {
    const values: OHLC[] = [
      { open: 10, high: 20, low: 5, close: 15 }, // up
      { open: 15, high: 20, low: 5, close: 10 }, // down
      { open: 10, high: 20, low: 5, close: 10 }, // flat -> up (close >= open)
    ];
    const geo = candlestickGeometry(values, [10, 30, 50], BANDWIDTH, yPixel);
    expect(geo[0].isUp).toBe(true);
    expect(geo[1].isUp).toBe(false);
    expect(geo[2].isUp).toBe(true);
  });

  it('edge case: open === close floors to minBodyHeight instead of zero', () => {
    const values: OHLC[] = [{ open: 20, high: 30, low: 10, close: 20 }];
    const geo = candlestickGeometry(values, [10], BANDWIDTH, yPixel, { minBodyHeight: 2 });
    expect(geo[0].bodyHeight).toBe(2);
    expect(geo[0].bodyHeight).toBeGreaterThan(0);
  });

  it('edge case: default minBodyHeight floors a near-zero body to ~1px', () => {
    const values: OHLC[] = [{ open: 20, high: 30, low: 10, close: 20 }];
    const geo = candlestickGeometry(values, [10], BANDWIDTH, yPixel);
    expect(geo[0].bodyHeight).toBeGreaterThanOrEqual(1);
  });

  it('edge case: high === low gives a flat/zero-length wick without NaN', () => {
    const values: OHLC[] = [{ open: 10, high: 10, low: 10, close: 10 }];
    const geo = candlestickGeometry(values, [10], BANDWIDTH, yPixel);
    expect(geo).toHaveLength(1);
    expect(geo[0].wickY1).toBe(geo[0].wickY2);
    expect(Number.isNaN(geo[0].wickY1)).toBe(false);
    expect(Number.isNaN(geo[0].wickY2)).toBe(false);
  });

  it('edge case: a datum with a NaN/missing OHLC value is skipped, not rendered with NaN coordinates', () => {
    const values: OHLC[] = [
      { open: 10, high: 20, low: 5, close: 15 },
      { open: NaN, high: 25, low: 10, close: 20 },
      { open: 10, high: 20, low: 5, close: 15 },
    ];
    const geo = candlestickGeometry(values, [10, 30, 50], BANDWIDTH, yPixel);
    expect(geo).toHaveLength(2);
    expect(geo.some((g) => Number.isNaN(g.bodyY) || Number.isNaN(g.bodyHeight) || Number.isNaN(g.wickY1))).toBe(false);
    // Original indices are preserved for x-position lookup, skipped ones aren't renumbered.
    expect(geo[0].index).toBe(0);
    expect(geo[1].index).toBe(2);
  });

  it('edge case: empty data returns an empty array', () => {
    expect(candlestickGeometry([], [], BANDWIDTH, yPixel)).toEqual([]);
  });

  it('edge case: a single candle renders correctly', () => {
    const values: OHLC[] = [{ open: 10, high: 20, low: 5, close: 18 }];
    const geo = candlestickGeometry(values, [50], BANDWIDTH, yPixel);
    expect(geo).toHaveLength(1);
    expect(geo[0].wickX).toBe(50);
    expect(geo[0].bodyX).toBeCloseTo(50 - (BANDWIDTH * 0.7) / 2);
    expect(geo[0].bodyWidth).toBeCloseTo(BANDWIDTH * 0.7);
  });

  it('respects a custom bodyWidthRatio', () => {
    const values: OHLC[] = [{ open: 10, high: 20, low: 5, close: 18 }];
    const geo = candlestickGeometry(values, [50], BANDWIDTH, yPixel, { bodyWidthRatio: 0.5 });
    expect(geo[0].bodyWidth).toBeCloseTo(BANDWIDTH * 0.5);
  });
});
