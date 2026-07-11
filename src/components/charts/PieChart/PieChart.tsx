import { useState } from 'react';
import { Svg, G, Path, Rect, SvgText } from '../../../primitives';
import { useTheme } from '../../../theme/useTheme';
import { useAnimatedValue } from '../../../hooks/useAnimatedValue';
import { useAutoSize, type Dimension } from '../../../hooks/useAutoSize';
import { pieArcs } from '../../../core/shapes';
import { getNumber, getCategory } from '../../../core/accessors';
import type { Accessor } from '../../../core/accessors';
import type { Datum } from '../../../core/types';
import type { ChartTheme, DeepPartial } from '../../../theme/defaultTheme';

export interface PieChartProps {
  data: Datum[];
  /** Accessor for each slice's numeric value. */
  value: Accessor<number>;
  /** Accessor for each slice's label (legend + tooltip). */
  label?: Accessor<unknown>;
  /** Pixel width, or 'auto' (default) to fill the parent. */
  width?: Dimension;
  /** Pixel height, or 'auto' (default) to match the width (square). */
  height?: Dimension;
  /** width / height ratio when height is 'auto'. Default 1 (square). */
  aspect?: number;
  theme?: DeepPartial<ChartTheme>;
  /**
   * Donut hole size. A fraction 0..1 of the radius (e.g. 0.6), or an absolute
   * pixel value when >= 1. Default 0 (full pie).
   */
  innerRadius?: number;
  padAngle?: number;
  cornerRadius?: number;
  /** Show the interactive legend. Default true. */
  showLegend?: boolean;
  /** Show percentage labels inside slices. Default true. */
  showLabels?: boolean;
  /** Override the categorical palette. */
  colors?: string[];
  animate?: boolean;
  /**
   * Text rendered in the donut hole (only shown when `innerRadius` > 0). Pass
   * a function to derive it from the visible slices' total (e.g. a running
   * sum that updates as legend items are toggled).
   */
  centerLabel?: string | ((total: number) => string);
  /** Smaller line rendered below `centerLabel`, e.g. `'Total'`. */
  centerSubLabel?: string;
}

const CHAR_W = 0.6;
const MIN_CENTER_FONT = 9;

/** Largest font size (px) that keeps `text` within the donut hole without overflowing it. */
function fitCenterFontSize(text: string, innerR: number): number {
  const maxByWidth = (innerR * 1.6) / (Math.max(text.length, 1) * CHAR_W);
  const maxByHeight = innerR * 0.8;
  return Math.floor(Math.min(maxByWidth, maxByHeight, 40));
}

/**
 * Pie / donut chart. Self-contained (does not use the Cartesian frame). Set
 * `innerRadius` for a donut. Slices animate in; tapping a legend item toggles a
 * slice; tapping a slice "explodes" it slightly.
 */
export function PieChart({
  data,
  value,
  label,
  width,
  height,
  aspect = 1,
  theme: themeOverride,
  innerRadius = 0,
  padAngle = 0.01,
  cornerRadius = 2,
  showLegend = true,
  showLabels = true,
  colors,
  animate,
  centerLabel,
  centerSubLabel,
}: PieChartProps) {
  const theme = useTheme(themeOverride);
  const size = useAutoSize(width, height ?? 'auto', aspect);
  const palette = colors ?? theme.colors;
  const [hidden, setHidden] = useState<Set<number>>(new Set());
  const [active, setActive] = useState<number | null>(null);

  const t = useAnimatedValue({
    enabled: (animate ?? theme.animation.enabled) && theme.animation.enabled,
    durationMs: theme.animation.durationMs,
  });

  const items = data.map((d, i) => ({
    originalIndex: i,
    label: label ? getCategory(d, label, i) : String(i + 1),
    value: getNumber(d, value, i),
    color: palette[i % palette.length],
  }));

  const legendH = showLegend ? theme.legend.swatchSize + 16 : 0;
  const cx = size.width / 2;
  const cy = (size.height - legendH) / 2;
  const radius = Math.max(0, Math.min(size.width, size.height - legendH) / 2 - 16);
  const innerR = innerRadius >= 1 ? innerRadius : radius * innerRadius;

  const visible = items.filter((it) => !hidden.has(it.originalIndex));
  const total = visible.reduce((acc, it) => acc + (Number.isFinite(it.value) ? it.value : 0), 0);
  const resolvedLabel = typeof centerLabel === 'function' ? centerLabel(total) : centerLabel;
  const arcs = pieArcs(
    visible.map((it) => (Number.isFinite(it.value) ? it.value : 0)),
    radius,
    innerR,
    { padAngle, cornerRadius },
  );

  return (
    <Svg width={size.svgWidth} height={size.svgHeight} onLayout={size.onLayout}>
      {size.width > 0 && (
        <>
          {theme.background !== 'transparent' && (
            <Rect x={0} y={0} width={size.width} height={size.height} fill={theme.background} />
          )}
          <G transform={`translate(${cx},${cy}) scale(${0.6 + 0.4 * t})`} opacity={t}>
        {arcs.map((arc) => {
          const item = visible[arc.index];
          const isActive = active === item.originalIndex;
          // "Explode" the active slice along its centroid direction.
          const [mx, my] = arc.centroid;
          const mag = Math.hypot(mx, my) || 1;
          const off = isActive ? 8 : 0;
          const dx = (mx / mag) * off;
          const dy = (my / mag) * off;
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <G key={item.originalIndex} transform={`translate(${dx},${dy})`} onPress={() => setActive(isActive ? null : item.originalIndex)}>
              <Path d={arc.path} fill={item.color} stroke={theme.background === 'transparent' ? '#fff' : theme.background} strokeWidth={1.5} />
              {showLabels && pct >= 5 && (
                <SvgText
                  x={arc.centroid[0]}
                  y={arc.centroid[1]}
                  fill="#fff"
                  fontSize={theme.legend.fontSize}
                  fontFamily={theme.font.family}
                  fontWeight="bold"
                  textAnchor="middle"
                  verticalAnchor="middle"
                >
                  {`${Math.round(pct)}%`}
                </SvgText>
              )}
            </G>
          );
        })}
        {innerR > 0 && resolvedLabel && (() => {
          const fontSize = fitCenterFontSize(resolvedLabel, innerR);
          if (fontSize < MIN_CENTER_FONT) return null;
          const subFontSize = Math.round(fontSize * 0.5);
          const canFitSubLabel = !!centerSubLabel && innerR * 2 >= fontSize + subFontSize + 6;
          return (
            <>
              <SvgText
                x={0}
                y={canFitSubLabel ? -(subFontSize / 2 + 2) : 0}
                fill={theme.font.color}
                fontSize={fontSize}
                fontFamily={theme.font.family}
                fontWeight="bold"
                textAnchor="middle"
                verticalAnchor="middle"
              >
                {resolvedLabel}
              </SvgText>
              {canFitSubLabel && (
                <SvgText
                  x={0}
                  y={fontSize / 2 + 2}
                  fill={theme.legend.color}
                  fontSize={subFontSize}
                  fontFamily={theme.font.family}
                  textAnchor="middle"
                  verticalAnchor="middle"
                >
                  {centerSubLabel}
                </SvgText>
              )}
            </>
          );
        })()}
      </G>

          {showLegend && <PieLegend items={items} hidden={hidden} theme={theme} width={size.width} y={size.height - legendH + 2} onToggle={(idx) => {
            setHidden((prev) => {
              const next = new Set(prev);
              if (next.has(idx)) next.delete(idx);
              else next.add(idx);
              return next;
            });
          }} />}
        </>
      )}
    </Svg>
  );
}

interface PieLegendProps {
  items: { originalIndex: number; label: string; color: string }[];
  hidden: Set<number>;
  theme: ChartTheme;
  width: number;
  y: number;
  onToggle: (index: number) => void;
}

function PieLegend({ items, hidden, theme, width, y, onToggle }: PieLegendProps) {
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
