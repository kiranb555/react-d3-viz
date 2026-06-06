import { useState, useMemo } from 'react';
import { Svg, G, Rect, SvgText, Line } from '../../../primitives';
import { useTheme } from '../../../theme/useTheme';
import { useAnimatedValue } from '../../../hooks/useAnimatedValue';
import { useAutoSize, type Dimension } from '../../../hooks/useAutoSize';
import { computeButterflyLayout } from '../../../core/butterfly';
import { getContrastingTextColor } from '../../../utils/colorHelpers';
import type { Accessor } from '../../../core/accessors';
import type { Datum, Margin } from '../../../core/types';
import type { ChartTheme, DeepPartial } from '../../../theme/defaultTheme';

export interface ButterflyChartProps {
  data: Datum[];
  category: Accessor<unknown>;
  left: Accessor<number>;
  right: Accessor<number>;

  leftLabel?: string;
  rightLabel?: string;

  width?: Dimension;
  height?: Dimension;
  aspect?: number;
  margin?: Partial<Margin>;

  syncScale?: boolean;
  maxValue?: number;
  categoryWidth?: number;

  showValues?: boolean;
  valueFormat?: (v: number) => string;

  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  showAxes?: boolean;

  barPadding?: number;
  colors?: string[];
  theme?: DeepPartial<ChartTheme>;
  animate?: boolean;
}

const DEFAULT_MARGIN: Margin = { top: 40, right: 20, bottom: 40, left: 20 };
const TICK_GAP = 8;
const LEGEND_GAP = 16;
const SWATCH_SIZE = 12;
const SWATCH_GAP = 8;

export function ButterflyChart({
  data,
  category,
  left,
  right,
  leftLabel = 'Left',
  rightLabel = 'Right',
  width,
  height,
  aspect,
  margin: marginProp,
  syncScale = true,
  maxValue,
  categoryWidth = 120,
  showValues = false,
  valueFormat,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  showAxes = true,
  barPadding = 0.3,
  colors,
  theme: themeOverride,
  animate,
}: ButterflyChartProps) {
  const theme = useTheme(themeOverride);
  const size = useAutoSize(width ?? 'auto', height ?? 300, aspect);
  const palette = colors ?? theme.colors;
  const leftColor = palette[0];
  const rightColor = palette[1] ?? palette[0];

  const margin = useMemo(() => ({ ...DEFAULT_MARGIN, ...marginProp }), [marginProp]);
  const innerWidth = size.width - margin.left - margin.right;
  const innerHeight = size.height - margin.top - margin.bottom;

  const layout = useMemo(
    () =>
      computeButterflyLayout(data, {
        categoryAccessor: category,
        leftAccessor: left,
        rightAccessor: right,
        innerWidth,
        innerHeight,
        categoryWidth,
        barPadding,
        syncScale,
        maxValue,
        valueFormat,
      }),
    [data, category, left, right, innerWidth, innerHeight, categoryWidth, barPadding, syncScale, maxValue, valueFormat],
  );

  const animEnabled = animate !== false && theme.animation.enabled;
  const t = useAnimatedValue({ enabled: animEnabled, durationMs: theme.animation.durationMs });

  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);

  const handleMove = (event: { x: number; y: number }) => {
    const innerY = event.y - margin.top;
    const idx = layout.rows.findIndex(
      (r) => innerY >= r.y && innerY < r.y + r.barHeight,
    );
    setActiveRowIndex(idx >= 0 ? idx : null);
  };

  const handleLeave = () => {
    setActiveRowIndex(null);
  };

  return (
    <Svg width={size.svgWidth} height={size.svgHeight} onLayout={size.onLayout} onMove={handleMove} onLeave={handleLeave}>
      {size.width > 0 && (
        <>
          {theme.background !== 'transparent' && (
            <Rect x={0} y={0} width={size.width} height={size.height} fill={theme.background} />
          )}

          <G x={margin.left} y={margin.top}>
            {/* Grid lines at left and right ticks */}
            {showGrid && (
              <>
                {layout.leftTicks.map((tick) => (
                  <Line
                    key={`left-grid-${tick.value}`}
                    x1={tick.position}
                    y1={0}
                    x2={tick.position}
                    y2={innerHeight}
                    stroke={theme.grid.color}
                    strokeWidth={theme.grid.strokeWidth}
                    strokeDasharray={theme.grid.dashArray}
                    opacity={0.5}
                  />
                ))}
                {layout.rightTicks.map((tick) => (
                  <Line
                    key={`right-grid-${tick.value}`}
                    x1={tick.position}
                    y1={0}
                    x2={tick.position}
                    y2={innerHeight}
                    stroke={theme.grid.color}
                    strokeWidth={theme.grid.strokeWidth}
                    strokeDasharray={theme.grid.dashArray}
                    opacity={0.5}
                  />
                ))}
              </>
            )}

            {/* Left bars */}
            {layout.rows.map((row, idx) => {
              const isActive = activeRowIndex === idx;
              const opacity = activeRowIndex !== null && !isActive ? 0.35 : 1;
              const leftPos = layout.leftScale(row.leftValue * t);
              const leftWidth = Math.max(0, layout.leftScale(0) - leftPos);

              return (
                <Rect
                  key={`left-bar-${idx}`}
                  x={leftPos}
                  y={row.y}
                  width={leftWidth}
                  height={row.barHeight}
                  fill={leftColor}
                  opacity={opacity}
                  rx={2}
                />
              );
            })}

            {/* Right bars */}
            {layout.rows.map((row, idx) => {
              const isActive = activeRowIndex === idx;
              const opacity = activeRowIndex !== null && !isActive ? 0.35 : 1;
              const rightPos = layout.rightScale(row.rightValue * t);
              const rightWidth = Math.max(0, rightPos - layout.rightScale(0));

              return (
                <Rect
                  key={`right-bar-${idx}`}
                  x={layout.rightScale(0)}
                  y={row.y}
                  width={rightWidth}
                  height={row.barHeight}
                  fill={rightColor}
                  opacity={opacity}
                  rx={2}
                />
              );
            })}

            {/* Center divider line */}
            <Line
              x1={layout.centerX}
              y1={0}
              x2={layout.centerX}
              y2={innerHeight}
              stroke={theme.axis.color}
              strokeWidth={1}
              opacity={0.3}
            />

            {/* Center category labels */}
            {layout.rows.map((row, idx) => {
              const isActive = activeRowIndex === idx;
              const opacity = activeRowIndex !== null && !isActive ? 0.35 : 1;

              return (
                <SvgText
                  key={`label-${idx}`}
                  x={layout.centerX}
                  y={row.y + row.barHeight / 2}
                  fill={theme.axis.labelColor}
                  fontSize={theme.axis.labelSize}
                  fontFamily={theme.font.family}
                  textAnchor="middle"
                  verticalAnchor="middle"
                  opacity={opacity}
                                  >
                  {row.category}
                </SvgText>
              );
            })}

            {/* Value labels at bar tips */}
            {showValues &&
              layout.rows.map((row, idx) => {
                const isActive = activeRowIndex === idx;
                const opacity = activeRowIndex !== null && !isActive ? 0.35 : 1;

                const leftLabelX = layout.leftScale(row.leftValue * t) - 4;
                const rightLabelX = layout.rightScale(row.rightValue * t) + 4;
                const labelY = row.y + row.barHeight / 2;
                const leftLabel = valueFormat ? valueFormat(row.leftValue) : String(row.leftValue);
                const rightLabel = valueFormat ? valueFormat(row.rightValue) : String(row.rightValue);

                return (
                  <G key={`values-${idx}`}>
                    <SvgText
                      x={leftLabelX}
                      y={labelY}
                      fill={theme.font.color}
                      fontSize={theme.axis.labelSize - 2}
                      fontFamily={theme.font.family}
                      textAnchor="end"
                      verticalAnchor="middle"
                      opacity={opacity}
                                          >
                      {leftLabel}
                    </SvgText>
                    <SvgText
                      x={rightLabelX}
                      y={labelY}
                      fill={theme.font.color}
                      fontSize={theme.axis.labelSize - 2}
                      fontFamily={theme.font.family}
                      textAnchor="start"
                      verticalAnchor="middle"
                      opacity={opacity}
                                          >
                      {rightLabel}
                    </SvgText>
                  </G>
                );
              })}

            {/* Left axis ticks */}
            {showAxes &&
              layout.leftTicks.map((tick) => (
                <SvgText
                  key={`left-tick-${tick.value}`}
                  x={tick.position}
                  y={-TICK_GAP}
                  fill={theme.axis.labelColor}
                  fontSize={theme.axis.labelSize}
                  fontFamily={theme.font.family}
                  textAnchor="middle"
                  verticalAnchor="end"
                                  >
                  {tick.label}
                </SvgText>
              ))}

            {/* Right axis ticks */}
            {showAxes &&
              layout.rightTicks.map((tick) => (
                <SvgText
                  key={`right-tick-${tick.value}`}
                  x={tick.position}
                  y={-TICK_GAP}
                  fill={theme.axis.labelColor}
                  fontSize={theme.axis.labelSize}
                  fontFamily={theme.font.family}
                  textAnchor="middle"
                  verticalAnchor="end"
                                  >
                  {tick.label}
                </SvgText>
              ))}

            {/* Left axis label */}
            {showAxes && (
              <SvgText
                x={layout.leftScale(layout.maxValue / 2)}
                y={-TICK_GAP - theme.axis.labelSize - 4}
                fill={theme.axis.labelColor}
                fontSize={theme.axis.labelSize}
                fontFamily={theme.font.family}
                fontWeight="500"
                textAnchor="middle"
                verticalAnchor="end"
                              >
                {leftLabel}
              </SvgText>
            )}

            {/* Right axis label */}
            {showAxes && (
              <SvgText
                x={layout.rightScale(layout.maxValue / 2)}
                y={-TICK_GAP - theme.axis.labelSize - 4}
                fill={theme.axis.labelColor}
                fontSize={theme.axis.labelSize}
                fontFamily={theme.font.family}
                fontWeight="500"
                textAnchor="middle"
                verticalAnchor="end"
                              >
                {rightLabel}
              </SvgText>
            )}
          </G>

          {/* Legend */}
          {showLegend && (
            <G y={margin.top + innerHeight + LEGEND_GAP}>
              {/* Left swatch */}
              <Rect x={margin.left} y={0} width={SWATCH_SIZE} height={SWATCH_SIZE} fill={leftColor} />
              <SvgText
                x={margin.left + SWATCH_SIZE + SWATCH_GAP}
                y={SWATCH_SIZE / 2}
                fill={theme.legend.color}
                fontSize={theme.legend.fontSize}
                fontFamily={theme.font.family}
                verticalAnchor="middle"
                              >
                {leftLabel}
              </SvgText>

              {/* Right swatch */}
              <Rect
                x={margin.left + SWATCH_SIZE + SWATCH_GAP + 80}
                y={0}
                width={SWATCH_SIZE}
                height={SWATCH_SIZE}
                fill={rightColor}
              />
              <SvgText
                x={margin.left + SWATCH_SIZE + SWATCH_GAP + 80 + SWATCH_SIZE + SWATCH_GAP}
                y={SWATCH_SIZE / 2}
                fill={theme.legend.color}
                fontSize={theme.legend.fontSize}
                fontFamily={theme.font.family}
                verticalAnchor="middle"
                              >
                {rightLabel}
              </SvgText>
            </G>
          )}

          {/* Tooltip */}
          {showTooltip && activeRowIndex !== null && layout.rows[activeRowIndex] && (
            <ButterflyTooltip
              row={layout.rows[activeRowIndex]}
              theme={theme}
              valueFormat={valueFormat}
              leftLabel={leftLabel}
              rightLabel={rightLabel}
            />
          )}
        </>
      )}
    </Svg>
  );
}

interface ButterflyTooltipProps {
  row: ReturnType<typeof computeButterflyLayout>['rows'][0];
  theme: ChartTheme;
  valueFormat?: (v: number) => string;
  leftLabel: string;
  rightLabel: string;
}

function ButterflyTooltip({ row, theme, valueFormat, leftLabel, rightLabel }: ButterflyTooltipProps) {
  const leftVal = valueFormat ? valueFormat(row.leftValue) : String(row.leftValue);
  const rightVal = valueFormat ? valueFormat(row.rightValue) : String(row.rightValue);

  const tooltipW = 180;
  const tooltipH = 80;
  const tooltipX = 16;
  const tooltipY = 16;

  const bgColor = theme.tooltip.background;
  const textColor = getContrastingTextColor(bgColor);

  return (
    <G x={tooltipX} y={tooltipY}>
      <Rect
        x={0}
        y={0}
        width={tooltipW}
        height={tooltipH}
        fill={bgColor}
        stroke={textColor}
        strokeWidth={1}
        rx={theme.tooltip.radius}
        opacity={0.95}
      />
      <SvgText
        x={tooltipW / 2}
        y={12}
        fill={textColor}
        fontSize={theme.tooltip.fontSize}
        fontFamily={theme.font.family}
        fontWeight="bold"
        textAnchor="middle"
              >
        {row.category}
      </SvgText>
      <SvgText
        x={tooltipW / 2}
        y={36}
        fill={textColor}
        fontSize={theme.tooltip.fontSize - 2}
        fontFamily={theme.font.family}
        textAnchor="middle"
              >
        {leftLabel}: {leftVal}
      </SvgText>
      <SvgText
        x={tooltipW / 2}
        y={56}
        fill={textColor}
        fontSize={theme.tooltip.fontSize - 2}
        fontFamily={theme.font.family}
        textAnchor="middle"
              >
        {rightLabel}: {rightVal}
      </SvgText>
    </G>
  );
}
