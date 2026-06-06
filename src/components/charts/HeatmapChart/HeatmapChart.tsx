import { useMemo, useState } from 'react';
import { scaleBand } from 'd3-scale';
import { Svg, G, Rect, SvgText } from '../../../primitives';
import { useAutoSize } from '../../../hooks/useAutoSize';
import { useAnimatedValue } from '../../../hooks/useAnimatedValue';
import { useTheme } from '../../../theme/useTheme';
import { computeBounds, DEFAULT_MARGIN } from '../../../core/bounds';
import { lerp } from '../../../core/interpolate';
import { computeHeatmapCells, createLinearColorScale, createDivergingColorScale, heatmapExtent } from '../../../core/heatmap';
import { makeAccessor } from '../../../core/accessors';
import type { Accessor } from '../../../core/accessors';
import type { Datum, NumericDomain } from '../../../core/types';
import type { DeepPartial, ChartTheme } from '../../../theme/defaultTheme';
import type { Dimension } from '../../../hooks/useAutoSize';
import type { Margin } from '../../../core/types';

export interface HeatmapChartProps {
  /** Data array where each element contains row/column/value info. */
  data: Datum[];
  /** Accessor to extract the row label (y-axis). Can be a string key or accessor function. */
  rowKey: Accessor<string> | string;
  /** Accessor to extract the column label (x-axis). Can be a string key or accessor function. */
  columnKey: Accessor<string> | string;
  /** Accessor to extract the numeric value for coloring the cell. Can be a string key or accessor function. */
  valueKey: Accessor<number> | string;
  /** Pixel width, or 'auto' (default) to fill the parent. */
  width?: Dimension;
  /** Pixel height, or 'auto' to derive from width via aspect. Default 400. */
  height?: Dimension;
  /** width / height ratio when height is 'auto'. Default 0.75. */
  aspect?: number;
  margin?: Partial<Margin>;
  theme?: DeepPartial<ChartTheme>;
  /** Show column labels. */
  showXLabels?: boolean;
  /** Show row labels. */
  showYLabels?: boolean;
  /** Show tooltip on hover. */
  showTooltip?: boolean;
  /** Format function for cell values in tooltip. */
  formatValue?: (value: number) => string;
  /** Color scale mode: 'linear' or 'diverging'. */
  colorScaleMode?: 'linear' | 'diverging';
  /** Start color for linear scale (hex, default #e8eaf6). */
  colorStart?: string;
  /** End color for linear scale or high color for diverging (hex, default #1a237e). */
  colorEnd?: string;
  /** Middle color for diverging scale (hex, default #ffffff). */
  colorMid?: string;
  /** Explicit color domain [min, max]. If not provided, derived from data. */
  colorDomain?: NumericDomain;
  /** Cell stroke color. */
  cellStroke?: string;
  /** Cell stroke width. */
  cellStrokeWidth?: number;
  /** Enable enter animation. */
  animate?: boolean;
}

/**
 * Heatmap chart. A 2D grid where each cell is colored based on its numeric value.
 * Rows and columns are categorical; values are color-encoded.
 */
export function HeatmapChart({
  data,
  rowKey,
  columnKey,
  valueKey,
  width = 'auto',
  height = 'auto',
  aspect = 0.75,
  margin: marginProp,
  theme: themeOverride,
  showXLabels = true,
  showYLabels = true,
  showTooltip = true,
  formatValue = (v) => v.toFixed(2),
  colorScaleMode = 'linear',
  colorStart = '#e8eaf6',
  colorEnd = '#1a237e',
  colorMid = '#ffffff',
  colorDomain,
  cellStroke = '#ffffff',
  cellStrokeWidth = 1,
  animate = true,
}: HeatmapChartProps) {
  const theme = useTheme(themeOverride);
  const { width: containerWidth, height: containerHeight, svgWidth, svgHeight, onLayout } = useAutoSize(width, height, aspect);
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number; value: number } | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const margin = { ...DEFAULT_MARGIN, ...marginProp };
  const bounds = computeBounds(containerWidth, containerHeight, margin);

  // Convert string keys to accessor functions
  const rowAccessor = useMemo(() => makeAccessor<string>(rowKey as Accessor<string>), [rowKey]);
  const colAccessor = useMemo(() => makeAccessor<string>(columnKey as Accessor<string>), [columnKey]);
  const valAccessor = useMemo(() => makeAccessor<number>(valueKey as Accessor<number>), [valueKey]);

  // Extract unique x and y categories while preserving order
  const yCategories = useMemo(() => {
    const ySet = new Set<string>();
    const yList: string[] = [];
    for (let i = 0; i < data.length; i++) {
      const y = rowAccessor(data[i], i);
      if (y != null && !ySet.has(y)) {
        ySet.add(y);
        yList.push(y);
      }
    }
    return yList;
  }, [data, rowAccessor]);

  const xCategories = useMemo(() => {
    const xSet = new Set<string>();
    const xList: string[] = [];
    for (let i = 0; i < data.length; i++) {
      const x = colAccessor(data[i], i);
      if (x != null && !xSet.has(x)) {
        xSet.add(x);
        xList.push(x);
      }
    }
    return xList;
  }, [data, colAccessor]);

  // Build value matrix [row][col]
  const valueMatrix = useMemo(() => {
    const matrix: number[][] = Array(yCategories.length)
      .fill(null)
      .map(() => Array(xCategories.length).fill(NaN));

    for (let i = 0; i < data.length; i++) {
      const y = rowAccessor(data[i], i);
      const x = colAccessor(data[i], i);
      const v = valAccessor(data[i], i);
      if (y != null && x != null && Number.isFinite(v)) {
        const yIdx = yCategories.indexOf(y);
        const xIdx = xCategories.indexOf(x);
        if (yIdx >= 0 && xIdx >= 0) {
          matrix[yIdx][xIdx] = v;
        }
      }
    }
    return matrix;
  }, [data, rowAccessor, colAccessor, valAccessor, xCategories, yCategories]);

  // Compute color domain
  const domain = colorDomain ?? heatmapExtent(valueMatrix);

  // Create color scale
  const colorScale = useMemo(
    () =>
      colorScaleMode === 'diverging'
        ? createDivergingColorScale(domain, colorStart, colorMid, colorEnd)
        : createLinearColorScale(domain, colorStart, colorEnd),
    [colorScaleMode, domain, colorStart, colorEnd, colorMid],
  );

  // Compute cells with colors
  const cells = useMemo(() => computeHeatmapCells(xCategories, yCategories, valueMatrix, colorScale), [xCategories, yCategories, valueMatrix, colorScale]);

  // Create scales for positioning
  const xScale = useMemo(
    () =>
      scaleBand<number>()
        .domain(Array.from({ length: xCategories.length }, (_, i) => i))
        .range([bounds.margin.left, bounds.margin.left + bounds.innerWidth])
        .padding(0.05),
    [xCategories.length, bounds],
  );

  const yScale = useMemo(
    () =>
      scaleBand<number>()
        .domain(Array.from({ length: yCategories.length }, (_, i) => i))
        .range([bounds.margin.top + bounds.innerHeight, bounds.margin.top])
        .padding(0.05),
    [yCategories.length, bounds],
  );

  const t = useAnimatedValue({
    enabled: animate && theme.animation.enabled,
    durationMs: theme.animation.durationMs,
  });

  const cellWidth = xScale.bandwidth();
  const cellHeight = yScale.bandwidth();

  const handleMove = (evt: { x: number; y: number }) => {
    if (!showTooltip) return;
    const { x, y } = evt;
    setMousePos({ x, y });
    for (const cell of cells) {
      const cellX = xScale(cell.x) ?? 0;
      const cellY = yScale(cell.y) ?? 0;
      if (x >= cellX && x < cellX + cellWidth && y >= cellY && y < cellY + cellHeight) {
        setHoveredCell({ x: cell.x, y: cell.y, value: cell.value });
        return;
      }
    }
    setHoveredCell(null);
  };

  return (
    <Svg width={svgWidth} height={svgHeight} onLayout={onLayout} onMove={handleMove} onLeave={() => setHoveredCell(null)}>
      {/* Background */}
      <Rect x={0} y={0} width={containerWidth} height={containerHeight} fill={theme.background} />

      {/* Heatmap cells */}
      <G>
        {cells.map((cell) => {
          const x = xScale(cell.x) ?? 0;
          const y = yScale(cell.y) ?? 0;
          const isHovered = hoveredCell && hoveredCell.x === cell.x && hoveredCell.y === cell.y;
          const animatedOpacity = lerp(0.7, isHovered ? 1 : 0.85, t);

          return (
            <Rect
              key={`${cell.x}-${cell.y}`}
              x={x}
              y={y}
              width={cellWidth}
              height={cellHeight}
              fill={cell.color}
              stroke={cellStroke}
              strokeWidth={cellStrokeWidth}
              opacity={animatedOpacity}
            />
          );
        })}
      </G>

      {/* X labels (column headers) */}
      {showXLabels && (
        <G>
          {xCategories.map((label, i) => {
            const x = xScale(i) ?? 0;
            return (
              <SvgText
                key={`x-${i}`}
                x={x + cellWidth / 2}
                y={bounds.margin.top - 8}
                textAnchor="middle"
                fontSize={theme.axis.labelSize}
                fill={theme.axis.labelColor}
                verticalAnchor="end"
              >
                {label}
              </SvgText>
            );
          })}
        </G>
      )}

      {/* Y labels (row headers) */}
      {showYLabels && (
        <G>
          {yCategories.map((label, i) => {
            const y = yScale(i) ?? 0;
            return (
              <SvgText
                key={`y-${i}`}
                x={bounds.margin.left - 8}
                y={y + cellHeight / 2}
                textAnchor="end"
                fontSize={theme.axis.labelSize}
                fill={theme.axis.labelColor}
                verticalAnchor="middle"
              >
                {label}
              </SvgText>
            );
          })}
        </G>
      )}

      {/* Tooltip */}
      {showTooltip && hoveredCell && (
        <G>
          {(() => {
            const CHAR_W = 0.6;
            const pad = 8;
            const lineH = 18;
            const fontSize = 11;

            const row = yCategories[hoveredCell.y];
            const col = xCategories[hoveredCell.x];
            const val = formatValue(hoveredCell.value);

            const rowText = `Row: ${row}`;
            const colText = `Col: ${col}`;
            const valText = `Val: ${val}`;

            const longest = Math.max(rowText.length, colText.length, valText.length);
            const boxW = pad * 2 + longest * fontSize * CHAR_W;
            const boxH = pad * 2 + lineH * 3;

            const innerX = mousePos.x - bounds.margin.left;
            const innerY = mousePos.y - bounds.margin.top;
            const flip = innerX + boxW + 12 > bounds.innerWidth;
            const tooltipX = bounds.margin.left + (flip ? Math.max(0, innerX - boxW - 12) : Math.min(innerX + 12, bounds.margin.left + bounds.innerWidth - boxW));
            const tooltipY = bounds.margin.top + Math.max(0, Math.min(innerY - boxH / 2, bounds.innerHeight - boxH));

            return (
              <>
                <Rect
                  x={tooltipX}
                  y={tooltipY}
                  width={boxW}
                  height={boxH}
                  fill={theme.tooltip.background}
                  stroke={theme.tooltip.borderColor}
                  strokeWidth={1}
                  rx={4}
                />
                <SvgText
                  x={tooltipX + pad}
                  y={tooltipY + pad + 4}
                  fontSize={fontSize}
                  fill={theme.tooltip.color}
                  verticalAnchor="start"
                >
                  {rowText}
                </SvgText>
                <SvgText
                  x={tooltipX + pad}
                  y={tooltipY + pad + lineH}
                  fontSize={fontSize}
                  fill={theme.tooltip.color}
                  verticalAnchor="start"
                >
                  {colText}
                </SvgText>
                <SvgText
                  x={tooltipX + pad}
                  y={tooltipY + pad + lineH * 2}
                  fontSize={12}
                  fontWeight="bold"
                  fill={theme.tooltip.color}
                  verticalAnchor="start"
                >
                  {valText}
                </SvgText>
              </>
            );
          })()}
        </G>
      )}
    </Svg>
  );
}
