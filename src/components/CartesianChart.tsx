import { useMemo, useState, type ReactNode } from 'react';
import { Svg, G, Rect } from '../primitives';
import { ChartContext } from './ChartContext';
import { Grid } from './Grid';
import { XAxis, YAxis } from './Axis';
import { Tooltip } from './Tooltip';
import { Legend } from './Legend';
import type {
  ActivePoint,
  CartesianContextValue,
  ResolvedSeries,
  SeriesConfig,
} from './chartTypes';
import { computeBounds } from '../core/bounds';
import { numericDomain, linear, band, point } from '../core/scales';
import { continuousTicks, categoricalTicks } from '../core/ticks';
import { getNumber, getCategory } from '../core/accessors';
import { useTheme } from '../theme/useTheme';
import { useAutoSize, type Dimension } from '../hooks/useAutoSize';
import type { Accessor } from '../core/accessors';
import type { Datum, Margin, NumericDomain, Tick } from '../core/types';
import type { ChartTheme, DeepPartial } from '../theme/defaultTheme';

export type XScaleType = 'band' | 'point' | 'linear';

export interface CartesianChartProps {
  data: Datum[];
  /** Accessor for the x category/value. */
  x: Accessor<unknown>;
  series: SeriesConfig[];
  /** Pixel width, or 'auto' (default) to fill the parent and re-flow on resize. */
  width?: Dimension;
  /** Pixel height, or 'auto' to derive from width via `aspect`. Default 300. */
  height?: Dimension;
  /** width / height ratio used when height is 'auto'. Default 2. */
  aspect?: number;
  margin?: Partial<Margin>;
  theme?: DeepPartial<ChartTheme>;
  xScaleType: XScaleType;
  /** Band inner padding (bar gap) — only for 'band'. */
  bandPadding?: number;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  xTickCount?: number;
  yTickCount?: number;
  formatX?: (value: unknown, index: number) => string;
  formatY?: (value: number) => string;
  /** Explicit y domain override. */
  yDomain?: NumericDomain;
  /** Stack series instead of grouping/overlaying them (bars). */
  stacked?: boolean;
  /** Per-chart renderer for the series geometry. */
  renderSeries: (ctx: CartesianContextValue) => ReactNode;
  /** Advanced composition: extra decorators rendered inside the plot area. */
  children?: ReactNode;
}

/**
 * Shared frame for line, area, bar and scatter charts. Owns scales, ticks,
 * legend toggling, and hover state; delegates series geometry to `renderSeries`.
 */
export function CartesianChart(props: CartesianChartProps) {
  const {
    data,
    x,
    series,
    width,
    height,
    aspect,
    margin,
    theme: themeOverride,
    xScaleType,
    bandPadding,
    showGrid = true,
    showXAxis = true,
    showYAxis = true,
    showTooltip = true,
    showLegend = true,
    xTickCount = 5,
    yTickCount = 5,
    formatX,
    formatY,
    yDomain,
    stacked = false,
    renderSeries,
    children,
  } = props;

  const theme = useTheme(themeOverride);
  const size = useAutoSize(width, height, aspect);
  const [hidden, setHidden] = useState<Set<number>>(new Set());
  const [active, setActive] = useState<ActivePoint | null>(null);

  const toggleSeries = (i: number) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const value = useMemo<CartesianContextValue>(() => {
    // Reserve top space for the legend row.
    const legendH = showLegend && series.length > 0 ? theme.legend.swatchSize + 14 : 0;
    const bounds = computeBounds(size.width, size.height, { ...margin, top: (margin?.top ?? 16) + legendH });

    const resolved: ResolvedSeries[] = series.map((s, i) => ({
      ...s,
      color: s.color ?? theme.colors[i % theme.colors.length],
      label: s.label ?? (typeof s.dataKey === 'string' ? s.dataKey : `series ${i + 1}`),
      seriesIndex: i,
      hidden: hidden.has(i),
    }));
    const visible = resolved.filter((s) => !s.hidden);

    // --- y scale from visible series ---
    // When stacked, the domain is driven by the per-category sums; otherwise by
    // the individual series values.
    const yValues: number[] = [];
    if (stacked) {
      data.forEach((d, i) => {
        let sum = 0;
        visible.forEach((s) => {
          const v = getNumber(d, s.dataKey, i);
          if (Number.isFinite(v)) sum += v;
        });
        yValues.push(sum);
      });
    } else {
      data.forEach((d, i) => visible.forEach((s) => yValues.push(getNumber(d, s.dataKey, i))));
    }
    const yDom = yDomain ?? numericDomain(yValues);
    const yScale = linear(yDom, [bounds.innerHeight, 0]);
    const yPixel = (v: number) => yScale(v);
    const baseline = Math.max(0, Math.min(bounds.innerHeight, yScale(0)));

    // --- x scale + per-datum positions ---
    let xPositions: number[];
    let xBandwidth = 0;
    let xTicks: Tick[];

    if (xScaleType === 'linear') {
      const xVals = data.map((d, i) => getNumber(d, x as Accessor<number>, i));
      const xScale = linear(numericDomain(xVals, { includeZero: false, padTop: 0 }), [0, bounds.innerWidth]);
      xPositions = xVals.map((v) => xScale(v));
      xTicks = continuousTicks(xScale, xTickCount, formatX ? (v) => formatX(v, 0) : undefined);
    } else {
      const categories = data.map((d, i) => getCategory(d, x, i));
      if (xScaleType === 'band') {
        const xScale = band(categories, [0, bounds.innerWidth], { paddingInner: bandPadding ?? 0.2 });
        xBandwidth = xScale.bandwidth();
        xPositions = categories.map((c) => (xScale(c) ?? 0) + xBandwidth / 2);
        xTicks = categoricalTicks(xScale, formatX ? (v) => formatX(v, 0) : undefined);
      } else {
        const xScale = point(categories, [0, bounds.innerWidth]);
        xPositions = categories.map((c) => xScale(c) ?? 0);
        xTicks = categoricalTicks(xScale, formatX ? (v) => formatX(v, 0) : undefined);
      }
    }

    const yTicks = continuousTicks(yScale, yTickCount, formatY ? (v) => formatY(Number(v)) : undefined);

    return {
      data,
      x,
      series: resolved,
      bounds,
      theme,
      xPixel: (index: number) => xPositions[index] ?? 0,
      xBandwidth,
      yPixel,
      baseline,
      xTicks,
      yTicks,
      stacked,
      active,
      setActive,
      toggleSeries,
    };
  }, [data, x, series, size.width, size.height, margin, theme, xScaleType, bandPadding, showLegend, hidden, active, yDomain, stacked, xTickCount, yTickCount, formatX, formatY]);

  const { bounds } = value;

  const handleMove = (e: { x: number; y: number }) => {
    const innerX = e.x - bounds.margin.left;
    if (data.length === 0) return;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < data.length; i++) {
      const dist = Math.abs(value.xPixel(i) - innerX);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    setActive({ index: best, x: value.xPixel(best) });
  };

  return (
    <ChartContext.Provider value={value}>
      <Svg
        width={size.svgWidth}
        height={size.svgHeight}
        onLayout={size.onLayout}
        onMove={showTooltip && size.width > 0 ? handleMove : undefined}
        onLeave={showTooltip ? () => setActive(null) : undefined}
      >
        {size.width > 0 && (
          <>
            {theme.background !== 'transparent' && (
              <Rect x={0} y={0} width={size.width} height={size.height} fill={theme.background} />
            )}
            {showLegend && series.length > 0 && <Legend />}
            <G x={bounds.margin.left} y={bounds.margin.top}>
              {showGrid && <Grid />}
              {renderSeries(value)}
              {showXAxis && <XAxis />}
              {showYAxis && <YAxis />}
              {children}
              {showTooltip && <Tooltip />}
            </G>
          </>
        )}
      </Svg>
    </ChartContext.Provider>
  );
}
