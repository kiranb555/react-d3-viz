import { G, Circle } from '../../../primitives';
import { useChartContext } from '../../ChartContext';
import { useAnimatedValue } from '../../../hooks/useAnimatedValue';
import { getNumber } from '../../../core/accessors';
import type { ResolvedSeries } from '../../chartTypes';

export interface PointsProps {
  series: ResolvedSeries;
  radius?: number;
  animate?: boolean;
}

/** Renders one series as scatter dots, fading/growing in. Reads chart context. */
export function Points({ series, radius = 4, animate = true }: PointsProps) {
  const { data, xPixel, yPixel, theme, active } = useChartContext();
  const t = useAnimatedValue({
    enabled: animate && theme.animation.enabled,
    durationMs: theme.animation.durationMs,
  });

  if (series.hidden) return null;

  return (
    <G>
      {data.map((d, i) => {
        const v = getNumber(d, series.dataKey, i);
        if (!Number.isFinite(v)) return null;
        const r = (active?.index === i ? radius + 2 : radius) * t;
        return (
          <Circle
            key={i}
            cx={xPixel(i)}
            cy={yPixel(v)}
            r={r}
            fill={series.color}
            fillOpacity={0.75}
            stroke={series.color}
            strokeWidth={1}
          />
        );
      })}
    </G>
  );
}
