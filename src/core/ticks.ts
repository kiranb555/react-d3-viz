import type { ScaleLinear, ScaleTime, ScaleBand, ScalePoint } from 'd3-scale';
import type { Tick } from './types';

export type Formatter = (value: unknown) => string;

const defaultNumberFormat: Formatter = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return String(v);
  // Compact-ish default: trim trailing zeros.
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, '');
};

/**
 * Compute ticks for a continuous (linear or time) scale. `count` is a hint to
 * d3; the actual number returned may differ to land on "nice" values.
 */
export function continuousTicks(
  scale: ScaleLinear<number, number> | ScaleTime<number, number>,
  count = 5,
  format?: Formatter,
): Tick[] {
  const values = scale.ticks(count);
  const fmt = format ?? ((v: unknown) => String(scale.tickFormat(count)(v as never)));
  return values.map((value) => ({
    value: typeof value === 'number' ? value : +value,
    position: scale(value as never),
    label: fmt(value),
  }));
}

/**
 * Compute ticks for a categorical (band or point) scale — one per category,
 * positioned at the band center.
 */
export function categoricalTicks(
  scale: ScaleBand<string> | ScalePoint<string>,
  format?: Formatter,
): Tick[] {
  const fmt = format ?? ((v: unknown) => String(v));
  const half = 'bandwidth' in scale ? scale.bandwidth() / 2 : 0;
  return scale.domain().map((value, i) => ({
    value: i,
    position: (scale(value) ?? 0) + half,
    label: fmt(value),
  }));
}

export { defaultNumberFormat };
