/**
 * Gauge layout — pure JS, no DOM, no React. Computes a speedometer-style arc
 * (via `arcPath`), a value→angle mapping (via `core/scales.ts`'s `linear()`),
 * threshold-band arcs, a needle endpoint, and tick positions. Runs unchanged
 * on web and React Native, the same way `core/treemap.ts` / `core/sunburst.ts`
 * replace `d3-hierarchy`.
 *
 * Angle convention: matches d3-shape's `arc()` generator (used by `arcPath`
 * and `pieArcs`) — radians, 0 at 12 o'clock, increasing clockwise. A point at
 * angle `a` and radius `r` from the origin is `(r*sin(a), -r*cos(a))` (SVG y
 * grows downward). This mirrors `RadarChart`'s axis-point trig
 * (`-Math.PI/2 + ...` offset cos/sin), just expressed directly in the d3-arc
 * frame with no `-π/2` offset needed since 0 is already "up".
 */
import { arcPath } from './shapes';
import { linear } from './scales';

const DEG = Math.PI / 180;

/** Default sweep start angle: -135°, i.e. the classic speedometer dial. */
export const DEFAULT_START_ANGLE = -135 * DEG;
/** Default sweep end angle: +135° (a 270° sweep, not a plain semicircle). */
export const DEFAULT_END_ANGLE = 135 * DEG;
/** Default number of tick marks when `tickCount` is omitted. */
export const DEFAULT_TICK_COUNT = 5;
/** Needle tip length as a fraction of its reference radius. */
const NEEDLE_LENGTH_RATIO = 0.92;

export interface GaugeBand {
  from: number;
  to: number;
  color: string;
}

export interface GaugeOptions {
  min: number;
  max: number;
  startAngle?: number;
  endAngle?: number;
  radius: number;
  innerRadius?: number;
  bands?: GaugeBand[];
  tickCount?: number;
}

export interface GaugeResult {
  valueAngle: number;
  valuePath: string;
  trackPath: string;
  bandArcs: { path: string; color: string; from: number; to: number }[];
  needle: { x1: number; y1: number; x2: number; y2: number } | null;
  ticks: { angle: number; x: number; y: number; value: number; label: string }[];
}

/** Point on the circle of radius `r` at angle `a`, in the d3-arc convention. */
function pointAt(angle: number, r: number): [number, number] {
  return [r * Math.sin(angle), -r * Math.cos(angle)];
}

/** Format a tick's numeric value as a short label (2 decimal places, trimmed). */
function formatTickValue(value: number): string {
  return String(Math.round(value * 100) / 100);
}

/**
 * Compute a gauge's arc/needle/tick geometry for a single `value`. `value` is
 * clamped to `[min, max]` before mapping to an angle; `min === max` collapses
 * the domain to a single point (no divide-by-zero — `core/scales.ts`'s
 * `linear()` degrades gracefully to the range midpoint via d3-scale).
 */
export function gaugeLayout(value: number, opts: GaugeOptions): GaugeResult {
  const { min, max, radius } = opts;
  const startAngle = opts.startAngle ?? DEFAULT_START_ANGLE;
  const endAngle = opts.endAngle ?? DEFAULT_END_ANGLE;
  const innerRadius = opts.innerRadius ?? 0;
  const tickCount = Math.max(0, opts.tickCount ?? DEFAULT_TICK_COUNT);
  const bands = opts.bands ?? [];

  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  const clamp = (v: number): number => (lo === hi ? min : Math.min(hi, Math.max(lo, v)));

  const scale = linear([min, max], [startAngle, endAngle]);
  const clamped = clamp(value);
  const valueAngle = scale(clamped);

  const trackPath = arcPath(startAngle, endAngle, radius, innerRadius).path;
  const valuePath = arcPath(startAngle, valueAngle, radius, innerRadius).path;

  const bandArcs = bands.map((band) => {
    const a0 = scale(clamp(band.from));
    const a1 = scale(clamp(band.to));
    return {
      path: arcPath(Math.min(a0, a1), Math.max(a0, a1), radius, innerRadius).path,
      color: band.color,
      from: band.from,
      to: band.to,
    };
  });

  const needle =
    radius > 0
      ? (() => {
          const tipRadius = (innerRadius > 0 ? innerRadius : radius) * NEEDLE_LENGTH_RATIO;
          const [x2, y2] = pointAt(valueAngle, tipRadius);
          return { x1: 0, y1: 0, x2, y2 };
        })()
      : null;

  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const t = tickCount <= 1 ? 0 : i / (tickCount - 1);
    const tickValue = min + (max - min) * t;
    const angle = scale(clamp(tickValue));
    const [x, y] = pointAt(angle, radius);
    return { angle, x, y, value: tickValue, label: formatTickValue(tickValue) };
  });

  return { valueAngle, valuePath, trackPath, bandArcs, needle, ticks };
}
