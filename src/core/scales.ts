import { scaleLinear, scaleBand, scalePoint, scaleTime } from 'd3-scale';
import { extent } from 'd3-array';
import type { NumericDomain } from './types';

/**
 * Compute a numeric domain from raw values. Adds a small headroom pad on the
 * max (and floors the min at 0 when all values are non-negative) so lines and
 * bars don't touch the chart edge. Falls back to [0, 1] for empty input.
 */
export function numericDomain(
  values: number[],
  opts: { padTop?: number; includeZero?: boolean } = {},
): NumericDomain {
  const { padTop = 0.05, includeZero = true } = opts;
  const finite = values.filter((v) => Number.isFinite(v));
  if (finite.length === 0) return [0, 1];

  const [min, max] = extent(finite) as [number, number];
  let lo = min;
  let hi = max;
  if (includeZero && lo > 0) lo = 0;
  if (includeZero && hi < 0) hi = 0;
  if (lo === hi) {
    // Flat series — give it a unit of breathing room.
    return [lo === 0 ? 0 : lo - Math.abs(lo) * 0.1, hi + (hi === 0 ? 1 : Math.abs(hi) * 0.1)];
  }
  const span = hi - lo;
  hi = hi + span * padTop;
  return [lo, hi];
}

/** Continuous linear scale mapping a numeric domain to a pixel range. */
export function linear(domain: NumericDomain, range: [number, number]) {
  return scaleLinear().domain(domain).range(range);
}

/** Time scale mapping a [start, end] date domain to a pixel range. */
export function time(domain: [Date, Date], range: [number, number]) {
  return scaleTime().domain(domain).range(range);
}

/**
 * Band scale for categorical bar charts. `paddingInner`/`paddingOuter` control
 * the gaps between and around bands.
 */
export function band(
  domain: string[],
  range: [number, number],
  opts: { paddingInner?: number; paddingOuter?: number } = {},
) {
  return scaleBand<string>()
    .domain(domain)
    .range(range)
    .paddingInner(opts.paddingInner ?? 0.2)
    .paddingOuter(opts.paddingOuter ?? 0.1);
}

/** Point scale for categorical line/area x-positions (no band width). */
export function point(domain: string[], range: [number, number], padding = 0.5) {
  return scalePoint<string>().domain(domain).range(range).padding(padding);
}
