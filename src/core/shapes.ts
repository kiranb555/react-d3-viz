import {
  line as d3line,
  area as d3area,
  arc as d3arc,
  pie as d3pie,
  curveLinear,
  curveMonotoneX,
  curveCatmullRom,
  curveStep,
  type CurveFactory,
} from 'd3-shape';

/** Supported curve interpolations, exposed as friendly string names. */
export type CurveType = 'linear' | 'monotone' | 'catmullRom' | 'step';

export function resolveCurve(curve: CurveType = 'monotone'): CurveFactory {
  switch (curve) {
    case 'linear':
      return curveLinear;
    case 'catmullRom':
      return curveCatmullRom;
    case 'step':
      return curveStep;
    case 'monotone':
    default:
      return curveMonotoneX;
  }
}

export interface Point {
  x: number;
  y: number;
  /** When false, the point is treated as a gap (defined() === false). */
  defined?: boolean;
}

/** Build an SVG path string for a line through already-scaled pixel points. */
export function linePath(points: Point[], curve: CurveType = 'monotone'): string {
  const gen = d3line<Point>()
    .x((p) => p.x)
    .y((p) => p.y)
    .defined((p) => p.defined !== false)
    .curve(resolveCurve(curve));
  return gen(points) ?? '';
}

/** Build an SVG path string for a filled area from `baseline` up to each point. */
export function areaPath(
  points: Point[],
  baseline: number,
  curve: CurveType = 'monotone',
): string {
  const gen = d3area<Point>()
    .x((p) => p.x)
    .y0(baseline)
    .y1((p) => p.y)
    .defined((p) => p.defined !== false)
    .curve(resolveCurve(curve));
  return gen(points) ?? '';
}

export interface ArcDatum {
  value: number;
  /** Original index, preserved through the pie layout. */
  index: number;
}

export interface ComputedArc {
  index: number;
  value: number;
  startAngle: number;
  endAngle: number;
  /** SVG path string for the slice, centered at (0,0). */
  path: string;
  /** Centroid [x, y] for label/leader placement, relative to (0,0). */
  centroid: [number, number];
}

/**
 * Compute pie/donut slices. Returns path strings centered at the origin — the
 * caller translates the group to the chart center. `innerRadius > 0` => donut.
 */
export function pieArcs(
  values: number[],
  outerRadius = 100,
  innerRadius = 0,
  opts: { padAngle?: number; cornerRadius?: number } = {},
): ComputedArc[] {
  const layout = d3pie<number>()
    .value((v) => v)
    .sort(null)
    .padAngle(opts.padAngle ?? 0);

  const generator = d3arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .cornerRadius(opts.cornerRadius ?? 0);

  return layout(values).map((slice) => ({
    index: slice.index,
    value: slice.value,
    startAngle: slice.startAngle,
    endAngle: slice.endAngle,
    path: generator(slice as never) ?? '',
    centroid: generator.centroid(slice as never) as [number, number],
  }));
}

/**
 * Build a single open arc path — e.g. for gauges, progress rings, or any
 * freestanding arc that isn't part of a `d3.pie()` layout. Uses `d3-shape`'s
 * `arc()` generator directly with constant `startAngle`/`endAngle` (not a
 * per-datum accessor), so no pie layout step is needed. Angles follow
 * d3-shape's arc convention: radians, 0 at 12 o'clock, increasing clockwise.
 * The path is centered at the origin — the caller translates the group.
 */
export function arcPath(
  startAngle: number,
  endAngle: number,
  outerRadius: number,
  innerRadius = 0,
  cornerRadius = 0,
): { path: string; centroid: [number, number] } {
  const generator = d3arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .cornerRadius(cornerRadius)
    .startAngle(startAngle)
    .endAngle(endAngle);

  return {
    path: generator(undefined as never) ?? '',
    centroid: generator.centroid(undefined as never) as [number, number],
  };
}
