import { CartesianChart } from '../../CartesianChart';
import { Bars } from './Bar';
import { resolveSeries, type BaseCartesianProps } from '../common';

export interface BarChartProps extends BaseCartesianProps {
  /** Gap between adjacent categories (band inner padding), 0..1. */
  categoryGap?: number;
  /** Gap between grouped sub-bars within a category, 0..1. */
  groupGap?: number;
  /** Bar corner radius. */
  radius?: number;
  /** Stack series on top of each other instead of grouping side-by-side. */
  stacked?: boolean;
}

/**
 * Vertical bar chart. One series renders simple bars; multiple series render
 * grouped (side-by-side) bars, or stacked bars when `stacked` is set.
 */
export function BarChart({ categoryGap, groupGap, radius, stacked, series, y, ...rest }: BarChartProps) {
  const resolved = resolveSeries(series, y);
  return (
    <CartesianChart
      {...rest}
      series={resolved}
      xScaleType="band"
      bandPadding={categoryGap}
      stacked={stacked}
      renderSeries={() => <Bars animate={rest.animate} groupGap={groupGap} radius={radius} />}
    />
  );
}
