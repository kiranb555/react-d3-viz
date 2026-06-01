import type { Accessor } from '../core/accessors';
import type { ChartBounds, Datum, Tick } from '../core/types';
import type { CurveType } from '../core/shapes';
import type { ChartTheme } from '../theme/defaultTheme';

/** Configuration for one data series (a line, area band, or bar group). */
export interface SeriesConfig {
  /** Key or function selecting the numeric value from each datum. */
  dataKey: Accessor<number>;
  /** Human label shown in legend/tooltip. Defaults to the dataKey string. */
  label?: string;
  /** Series color. Defaults to the theme palette by index. */
  color?: string;
  /** Line/area curve interpolation. */
  curve?: CurveType;
  /** Line stroke width. */
  strokeWidth?: number;
  /** Render dots at each point (line/area). */
  showPoints?: boolean;
  /** Area fill opacity. */
  fillOpacity?: number;
  /** Dashed stroke. */
  dashArray?: string;
}

/** The hovered/active data point, shared via context for tooltip + highlight. */
export interface ActivePoint {
  index: number;
  /** Pixel x of the active category/point (for the tooltip crosshair). */
  x: number;
}

/** Everything a Cartesian series renderer or composed child needs. */
export interface CartesianContextValue {
  data: Datum[];
  x: Accessor<unknown>;
  series: ResolvedSeries[];
  bounds: ChartBounds;
  theme: ChartTheme;
  /** value -> pixel along x. For band/point scales `bandwidth` may be > 0. */
  xPixel: (index: number) => number;
  xBandwidth: number;
  /** value -> pixel along y. */
  yPixel: (value: number) => number;
  /** Pixel y of the value=0 baseline (clamped into range). */
  baseline: number;
  /** Precomputed x-axis ticks (positions in inner coordinates). */
  xTicks: Tick[];
  /** Precomputed y-axis ticks (positions in inner coordinates). */
  yTicks: Tick[];
  /** Whether series should be stacked rather than grouped/overlaid. */
  stacked: boolean;
  active: ActivePoint | null;
  setActive: (a: ActivePoint | null) => void;
  /** Toggle a series' visibility (used by the interactive legend). */
  toggleSeries: (seriesIndex: number) => void;
}

/** A series with all defaults resolved (color/label always present). */
export interface ResolvedSeries extends SeriesConfig {
  color: string;
  label: string;
  /** Index in the series list, used for palette + legend toggling. */
  seriesIndex: number;
  /** When true the series is hidden via the legend and skipped by renderers. */
  hidden?: boolean;
}
