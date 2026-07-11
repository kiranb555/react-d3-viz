import { Svg, G, Path, Rect, Circle, Line, SvgText } from '../../../primitives';
import { useTheme } from '../../../theme/useTheme';
import { useAnimatedValue } from '../../../hooks/useAnimatedValue';
import { useAutoSize, type Dimension } from '../../../hooks/useAutoSize';
import { gaugeLayout, DEFAULT_START_ANGLE, DEFAULT_END_ANGLE } from '../../../core/gauge';
import { lerp } from '../../../core/interpolate';
import type { ChartTheme, DeepPartial } from '../../../theme/defaultTheme';

export interface GaugeThreshold {
  from: number;
  to: number;
  color: string;
  label?: string;
}

export interface GaugeChartProps {
  /**
   * The current reading. Clamped to `[min, max]` before it's plotted — the
   * needle, progress/band arcs, and the value label (`showValue`) all reflect
   * the clamped value, so the on-screen number always matches the needle.
   */
  value: number;
  /** Default 0. */
  min?: number;
  /** Default 100. */
  max?: number;
  /** Pixel width, or 'auto' (default) to fill the parent. */
  width?: Dimension;
  /** Pixel height, or 'auto' to derive from width via `aspect`. */
  height?: Dimension;
  /** width / height ratio when height is 'auto'. Default 1.6 (wide — the arc is a partial circle). */
  aspect?: number;
  /** Sweep start angle in radians (d3-arc convention: 0 = 12 o'clock, clockwise). Default -135°. */
  startAngle?: number;
  /** Sweep end angle in radians. Default +135°. */
  endAngle?: number;
  /** Colored threshold zones (e.g. red/yellow/green). When given, replaces the single-color progress arc. */
  thresholds?: GaugeThreshold[];
  /** Show the needle. Default true. */
  showNeedle?: boolean;
  /** Show the large centered value label. Default true. */
  showValue?: boolean;
  /** Show tick marks + labels around the arc. Default true. */
  showTicks?: boolean;
  /** Number of tick marks (including both endpoints). Default 5. */
  tickCount?: number;
  /** Format the displayed value / tick labels. Default `toLocaleString`. */
  formatValue?: (value: number) => string;
  theme?: DeepPartial<ChartTheme>;
  /** Override the single-color progress arc's color (first entry used). Ignored when `thresholds` is set. */
  colors?: string[];
  /** Sweep the needle/arc in from `min` on mount. Default follows the theme's animation setting. */
  animate?: boolean;
}

/** A point on the circle of radius `r` at angle `a` (d3-arc convention: 0 = 12 o'clock, clockwise). */
function arcPoint(angle: number, r: number): [number, number] {
  return [r * Math.sin(angle), -r * Math.cos(angle)];
}

/**
 * Axis-aligned bounding box (at unit radius) swept by an arc from `startAngle`
 * to `endAngle`. Samples both endpoints plus any cardinal direction (0, ±90°,
 * 180°) the sweep passes through, since sin/cos extrema only occur there.
 * Used to fit an arbitrary sweep (semicircle, 270° speedometer, full circle,
 * reversed, ...) snugly inside the chart's pixel box.
 */
function arcBounds(startAngle: number, endAngle: number): { minX: number; maxX: number; minY: number; maxY: number } {
  const lo = Math.min(startAngle, endAngle);
  const hi = Math.max(startAngle, endAngle);
  const candidates = [startAngle, endAngle];
  for (let k = Math.ceil(lo / (Math.PI / 2)); k * (Math.PI / 2) <= hi; k++) {
    candidates.push(k * (Math.PI / 2));
  }
  const pts = candidates.map((a) => arcPoint(a, 1));
  return {
    minX: Math.min(...pts.map((p) => p[0])),
    maxX: Math.max(...pts.map((p) => p[0])),
    minY: Math.min(...pts.map((p) => p[1])),
    maxY: Math.max(...pts.map((p) => p[1])),
  };
}

/**
 * Gauge / speedometer chart. Self-contained (does not use the Cartesian
 * frame). Renders a background track arc, then either a single-color
 * progress arc (default) or colored threshold-band zones (when `thresholds`
 * is set), plus an optional needle, tick marks, and a large value label.
 */
export function GaugeChart({
  value,
  min = 0,
  max = 100,
  width,
  height,
  aspect = 1.6,
  startAngle = DEFAULT_START_ANGLE,
  endAngle = DEFAULT_END_ANGLE,
  thresholds,
  showNeedle = true,
  showValue = true,
  showTicks = true,
  tickCount = 5,
  formatValue,
  theme: themeOverride,
  colors,
  animate,
}: GaugeChartProps) {
  const theme = useTheme(themeOverride);
  const size = useAutoSize(width, height ?? 'auto', aspect);
  const progressColor = (colors ?? theme.colors)[0];
  const fmt = formatValue ?? ((v: number) => v.toLocaleString());

  const t = useAnimatedValue({
    enabled: (animate ?? theme.animation.enabled) && theme.animation.enabled,
    durationMs: theme.animation.durationMs,
  });

  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  const clampedValue = lo === hi ? min : Math.min(hi, Math.max(lo, value));
  const displayValue = lerp(min, clampedValue, t);

  const pad = 16;
  const tickSpace = showTicks ? 26 : 6;
  const valueSpace = showValue ? 38 : 0;
  const availW = Math.max(0, size.width - pad * 2);
  const availH = Math.max(0, size.height - pad * 2 - valueSpace);

  const bounds = arcBounds(startAngle, endAngle);
  const boundW = bounds.maxX - bounds.minX || 1;
  const boundH = bounds.maxY - bounds.minY || 1;
  const radius = Math.max(0, Math.min(availW / boundW, (availH - tickSpace) / boundH));

  const cx = size.width / 2 - ((bounds.minX + bounds.maxX) / 2) * radius;
  const cy = pad + tickSpace - bounds.minY * radius;

  const result = gaugeLayout(displayValue, {
    min,
    max,
    startAngle,
    endAngle,
    radius,
    bands: thresholds,
    tickCount: showTicks ? tickCount : 0,
  });

  const hasBands = !!thresholds && thresholds.length > 0;
  const valueFontSize = Math.max(14, Math.min(32, radius * 0.32));
  const tickLabelFontSize = Math.max(8, theme.legend.fontSize - 2);

  return (
    <Svg width={size.svgWidth} height={size.svgHeight} onLayout={size.onLayout}>
      {size.width > 0 && (
        <>
          {theme.background !== 'transparent' && (
            <Rect x={0} y={0} width={size.width} height={size.height} fill={theme.background} />
          )}
          <G transform={`translate(${cx},${cy})`}>
            <Path d={result.trackPath} fill={theme.grid.color} />
            {hasBands
              ? result.bandArcs.map((band, i) => <Path key={i} d={band.path} fill={band.color} />)
              : radius > 0 && <Path d={result.valuePath} fill={progressColor} />}

            {showTicks &&
              result.ticks.map((tick, i) => {
                const [ix, iy] = arcPoint(tick.angle, radius * 0.9);
                const [ox, oy] = arcPoint(tick.angle, radius * 1.02);
                const [lx, ly] = arcPoint(tick.angle, radius + 14);
                return (
                  <G key={i}>
                    <Line x1={ix} y1={iy} x2={ox} y2={oy} stroke={theme.axis.tickColor} strokeWidth={1.5} />
                    <SvgText
                      x={lx}
                      y={ly}
                      fill={theme.axis.labelColor}
                      fontSize={tickLabelFontSize}
                      fontFamily={theme.font.family}
                      textAnchor="middle"
                      verticalAnchor="middle"
                    >
                      {formatValue ? formatValue(tick.value) : tick.label}
                    </SvgText>
                  </G>
                );
              })}

            {showNeedle && result.needle && (
              <>
                <Line
                  x1={result.needle.x1}
                  y1={result.needle.y1}
                  x2={result.needle.x2}
                  y2={result.needle.y2}
                  stroke={theme.font.color}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
                <Circle cx={0} cy={0} r={6} fill={theme.font.color} />
              </>
            )}
          </G>

          {showValue && (
            <SvgText
              x={cx}
              y={size.height - pad - valueSpace / 2}
              fill={theme.font.color}
              fontSize={valueFontSize}
              fontFamily={theme.font.family}
              fontWeight="bold"
              textAnchor="middle"
              verticalAnchor="middle"
            >
              {fmt(displayValue)}
            </SvgText>
          )}
        </>
      )}
    </Svg>
  );
}
