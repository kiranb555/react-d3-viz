import { G, Rect } from '../../../primitives';
import { useChartContext } from '../../ChartContext';
import { useAnimatedValue } from '../../../hooks/useAnimatedValue';
import { getNumber } from '../../../core/accessors';
import { lerp } from '../../../core/interpolate';

export interface BarsProps {
  animate?: boolean;
  /** Gap between grouped sub-bars, as a fraction of sub-bar width. */
  groupGap?: number;
  /** Corner radius for bars. */
  radius?: number;
}

/**
 * Renders bars for every visible series. Multiple series are grouped
 * side-by-side, or stacked when the chart's `stacked` flag is set. Bars animate
 * their height up from the baseline. Reads scales from chart context.
 */
export function Bars({ animate = true, groupGap = 0.1, radius = 2 }: BarsProps) {
  const { data, series, xPixel, xBandwidth, yPixel, baseline, active, theme, stacked } = useChartContext();
  const t = useAnimatedValue({
    enabled: animate && theme.animation.enabled,
    durationMs: theme.animation.durationMs,
  });

  const visible = series.filter((s) => !s.hidden);
  if (visible.length === 0) return null;

  return (
    <G>
      {data.map((d, i) => {
        const bandLeft = xPixel(i) - xBandwidth / 2;
        const dim = active && active.index !== i ? 0.78 : 1;

        if (stacked) {
          let cumulative = 0;
          return (
            <G key={i}>
              {visible.map((s) => {
                const v = getNumber(d, s.dataKey, i);
                if (!Number.isFinite(v)) return null;
                const segBottom = yPixel(cumulative);
                cumulative += v;
                const segTop = yPixel(cumulative);
                const curTop = lerp(segBottom, segTop, t);
                const rectY = Math.min(segBottom, curTop);
                const rectH = Math.abs(curTop - segBottom);
                return (
                  <Rect
                    key={s.seriesIndex}
                    x={bandLeft}
                    y={rectY}
                    width={xBandwidth}
                    height={rectH}
                    rx={radius}
                    ry={radius}
                    fill={s.color}
                    opacity={dim}
                  />
                );
              })}
            </G>
          );
        }

        const subW = xBandwidth / visible.length;
        const gap = subW * groupGap;
        const barW = Math.max(0, subW - gap);
        return (
          <G key={i}>
            {visible.map((s, j) => {
              const v = getNumber(d, s.dataKey, i);
              if (!Number.isFinite(v)) return null;
              const target = yPixel(v);
              const curY = lerp(baseline, target, t);
              const rectY = Math.min(baseline, curY);
              const rectH = Math.abs(curY - baseline);
              const rectX = bandLeft + j * subW + gap / 2;
              return (
                <Rect
                  key={s.seriesIndex}
                  x={rectX}
                  y={rectY}
                  width={barW}
                  height={rectH}
                  rx={radius}
                  ry={radius}
                  fill={s.color}
                  opacity={dim}
                />
              );
            })}
          </G>
        );
      })}
    </G>
  );
}
