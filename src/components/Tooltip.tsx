import { G, Rect, Line, Circle, SvgText } from '../primitives';
import { useChartContext } from './ChartContext';
import { getNumber } from '../core/accessors';
import { getContrastingTextColor } from '../utils/colorHelpers';

export interface TooltipProps {
  /** Show the vertical crosshair line at the active point. Default true. */
  crosshair?: boolean;
  /** Highlight each series value with a dot. Default true. */
  highlightPoints?: boolean;
  /** Format the numeric value shown for each series. */
  format?: (value: number, seriesLabel: string) => string;
  /** Custom label for the header row (defaults to the x category). */
  headerFormat?: (index: number) => string;
}

const CHAR_W = 0.6; // rough character width factor for sizing SVG text boxes

/**
 * SVG-native tooltip: a crosshair, per-series highlight dots, and a value box.
 * Rendered entirely with primitives so it works identically on web and native.
 */
export function Tooltip({ crosshair = true, highlightPoints = true, format, headerFormat }: TooltipProps) {
  const { active, series, data, x, theme, bounds, yPixel } = useChartContext();
  if (!active) return null;

  const datum = data[active.index];
  if (!datum) return null;

  const fmt = format ?? ((v: number) => String(Math.round(v * 100) / 100));
  const header = headerFormat
    ? headerFormat(active.index)
    : typeof x === 'function'
      ? ''
      : String(datum[x as string]);

  const rows = series
    .filter((s) => !s.hidden)
    .map((s) => ({
      color: s.color,
      text: `${s.label}: ${fmt(getNumber(datum, s.dataKey, active.index), s.label)}`,
    }));

  const fontSize = theme.tooltip.fontSize;
  const lineH = fontSize + 6;
  const pad = 8;
  const longest = Math.max(header.length, ...rows.map((r) => r.text.length + 2), 1);
  const boxW = pad * 2 + 12 + longest * fontSize * CHAR_W;
  const boxH = pad * 2 + lineH * (rows.length + (header ? 1 : 0));

  // Flip to the left of the crosshair when near the right edge.
  const flip = active.x + boxW + 16 > bounds.innerWidth;
  const boxX = flip ? active.x - boxW - 12 : active.x + 12;
  const boxY = Math.max(0, Math.min(8, bounds.innerHeight - boxH));

  // Use first series color for tooltip background (dynamic color)
  const bgColor = rows.length > 0 ? rows[0].color : theme.tooltip.background;
  const textColor = getContrastingTextColor(bgColor);

  return (
    <G>
      {crosshair && (
        <Line
          x1={active.x}
          y1={0}
          x2={active.x}
          y2={bounds.innerHeight}
          stroke={theme.axis.color}
          strokeWidth={1}
          strokeDasharray="4 3"
        />
      )}
      {highlightPoints &&
        series
          .filter((s) => !s.hidden)
          .map((s, i) => {
            const v = getNumber(datum, s.dataKey, active.index);
            if (!Number.isFinite(v)) return null;
            return (
              <Circle
                key={i}
                cx={active.x}
                cy={yPixel(v)}
                r={4}
                fill={s.color}
                stroke="#fff"
                strokeWidth={2}
              />
            );
          })}
      <G transform={`translate(${boxX},${boxY})`}>
        <Rect
          x={0}
          y={0}
          width={boxW}
          height={boxH}
          rx={theme.tooltip.radius}
          ry={theme.tooltip.radius}
          fill={bgColor}
          stroke={textColor}
          strokeWidth={1}
          opacity={0.95}
        />
        {header ? (
          <SvgText
            x={pad}
            y={pad + fontSize - 2}
            fill={textColor}
            fontSize={fontSize}
            fontWeight="bold"
            fontFamily={theme.font.family}
            verticalAnchor="start"
          >
            {header}
          </SvgText>
        ) : null}
        {rows.map((r, i) => {
          const rowY = pad + (header ? lineH : 0) + i * lineH + lineH / 2;
          return (
            <G key={i}>
              <Rect x={pad} y={rowY - 4} width={8} height={8} rx={2} fill={r.color} />
              <SvgText
                x={pad + 14}
                y={rowY}
                fill={textColor}
                fontSize={fontSize}
                fontFamily={theme.font.family}
                verticalAnchor="middle"
              >
                {r.text}
              </SvgText>
            </G>
          );
        })}
      </G>
    </G>
  );
}
