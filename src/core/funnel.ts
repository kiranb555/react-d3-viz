/**
 * Pure-JS geometry for funnel charts. No D3, no DOM, no React — just pixel
 * math (manual 4-point trapezoid paths), so it runs identically on web and
 * React Native, the same way `core/treemap.ts` / `core/sunburst.ts` replace
 * `d3-hierarchy`.
 *
 * Continuous taper: stage `i`'s `topWidth` equals stage `i-1`'s `bottomWidth`,
 * giving the classic unbroken funnel silhouette. `bottomWidth` is derived from
 * `values[i]` scaled against `max(values)` and floored at `minWidthRatio *
 * width` so a near-zero (or zero/negative) final stage stays visible instead
 * of collapsing to an invisible sliver.
 */

export interface FunnelStage {
  index: number;
  label: string;
  value: number;
  /** Trapezoid width at the top of the band. */
  topWidth: number;
  /** Trapezoid width at the bottom of the band. */
  bottomWidth: number;
  /** Position of the band's start along the main (stacking) axis. */
  y: number;
  /** Length of the band along the main (stacking) axis. */
  height: number;
  /** Closed SVG path (`M/L/L/L/Z`) for the trapezoid, centered on the cross axis. */
  path: string;
  centroid: [number, number];
  /** `values[i] / values[0] * 100`. */
  pctOfFirst: number;
  /** `(values[i-1] - values[i]) / values[i-1] * 100`; `null` for stage 0. */
  dropOffPct: number | null;
}

export interface FunnelOptions {
  width: number;
  height: number;
  /** Gap between consecutive bands, in px. Default 6. */
  gap?: number;
  /** Minimum band width as a fraction of `width`. Default 0.08. */
  minWidthRatio?: number;
  /** Default `'vertical'` (top-to-bottom). `'horizontal'` transposes x/y. */
  orientation?: 'vertical' | 'horizontal';
}

/** Compute a funnel's trapezoid geometry from a flat array of stage values. */
export function funnelLayout(values: number[], opts: FunnelOptions): FunnelStage[] {
  const n = values.length;
  if (n === 0) return [];

  const gap = opts.gap ?? 6;
  const minWidthRatio = opts.minWidthRatio ?? 0.08;
  const orientation = opts.orientation ?? 'vertical';

  // Main axis = the stacking/progression axis (top-to-bottom for vertical,
  // left-to-right for horizontal). Cross axis = the taper axis.
  const mainLen = orientation === 'horizontal' ? opts.width : opts.height;
  const crossLen = orientation === 'horizontal' ? opts.height : opts.width;

  const bandLen = Math.max(0, (mainLen - gap * (n - 1)) / n);
  const minCross = minWidthRatio * crossLen;

  const rawMax = Math.max(...values);
  const maxV = rawMax > 0 ? rawMax : 1;

  const crossWidth = (v: number): number => {
    if (!Number.isFinite(v)) return minCross;
    const raw = (v / maxV) * crossLen;
    return Math.max(minCross, raw);
  };

  const bottomWidths = values.map(crossWidth);
  const firstValue = values[0];

  return values.map((value, i) => {
    const bottomWidth = bottomWidths[i];
    const topWidth = i === 0 ? bottomWidth : bottomWidths[i - 1];
    const mainStart = i * (bandLen + gap);
    const mainEnd = mainStart + bandLen;

    // Local points as [cross, main] pairs, centered at cross = 0.
    const localPoints: [number, number][] = [
      [-topWidth / 2, mainStart],
      [topWidth / 2, mainStart],
      [bottomWidth / 2, mainEnd],
      [-bottomWidth / 2, mainEnd],
    ];
    // Vertical: [cross, main] maps directly to [x, y]. Horizontal: transpose.
    const points: [number, number][] =
      orientation === 'horizontal' ? localPoints.map(([c, m]) => [m, c]) : localPoints;

    const path = `M ${points.map(([x, y]) => `${x},${y}`).join(' L ')} Z`;
    const centroidLocal: [number, number] = [0, mainStart + bandLen / 2];
    const centroid: [number, number] =
      orientation === 'horizontal' ? [centroidLocal[1], centroidLocal[0]] : centroidLocal;

    const pctOfFirst = firstValue !== 0 ? (value / firstValue) * 100 : 0;
    const prev = i > 0 ? values[i - 1] : null;
    const dropOffPct = i === 0 || prev === null ? null : prev !== 0 ? ((prev - value) / prev) * 100 : 0;

    return {
      index: i,
      label: String(i + 1),
      value,
      topWidth,
      bottomWidth,
      y: mainStart,
      height: bandLen,
      path,
      centroid,
      pctOfFirst,
      dropOffPct,
    };
  });
}
