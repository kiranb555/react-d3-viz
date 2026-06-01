import type { Accessor } from '../../core/accessors';
import type { Datum, Margin, NumericDomain } from '../../core/types';
import type { ChartTheme, DeepPartial } from '../../theme/defaultTheme';
import type { SeriesConfig } from '../chartTypes';
import type { Dimension } from '../../hooks/useAutoSize';

/** Props shared by all Cartesian (x/y) charts. */
export interface BaseCartesianProps {
  data: Datum[];
  /** x accessor (category key for bar/line/area, numeric key for scatter). */
  x: Accessor<unknown>;
  /** Multiple series. Mutually exclusive with the `y` shorthand. */
  series?: SeriesConfig[];
  /** Single-series shorthand. */
  y?: Accessor<number>;
  /** Pixel width, or 'auto' (default) to fill the parent and re-flow on resize. */
  width?: Dimension;
  /** Pixel height, or 'auto' to derive from width via `aspect`. Default 300. */
  height?: Dimension;
  /** width / height ratio used when height is 'auto'. Default 2. */
  aspect?: number;
  margin?: Partial<Margin>;
  theme?: DeepPartial<ChartTheme>;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  xTickCount?: number;
  yTickCount?: number;
  formatX?: (value: unknown, index: number) => string;
  formatY?: (value: number) => string;
  yDomain?: NumericDomain;
  /** Disable enter animation regardless of theme. */
  animate?: boolean;
}

/** Resolve the `series` / `y` shorthand into a concrete series list. */
export function resolveSeries(
  series: SeriesConfig[] | undefined,
  y: Accessor<number> | undefined,
): SeriesConfig[] {
  if (series && series.length > 0) return series;
  if (y != null) return [{ dataKey: y }];
  return [];
}
