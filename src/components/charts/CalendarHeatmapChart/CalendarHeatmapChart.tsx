import { useMemo, useState } from 'react';
import { extent } from 'd3-array';
import { Svg, G, Rect, SvgText } from '../../../primitives';
import { useTheme } from '../../../theme/useTheme';
import { useAnimatedValue } from '../../../hooks/useAnimatedValue';
import { useAutoSize, type Dimension } from '../../../hooks/useAutoSize';
import { calendarHeatmapLayout, type CalendarCell } from '../../../core/calendarHeatmap';
import { createLinearColorScale, type HeatmapColorScale } from '../../../core/heatmap';
import type { NumericDomain } from '../../../core/types';
import type { ChartTheme, DeepPartial } from '../../../theme/defaultTheme';

export interface CalendarHeatmapChartProps {
  /** One entry per day with a known value. Missing days render as empty/neutral cells. */
  data: { date: string | Date; value: number }[];
  /** First day of the grid. Auto-derived from `data`'s date extent if omitted. */
  startDate?: string | Date;
  endDate?: string | Date;
  /** Pixel width, or 'auto' (default) to fill the parent. */
  width?: Dimension;
  /** Pixel height. Default 200 (the grid is a fixed 7 rows tall regardless of width). */
  height?: Dimension;
  /** Max cell side length in px. Shrinks (never grows) to fit the container. Default 11. */
  cellSize?: number;
  /** Gap between cells in px. Default 3. */
  gap?: number;
  /** 0 = Sunday-first (default), 1 = Monday-first. */
  weekStart?: 0 | 1;
  theme?: DeepPartial<ChartTheme>;
  /** Start color of the sequential value scale (hex, default #ebedf0 — GitHub-style neutral-to-green). */
  colorStart?: string;
  /** End color of the sequential value scale (hex, default #196127). */
  colorEnd?: string;
  /** Explicit color domain [min, max]. If omitted, derived from `data`'s value extent. */
  colorDomain?: NumericDomain;
  /** Show month labels above the grid. Default true. */
  showMonthLabels?: boolean;
  /** Show abbreviated weekday labels to the left of the grid. Default true. */
  showWeekdayLabels?: boolean;
  /** Show the "Less … More" color-scale legend strip. Default true. */
  showLegend?: boolean;
  /** Show the hover/touch tooltip. Default true. */
  showTooltip?: boolean;
  /** Format a cell's value in the tooltip. Default `toLocaleString`. */
  formatValue?: (value: number) => string;
  animate?: boolean;
}

const MS_DAY = 24 * 60 * 60 * 1000;
const WEEKDAY_LABELS_SUN_FIRST = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAY_LABELS_MON_FIRST = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const LEGEND_STEPS = 5;

/** Format an `YYYY-MM-DD` string as e.g. "Jan 5, 2024", parsed as a UTC date to avoid TZ drift. */
function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${MONTH_NAMES[dt.getUTCMonth()].slice(0, 3)} ${dt.getUTCDate()}, ${dt.getUTCFullYear()}`;
}

/**
 * Calendar heatmap (GitHub-contribution-graph style). Self-contained (does
 * not use the Cartesian frame). One cell per calendar day in
 * `[startDate, endDate]`; days without data render as neutral/empty cells.
 * Two-pass responsive sizing: `weeks` is computed from the date range alone
 * (cellSize-independent), then once the container width is measured,
 * `cellSize` shrinks (never grows) to fit — see `core/calendarHeatmap.ts`.
 */
export function CalendarHeatmapChart({
  data,
  startDate,
  endDate,
  width,
  height,
  cellSize = 11,
  gap = 3,
  weekStart = 0,
  theme: themeOverride,
  colorStart = '#ebedf0',
  colorEnd = '#196127',
  colorDomain,
  showMonthLabels = true,
  showWeekdayLabels = true,
  showLegend = true,
  showTooltip = true,
  formatValue,
  animate,
}: CalendarHeatmapChartProps) {
  const theme = useTheme(themeOverride);
  const size = useAutoSize(width, height ?? 200, 4);
  const fmt = formatValue ?? ((v: number) => v.toLocaleString());
  const [hoveredCell, setHoveredCell] = useState<CalendarCell | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const t = useAnimatedValue({
    enabled: (animate ?? theme.animation.enabled) && theme.animation.enabled,
    durationMs: theme.animation.durationMs,
  });

  // Resolve the date range: explicit props win, otherwise derive from data's extent.
  const [resolvedStart, resolvedEnd] = useMemo<[Date, Date]>(() => {
    if (startDate && endDate) return [new Date(startDate), new Date(endDate)];
    const [minTs, maxTs] = extent(data, (d) => new Date(d.date).getTime());
    const fallbackEnd = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));
    const fallbackStart = new Date(fallbackEnd.getTime() - 364 * MS_DAY);
    return [startDate ? new Date(startDate) : minTs != null ? new Date(minTs) : fallbackStart, endDate ? new Date(endDate) : maxTs != null ? new Date(maxTs) : fallbackEnd];
  }, [data, startDate, endDate]);

  // Pass 1: weeks only depends on the date range + weekStart, not on cellSize.
  const weeks = useMemo(
    () => calendarHeatmapLayout([], { startDate: resolvedStart, endDate: resolvedEnd, cellSize: 1, gap: 0, weekStart }).weeks,
    [resolvedStart, resolvedEnd, weekStart],
  );

  const leftMargin = showWeekdayLabels ? 24 : 4;
  const topMargin = showMonthLabels ? 16 : 4;

  const innerWidth = Math.max(0, size.width - leftMargin - 4);
  const resolvedCellSize = size.width > 0 ? Math.max(1, Math.min(cellSize, (innerWidth - (weeks - 1) * gap) / weeks)) : cellSize;

  // Pass 2: full geometry at the resolved (shrink-to-fit) cellSize.
  const layout = useMemo(
    () => calendarHeatmapLayout(data, { startDate: resolvedStart, endDate: resolvedEnd, cellSize: resolvedCellSize, gap, weekStart }),
    [data, resolvedStart, resolvedEnd, resolvedCellSize, gap, weekStart],
  );

  const domain: NumericDomain = useMemo(() => {
    if (colorDomain) return colorDomain;
    const values = layout.cells.map((c) => c.value).filter((v): v is number => v != null);
    return values.length > 0 ? (extent(values) as NumericDomain) : [0, 1];
  }, [colorDomain, layout]);
  const colorScale = useMemo(() => createLinearColorScale(domain, colorStart, colorEnd), [domain, colorStart, colorEnd]);

  const weekdayLabels = weekStart === 1 ? WEEKDAY_LABELS_MON_FIRST : WEEKDAY_LABELS_SUN_FIRST;

  const handleMove = (evt: { x: number; y: number }) => {
    if (!showTooltip) return;
    setMousePos({ x: evt.x, y: evt.y });
    const lx = evt.x - leftMargin;
    const ly = evt.y - topMargin;
    const found = layout.cells.find((c) => lx >= c.x && lx < c.x + resolvedCellSize && ly >= c.y && ly < c.y + resolvedCellSize);
    setHoveredCell(found ?? null);
  };

  return (
    <Svg
      width={size.svgWidth}
      height={size.svgHeight}
      onLayout={size.onLayout}
      onMove={showTooltip ? handleMove : undefined}
      onLeave={showTooltip ? () => setHoveredCell(null) : undefined}
    >
      {size.width > 0 && (
        <>
          {theme.background !== 'transparent' && <Rect x={0} y={0} width={size.width} height={size.height} fill={theme.background} />}

          <G transform={`translate(${leftMargin},${topMargin})`} opacity={t}>
            {layout.cells.map((cell) => {
              const isHovered = hoveredCell === cell;
              const fill = cell.value == null ? theme.grid.color : colorScale.interpolate(cell.value);
              return (
                <Rect
                  key={cell.date}
                  x={cell.x}
                  y={cell.y}
                  width={resolvedCellSize}
                  height={resolvedCellSize}
                  rx={Math.min(2, resolvedCellSize / 4)}
                  fill={fill}
                  stroke={isHovered ? theme.font.color : undefined}
                  strokeWidth={isHovered ? 1.5 : 0}
                />
              );
            })}

            {showMonthLabels &&
              layout.monthLabels.map((m, i) => (
                <SvgText key={i} x={m.x} y={-6} fontSize={theme.axis.labelSize} fill={theme.axis.labelColor} fontFamily={theme.font.family} textAnchor="start" verticalAnchor="end">
                  {m.label}
                </SvgText>
              ))}

            {showWeekdayLabels &&
              weekdayLabels.map((label, row) =>
                row % 2 === 1 ? (
                  <SvgText
                    key={row}
                    x={-6}
                    y={row * (resolvedCellSize + gap) + resolvedCellSize / 2}
                    fontSize={Math.max(8, theme.axis.labelSize - 2)}
                    fill={theme.axis.labelColor}
                    fontFamily={theme.font.family}
                    textAnchor="end"
                    verticalAnchor="middle"
                  >
                    {label}
                  </SvgText>
                ) : null,
              )}
          </G>

          {showLegend && (
            <CalendarLegend
              theme={theme}
              colorScale={colorScale}
              domain={domain}
              x={leftMargin}
              y={topMargin + layout.totalHeight + 10}
              emptyColor={theme.grid.color}
            />
          )}

          {showTooltip && hoveredCell && (
            <CalendarTooltip cell={hoveredCell} mousePos={mousePos} theme={theme} bounds={{ width: size.width, height: size.height }} formatValue={fmt} />
          )}
        </>
      )}
    </Svg>
  );
}

interface CalendarLegendProps {
  theme: ChartTheme;
  colorScale: HeatmapColorScale;
  domain: NumericDomain;
  x: number;
  y: number;
  emptyColor: string;
}

function CalendarLegend({ theme, colorScale, domain, x, y, emptyColor }: CalendarLegendProps) {
  const swatchSize = 10;
  const swatchGap = 3;
  const [min, max] = domain;
  const steps = Array.from({ length: LEGEND_STEPS }, (_, i) => {
    const v = LEGEND_STEPS <= 1 ? min : min + ((max - min) * i) / (LEGEND_STEPS - 1);
    return colorScale.interpolate(v);
  });
  const fontSize = Math.max(8, theme.legend.fontSize - 2);
  const lessW = 22;

  return (
    <G transform={`translate(${x},${y})`}>
      <SvgText x={0} y={swatchSize / 2} fontSize={fontSize} fill={theme.legend.color} fontFamily={theme.font.family} textAnchor="start" verticalAnchor="middle">
        Less
      </SvgText>
      <Rect x={lessW} y={0} width={swatchSize} height={swatchSize} rx={2} fill={emptyColor} />
      {steps.map((color, i) => (
        <Rect key={i} x={lessW + (i + 1) * (swatchSize + swatchGap)} y={0} width={swatchSize} height={swatchSize} rx={2} fill={color} />
      ))}
      <SvgText
        x={lessW + (steps.length + 1) * (swatchSize + swatchGap) + 4}
        y={swatchSize / 2}
        fontSize={fontSize}
        fill={theme.legend.color}
        fontFamily={theme.font.family}
        textAnchor="start"
        verticalAnchor="middle"
      >
        More
      </SvgText>
    </G>
  );
}

interface CalendarTooltipProps {
  cell: CalendarCell;
  mousePos: { x: number; y: number };
  theme: ChartTheme;
  bounds: { width: number; height: number };
  formatValue: (value: number) => string;
}

function CalendarTooltip({ cell, mousePos, theme, bounds, formatValue }: CalendarTooltipProps) {
  const pad = 8;
  const lineH = theme.tooltip.fontSize + 6;
  const rows = [formatDisplayDate(cell.date), cell.value == null ? 'No data' : formatValue(cell.value)];
  const CHAR_W = 0.6;
  const longest = Math.max(...rows.map((r) => r.length), 1);
  const boxW = pad * 2 + longest * theme.tooltip.fontSize * CHAR_W;
  const boxH = pad * 2 + lineH * rows.length;

  const flip = mousePos.x + boxW + 16 > bounds.width;
  const boxX = Math.max(0, flip ? mousePos.x - boxW - 12 : mousePos.x + 12);
  const boxY = Math.max(0, Math.min(mousePos.y - boxH - 12, bounds.height - boxH));

  return (
    <G transform={`translate(${boxX},${boxY})`}>
      <Rect x={0} y={0} width={boxW} height={boxH} rx={theme.tooltip.radius} ry={theme.tooltip.radius} fill={theme.tooltip.background} stroke={theme.tooltip.borderColor} strokeWidth={1} opacity={0.96} />
      {rows.map((row, i) => (
        <SvgText
          key={i}
          x={pad}
          y={pad + i * lineH + theme.tooltip.fontSize - 1}
          fill={theme.tooltip.color}
          fontSize={theme.tooltip.fontSize}
          fontFamily={theme.font.family}
          fontWeight={i === 1 ? 'bold' : undefined}
          verticalAnchor="start"
        >
          {row}
        </SvgText>
      ))}
    </G>
  );
}
