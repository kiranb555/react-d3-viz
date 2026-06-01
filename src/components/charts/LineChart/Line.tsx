import { G, Path, Circle } from '../../../primitives';
import { useChartContext } from '../../ChartContext';
import { useAnimatedValue } from '../../../hooks/useAnimatedValue';
import { linePath, areaPath, type Point } from '../../../core/shapes';
import { getNumber } from '../../../core/accessors';
import { lerp } from '../../../core/interpolate';
import type { ResolvedSeries } from '../../chartTypes';

export interface LineSeriesProps {
  series: ResolvedSeries;
  animate?: boolean;
  /** Fill the area beneath the line (used by AreaChart). */
  area?: boolean;
}

/**
 * Renders one line (and optional area fill) for a series. Animates by growing
 * each point up from the baseline. Reads scales from chart context.
 */
export function LineSeries({ series, animate = true, area = false }: LineSeriesProps) {
  const { data, xPixel, yPixel, baseline, theme, active } = useChartContext();
  const t = useAnimatedValue({
    enabled: animate && theme.animation.enabled,
    durationMs: theme.animation.durationMs,
  });

  if (series.hidden) return null;

  const points: Point[] = data.map((d, i) => {
    const v = getNumber(d, series.dataKey, i);
    const defined = Number.isFinite(v);
    return {
      x: xPixel(i),
      y: defined ? lerp(baseline, yPixel(v), t) : baseline,
      defined,
    };
  });

  const d = linePath(points, series.curve ?? 'monotone');
  const strokeWidth = series.strokeWidth ?? 2.5;

  return (
    <G>
      {area && (
        <Path
          d={areaPath(points, baseline, series.curve ?? 'monotone')}
          fill={series.color}
          fillOpacity={(series.fillOpacity ?? 0.15) * t}
          stroke="none"
        />
      )}
      <Path
        d={d}
        fill="none"
        stroke={series.color}
        strokeWidth={strokeWidth}
        strokeOpacity={0.95}
        strokeDasharray={series.dashArray}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {series.showPoints &&
        points.map((p, i) =>
          p.defined ? (
            <Circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={active?.index === i ? 5 : 3}
              fill={series.color}
              stroke="#fff"
              strokeWidth={1.5}
            />
          ) : null,
        )}
    </G>
  );
}
