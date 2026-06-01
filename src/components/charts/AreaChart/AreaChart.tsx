import { CartesianChart } from '../../CartesianChart';
import { LineSeries } from '../LineChart/Line';
import { resolveSeries, type BaseCartesianProps } from '../common';

export interface AreaChartProps extends BaseCartesianProps {
  categoricalX?: boolean;
  showPoints?: boolean;
}

/**
 * Area chart — a line chart with the region beneath each series filled. Shares
 * the line series renderer with `area` enabled.
 */
export function AreaChart({ categoricalX = true, showPoints, series, y, ...rest }: AreaChartProps) {
  const resolved = resolveSeries(series, y).map((s) => ({
    ...s,
    fillOpacity: s.fillOpacity ?? 0.25,
    showPoints: s.showPoints ?? showPoints,
  }));
  return (
    <CartesianChart
      {...rest}
      series={resolved}
      xScaleType={categoricalX ? 'point' : 'linear'}
      renderSeries={(ctx) =>
        ctx.series.map((s) => <LineSeries key={s.seriesIndex} series={s} area animate={rest.animate} />)
      }
    />
  );
}
