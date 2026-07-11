import { useState } from 'react';
import { Svg, G, Path, Rect, SvgText } from '../../../primitives';
import { useTheme } from '../../../theme/useTheme';
import { useAnimatedValue } from '../../../hooks/useAnimatedValue';
import { useAutoSize, type Dimension } from '../../../hooks/useAutoSize';
import { funnelLayout, type FunnelStage } from '../../../core/funnel';
import { getNumber, getCategory } from '../../../core/accessors';
import type { Accessor } from '../../../core/accessors';
import type { Datum } from '../../../core/types';
import type { ChartTheme, DeepPartial } from '../../../theme/defaultTheme';

export interface FunnelChartProps {
  data: Datum[];
  /** Accessor for each stage's numeric value. */
  value: Accessor<number>;
  /** Accessor for each stage's label (legend + tooltip + in-chart label). */
  label?: Accessor<unknown>;
  /** Pixel width, or 'auto' (default) to fill the parent. */
  width?: Dimension;
  /** Pixel height, or 'auto' to derive from width via `aspect`. */
  height?: Dimension;
  /** width / height ratio when height is 'auto'. Default 0.9. */
  aspect?: number;
  theme?: DeepPartial<ChartTheme>;
  /** Override the categorical palette. */
  colors?: string[];
  /** Default `'vertical'` (top-to-bottom taper). `'horizontal'` transposes x/y. */
  orientation?: 'vertical' | 'horizontal';
  /** Show each stage's label. Default true. */
  showLabels?: boolean;
  /** Show each stage's formatted value. Default true. */
  showValues?: boolean;
  /** Show the drop-off percentage between consecutive stages. Default true. */
  showDropOff?: boolean;
  /** Show the interactive legend. Default true. */
  showLegend?: boolean;
  /** Show the hover/touch tooltip. Default true. */
  showTooltip?: boolean;
  /** Format a stage's numeric value. Default `toLocaleString`. */
  formatValue?: (value: number) => string;
  /** Gap between consecutive stages, in px. Default 24. */
  gap?: number;
  animate?: boolean;
}

const CHAR_W = 0.6;

interface FunnelItem {
  originalIndex: number;
  label: string;
  value: number;
  color: string;
}

interface ActiveState {
  x: number;
  y: number;
  stage: FunnelStage;
  item: FunnelItem;
}

/** Width of a stage's trapezoid at a given point along its main (taper) axis. */
function widthAtMain(stage: FunnelStage, main: number): number {
  const frac = stage.height > 0 ? (main - stage.y) / stage.height : 0;
  return stage.topWidth + (stage.bottomWidth - stage.topWidth) * frac;
}

/**
 * Funnel chart. Self-contained (does not use the Cartesian frame). Renders a
 * continuously-tapering stack of trapezoids — one per stage — with an
 * interactive legend, hover tooltip, and optional drop-off percentages
 * rendered in the gap between consecutive stages.
 */
export function FunnelChart({
  data,
  value,
  label,
  width,
  height,
  aspect = 0.9,
  theme: themeOverride,
  colors,
  orientation = 'vertical',
  showLabels = true,
  showValues = true,
  showDropOff = true,
  showLegend = true,
  showTooltip = true,
  formatValue,
  gap = 24,
  animate,
}: FunnelChartProps) {
  const theme = useTheme(themeOverride);
  const size = useAutoSize(width, height ?? 'auto', aspect);
  const palette = colors ?? theme.colors;
  const fmt = formatValue ?? ((v: number) => v.toLocaleString());
  const [hidden, setHidden] = useState<Set<number>>(new Set());
  const [active, setActive] = useState<ActiveState | null>(null);

  const t = useAnimatedValue({
    enabled: (animate ?? theme.animation.enabled) && theme.animation.enabled,
    durationMs: theme.animation.durationMs,
  });

  const items: FunnelItem[] = data.map((d, i) => ({
    originalIndex: i,
    label: label ? getCategory(d, label, i) : String(i + 1),
    value: getNumber(d, value, i),
    color: palette[i % palette.length],
  }));

  const legendH = showLegend ? theme.legend.swatchSize + 16 : 0;
  const plotWidth = size.width;
  const plotHeight = Math.max(0, size.height - legendH);

  const visible = items.filter((it) => !hidden.has(it.originalIndex));
  const values = visible.map((it) => (Number.isFinite(it.value) ? it.value : 0));
  const stages =
    plotWidth > 0 && plotHeight > 0
      ? funnelLayout(values, { width: plotWidth, height: plotHeight, gap, orientation })
      : [];

  const translateX = orientation === 'vertical' ? plotWidth / 2 : 0;
  const translateY = orientation === 'vertical' ? 0 : plotHeight / 2;

  const handleMove = (e: { x: number; y: number }) => {
    if (!showTooltip) return;
    const lx = e.x - translateX;
    const ly = e.y - translateY;
    const stage = stages.find((s) => {
      if (orientation === 'vertical') {
        if (ly < s.y || ly > s.y + s.height) return false;
        return Math.abs(lx) <= widthAtMain(s, ly) / 2;
      }
      if (lx < s.y || lx > s.y + s.height) return false;
      return Math.abs(ly) <= widthAtMain(s, lx) / 2;
    });
    setActive(stage ? { x: e.x, y: e.y, stage, item: visible[stage.index] } : null);
  };

  const dropFontSize = Math.max(9, theme.legend.fontSize - 1);
  const labelFontSize = theme.legend.fontSize;
  const valueFontSize = Math.max(9, theme.legend.fontSize - 1);

  return (
    <Svg
      width={size.svgWidth}
      height={size.svgHeight}
      onLayout={size.onLayout}
      onMove={showTooltip && stages.length > 0 ? handleMove : undefined}
      onLeave={showTooltip ? () => setActive(null) : undefined}
    >
      {size.width > 0 && (
        <>
          {theme.background !== 'transparent' && (
            <Rect x={0} y={0} width={size.width} height={size.height} fill={theme.background} />
          )}
          <G transform={`translate(${translateX},${translateY})`} opacity={t}>
            {stages.map((stage) => {
              const item = visible[stage.index];
              const showBandLabels = stage.height >= labelFontSize * (showValues ? 2.4 : 1.6);
              return (
                <G key={item.originalIndex}>
                  <Path
                    d={stage.path}
                    fill={item.color}
                    stroke={theme.background === 'transparent' ? '#fff' : theme.background}
                    strokeWidth={1.5}
                  />
                  {showLabels && showBandLabels && (
                    <SvgText
                      x={stage.centroid[0]}
                      y={stage.centroid[1] - (showValues ? valueFontSize / 2 + 1 : 0)}
                      fill="#fff"
                      fontSize={labelFontSize}
                      fontFamily={theme.font.family}
                      fontWeight="bold"
                      textAnchor="middle"
                      verticalAnchor="middle"
                    >
                      {item.label}
                    </SvgText>
                  )}
                  {showValues && showBandLabels && (
                    <SvgText
                      x={stage.centroid[0]}
                      y={stage.centroid[1] + (showLabels ? labelFontSize / 2 + 1 : 0)}
                      fill="#fff"
                      fontSize={valueFontSize}
                      fontFamily={theme.font.family}
                      textAnchor="middle"
                      verticalAnchor="middle"
                    >
                      {fmt(stage.value)}
                    </SvgText>
                  )}
                  {showDropOff && stage.dropOffPct !== null && (
                    <SvgText
                      x={orientation === 'vertical' ? 0 : stage.y - gap / 2}
                      y={orientation === 'vertical' ? stage.y - gap / 2 : 0}
                      fill={theme.legend.color}
                      fontSize={dropFontSize}
                      fontFamily={theme.font.family}
                      textAnchor="middle"
                      verticalAnchor="middle"
                    >
                      {`↓ ${stage.dropOffPct.toFixed(1)}%`}
                    </SvgText>
                  )}
                </G>
              );
            })}
          </G>

          {showTooltip && active && (
            <FunnelTooltip active={active} theme={theme} bounds={{ width: size.width, height: size.height }} formatValue={fmt} />
          )}

          {showLegend && (
            <FunnelLegend
              items={items}
              hidden={hidden}
              theme={theme}
              width={size.width}
              y={size.height - legendH + 2}
              onToggle={(idx) => {
                setHidden((prev) => {
                  const next = new Set(prev);
                  if (next.has(idx)) next.delete(idx);
                  else next.add(idx);
                  return next;
                });
              }}
            />
          )}
        </>
      )}
    </Svg>
  );
}

interface FunnelTooltipProps {
  active: ActiveState;
  theme: ChartTheme;
  bounds: { width: number; height: number };
  formatValue: (value: number) => string;
}

function FunnelTooltip({ active, theme, bounds, formatValue }: FunnelTooltipProps) {
  const { x, y, stage, item } = active;
  const fontSize = theme.tooltip.fontSize;
  const lineH = fontSize + 6;
  const pad = 8;
  const rows = [
    item.label,
    formatValue(stage.value),
    `${stage.pctOfFirst.toFixed(1)}% of first stage`,
    ...(stage.dropOffPct !== null ? [`${stage.dropOffPct.toFixed(1)}% drop-off`] : []),
  ];
  const longest = Math.max(...rows.map((r) => r.length), 1);
  const boxW = pad * 2 + 12 + longest * fontSize * CHAR_W;
  const boxH = pad * 2 + lineH * rows.length;
  const flip = x + boxW + 16 > bounds.width;
  const boxX = Math.max(0, flip ? x - boxW - 12 : x + 12);
  const boxY = Math.max(0, Math.min(y + 8, bounds.height - boxH));

  return (
    <G transform={`translate(${boxX},${boxY})`}>
      <Rect
        x={0}
        y={0}
        width={boxW}
        height={boxH}
        rx={theme.tooltip.radius}
        ry={theme.tooltip.radius}
        fill={theme.tooltip.background}
        stroke={theme.tooltip.borderColor}
        strokeWidth={1}
        opacity={0.96}
      />
      <Rect x={pad} y={pad + fontSize / 2 - 4} width={8} height={8} rx={2} fill={item.color} />
      {rows.map((row, i) => (
        <SvgText
          key={i}
          x={i === 0 ? pad + 14 : pad}
          y={pad + i * lineH + fontSize - 1}
          fill={theme.tooltip.color}
          fontSize={fontSize}
          fontFamily={theme.font.family}
          fontWeight={i === 0 ? 'bold' : undefined}
          verticalAnchor="start"
        >
          {row}
        </SvgText>
      ))}
    </G>
  );
}

interface FunnelLegendProps {
  items: FunnelItem[];
  hidden: Set<number>;
  theme: ChartTheme;
  width: number;
  y: number;
  onToggle: (index: number) => void;
}

function FunnelLegend({ items, hidden, theme, width, y, onToggle }: FunnelLegendProps) {
  const { swatchSize, gap, fontSize, color } = theme.legend;
  const measured = items.map((it) => ({ it, w: swatchSize + 6 + it.label.length * fontSize * CHAR_W }));
  const rowW = measured.reduce((acc, m) => acc + m.w + gap, -gap);
  const start = Math.max(0, (width - rowW) / 2);
  const positioned = measured.map((m, i) => ({
    ...m,
    x: start + measured.slice(0, i).reduce((acc, p) => acc + p.w + gap, 0),
  }));

  return (
    <G>
      {positioned.map(({ it, w, x }) => {
        const dim = hidden.has(it.originalIndex) ? 0.35 : 1;
        return (
          <G key={it.originalIndex} transform={`translate(${x},${y})`} onPress={() => onToggle(it.originalIndex)}>
            <Rect x={0} y={0} width={w} height={swatchSize + 4} fill="transparent" />
            <Rect x={0} y={2} width={swatchSize} height={swatchSize} rx={2} fill={it.color} opacity={dim} />
            <SvgText x={swatchSize + 6} y={2 + swatchSize / 2} fill={color} opacity={dim} fontSize={fontSize} fontFamily={theme.font.family} textAnchor="start" verticalAnchor="middle">
              {it.label}
            </SvgText>
          </G>
        );
      })}
    </G>
  );
}
