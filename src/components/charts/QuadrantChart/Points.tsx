import { G, Circle } from '../../../primitives';
import { useChartContext } from '../../ChartContext';
import { useAnimatedValue } from '../../../hooks/useAnimatedValue';
import { getNumber } from '../../../core/accessors';
import { numericDomain } from '../../../core/scales';
import { scaleSqrt } from 'd3-scale';
import type { ResolvedSeries } from '../../chartTypes';
import type { Accessor } from '../../../core/accessors';

interface PointsProps {
  series: ResolvedSeries;
  size?: Accessor<number>;
  radiusRange?: [number, number];
  pointRadius?: number;
  animate?: boolean;
}

/**
 * Points component — renders circles for each data point in a quadrant chart.
 * Supports optional bubble sizing via a size accessor (sqrt scale).
 * Highlights points on hover and animates radius on mount.
 */
export function Points({
  series,
  size,
  radiusRange = [4, 28],
  pointRadius,
  animate = true,
}: PointsProps) {
  const { data, xPixel, yPixel, theme, active } = useChartContext();

  const t = useAnimatedValue({
    enabled: animate && theme.animation.enabled,
    durationMs: theme.animation.durationMs,
  });

  if (series.hidden) return null;

  let sizeScale: (v: number) => number | undefined;
  if (size) {
    const sizes = data.map((d, i) => getNumber(d, size, i));
    sizeScale = scaleSqrt()
      .domain(numericDomain(sizes, { includeZero: true, padTop: 0 }))
      .range(radiusRange);
  }

  return (
    <G>
      {data.map((d, i) => {
        const v = getNumber(d, series.dataKey, i);
        if (!Number.isFinite(v)) return null;

        const x = xPixel(i);
        const y = yPixel(v);
        let r = pointRadius ?? 4;

        if (size && sizeScale) {
          const sv = getNumber(d, size, i);
          if (!Number.isFinite(sv)) return null;
          r = sizeScale(sv) || 4;
        }

        r = r * t;

        const isActive = active?.index === i;

        return (
          <Circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill={series.color}
            fillOpacity={isActive ? 0.8 : 0.5}
            stroke={series.color}
            strokeWidth={1.5}
          />
        );
      })}
    </G>
  );
}
