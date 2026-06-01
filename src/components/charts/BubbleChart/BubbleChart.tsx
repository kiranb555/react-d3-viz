import { G, Circle } from '../../../primitives';
import { CartesianChart } from '../../CartesianChart';
import { useChartContext } from '../../ChartContext';
import { useAnimatedValue } from '../../../hooks/useAnimatedValue';
import { getNumber } from '../../../core/accessors';
import { numericDomain } from '../../../core/scales';
import { scaleSqrt } from 'd3-scale';
import { resolveSeries, type BaseCartesianProps } from '../common';
import type { Accessor } from '../../../core/accessors';
import type { ResolvedSeries } from '../../chartTypes';

export interface BubbleChartProps extends BaseCartesianProps {
  /** Accessor for each point's magnitude (mapped to bubble radius). */
  size: Accessor<number>;
  /** Min/max bubble radius in px. Default [4, 28]. */
  radiusRange?: [number, number];
  /** Treat x as numeric (default) or categorical. */
  categoricalX?: boolean;
}

/**
 * Bubble chart — a scatter plot with a third dimension encoded as bubble area
 * (radius via a sqrt scale, so area is proportional to value).
 */
export function BubbleChart({ size, radiusRange = [4, 28], categoricalX = false, series, y, ...rest }: BubbleChartProps) {
  const resolved = resolveSeries(series, y);
  return (
    <CartesianChart
      {...rest}
      series={resolved}
      xScaleType={categoricalX ? 'point' : 'linear'}
      renderSeries={(ctx) =>
        ctx.series.map((s) => (
          <Bubbles key={s.seriesIndex} series={s} size={size} radiusRange={radiusRange} animate={rest.animate} />
        ))
      }
    />
  );
}

interface BubblesProps {
  series: ResolvedSeries;
  size: Accessor<number>;
  radiusRange: [number, number];
  animate?: boolean;
}

function Bubbles({ series, size, radiusRange, animate = true }: BubblesProps) {
  const { data, xPixel, yPixel, theme, active } = useChartContext();
  const t = useAnimatedValue({
    enabled: animate && theme.animation.enabled,
    durationMs: theme.animation.durationMs,
  });

  if (series.hidden) return null;

  const sizes = data.map((d, i) => getNumber(d, size, i));
  const sizeScale = scaleSqrt().domain(numericDomain(sizes, { includeZero: true, padTop: 0 })).range(radiusRange);

  return (
    <G>
      {data.map((d, i) => {
        const v = getNumber(d, series.dataKey, i);
        const sv = getNumber(d, size, i);
        if (!Number.isFinite(v) || !Number.isFinite(sv)) return null;
        const r = sizeScale(sv) * t;
        return (
          <Circle
            key={i}
            cx={xPixel(i)}
            cy={yPixel(v)}
            r={r}
            fill={series.color}
            fillOpacity={active?.index === i ? 0.55 : 0.35}
            stroke={series.color}
            strokeWidth={1.5}
          />
        );
      })}
    </G>
  );
}
