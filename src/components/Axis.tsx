import { G, Line, SvgText } from '../primitives';
import { useChartContext } from './ChartContext';

export interface AxisProps {
  /** Hide the axis baseline rule. */
  hideLine?: boolean;
  /** Hide the per-tick marks. */
  hideTicks?: boolean;
  color?: string;
  labelColor?: string;
  labelSize?: number;
}

/** Bottom (x) axis: baseline, tick marks, and labels. Reads chart context. */
export function XAxis({ hideLine, hideTicks, color, labelColor, labelSize }: AxisProps) {
  const { bounds, theme, xTicks } = useChartContext();
  const axisColor = color ?? theme.axis.color;
  const lblColor = labelColor ?? theme.axis.labelColor;
  const lblSize = labelSize ?? theme.axis.labelSize;
  const y = bounds.innerHeight;

  return (
    <G>
      {!hideLine && (
        <Line x1={0} y1={y} x2={bounds.innerWidth} y2={y} stroke={axisColor} strokeWidth={theme.axis.strokeWidth} />
      )}
      {xTicks.map((t, i) => (
        <G key={i}>
          {!hideTicks && (
            <Line x1={t.position} y1={y} x2={t.position} y2={y + theme.axis.tickLength} stroke={axisColor} strokeWidth={theme.axis.strokeWidth} />
          )}
          <SvgText
            x={t.position}
            y={y + theme.axis.tickLength + 4}
            fill={lblColor}
            fontSize={lblSize}
            fontFamily={theme.font.family}
            textAnchor="middle"
            verticalAnchor="start"
          >
            {t.label}
          </SvgText>
        </G>
      ))}
    </G>
  );
}

/** Left (y) axis: baseline, tick marks, and labels. Reads chart context. */
export function YAxis({ hideLine, hideTicks, color, labelColor, labelSize }: AxisProps) {
  const { bounds, theme, yTicks } = useChartContext();
  const axisColor = color ?? theme.axis.color;
  const lblColor = labelColor ?? theme.axis.labelColor;
  const lblSize = labelSize ?? theme.axis.labelSize;

  return (
    <G>
      {!hideLine && (
        <Line x1={0} y1={0} x2={0} y2={bounds.innerHeight} stroke={axisColor} strokeWidth={theme.axis.strokeWidth} />
      )}
      {yTicks.map((t, i) => (
        <G key={i}>
          {!hideTicks && (
            <Line x1={-theme.axis.tickLength} y1={t.position} x2={0} y2={t.position} stroke={axisColor} strokeWidth={theme.axis.strokeWidth} />
          )}
          <SvgText
            x={-theme.axis.tickLength - 4}
            y={t.position}
            fill={lblColor}
            fontSize={lblSize}
            fontFamily={theme.font.family}
            textAnchor="end"
            verticalAnchor="middle"
          >
            {t.label}
          </SvgText>
        </G>
      ))}
    </G>
  );
}
