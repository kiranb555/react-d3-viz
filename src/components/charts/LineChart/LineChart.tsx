import { CartesianChart } from '../../CartesianChart';
import { LineSeries } from './Line';
import { resolveSeries, type BaseCartesianProps } from '../common';

export interface LineChartProps extends BaseCartesianProps {
  /** Use a point scale (true, default) or a numeric linear x scale. */
  categoricalX?: boolean;
  /** Render dots at every point across all series. */
  showPoints?: boolean;
}

/**
 * Multi-series line chart. Pass `data` + `x` + either `y` (single series) or
 * `series` (multiple). Everything else is optional and themeable.
 */
export function LineChart({ categoricalX = true, showPoints, series, y, ...rest }: LineChartProps) {
  const resolved = resolveSeries(series, y).map((s) => ({
    ...s,
    showPoints: s.showPoints ?? showPoints,
  }));
  return (
    <CartesianChart
      {...rest}
      series={resolved}
      xScaleType={categoricalX ? 'point' : 'linear'}
      renderSeries={(ctx) =>
        ctx.series.map((s) => <LineSeries key={s.seriesIndex} series={s} animate={rest.animate} />)
      }
    />
  );
}
