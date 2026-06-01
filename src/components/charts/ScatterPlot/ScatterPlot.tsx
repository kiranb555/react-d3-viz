import { CartesianChart } from '../../CartesianChart';
import { Points } from './Points';
import { resolveSeries, type BaseCartesianProps } from '../common';

export interface ScatterPlotProps extends BaseCartesianProps {
  /** Treat x as numeric (linear scale, default) or categorical (point scale). */
  categoricalX?: boolean;
  /** Dot radius. */
  pointRadius?: number;
}

/**
 * Scatter plot. By default x is numeric (linear scale) and each series is drawn
 * as dots. Set `categoricalX` for category-based scatter.
 */
export function ScatterPlot({ categoricalX = false, pointRadius, series, y, ...rest }: ScatterPlotProps) {
  const resolved = resolveSeries(series, y);
  return (
    <CartesianChart
      {...rest}
      series={resolved}
      xScaleType={categoricalX ? 'point' : 'linear'}
      renderSeries={(ctx) =>
        ctx.series.map((s) => (
          <Points key={s.seriesIndex} series={s} radius={pointRadius} animate={rest.animate} />
        ))
      }
    />
  );
}
