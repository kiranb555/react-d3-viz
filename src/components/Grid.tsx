import { G, Line } from '../primitives';
import { useChartContext } from './ChartContext';

export interface GridProps {
  /** Draw horizontal grid lines (along y ticks). Default true. */
  horizontal?: boolean;
  /** Draw vertical grid lines (along x ticks). Default false. */
  vertical?: boolean;
  color?: string;
  strokeWidth?: number;
  dashArray?: string;
}

/** Background grid lines aligned to the axis ticks. Reads chart context. */
export function Grid({ horizontal = true, vertical = false, color, strokeWidth, dashArray }: GridProps) {
  const { bounds, theme, xTicks, yTicks } = useChartContext();
  const stroke = color ?? theme.grid.color;
  const sw = strokeWidth ?? theme.grid.strokeWidth;
  const dash = dashArray ?? theme.grid.dashArray;

  return (
    <G>
      {horizontal &&
        yTicks.map((t, i) => (
          <Line
            key={`h${i}`}
            x1={0}
            y1={t.position}
            x2={bounds.innerWidth}
            y2={t.position}
            stroke={stroke}
            strokeWidth={sw}
            strokeDasharray={dash}
          />
        ))}
      {vertical &&
        xTicks.map((t, i) => (
          <Line
            key={`v${i}`}
            x1={t.position}
            y1={0}
            x2={t.position}
            y2={bounds.innerHeight}
            stroke={stroke}
            strokeWidth={sw}
            strokeDasharray={dash}
          />
        ))}
    </G>
  );
}
