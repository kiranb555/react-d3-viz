import { useState } from 'react';
import { Svg, G, Path, Line, Circle, Rect, SvgText } from '../../../primitives';
import { useTheme } from '../../../theme/useTheme';
import { useAnimatedValue } from '../../../hooks/useAnimatedValue';
import { useAutoSize, type Dimension } from '../../../hooks/useAutoSize';
import { getNumber, getCategory } from '../../../core/accessors';
import type { Accessor } from '../../../core/accessors';
import type { Datum } from '../../../core/types';
import type { SeriesConfig } from '../../chartTypes';
import type { ChartTheme, DeepPartial } from '../../../theme/defaultTheme';

export interface RadarChartProps {
  /** One record per axis (spoke). */
  data: Datum[];
  /** Accessor for each axis label. */
  axis: Accessor<unknown>;
  /** Series to overlay; each reads a value per axis via its dataKey. */
  series: SeriesConfig[];
  /** Pixel width, or 'auto' (default) to fill the parent. */
  width?: Dimension;
  /** Pixel height, or 'auto' (default) to match the width (square). */
  height?: Dimension;
  /** width / height ratio when height is 'auto'. Default 1 (square). */
  aspect?: number;
  theme?: DeepPartial<ChartTheme>;
  /** Domain max. Defaults to the largest value across all series. */
  maxValue?: number;
  /** Number of concentric grid rings. Default 4. */
  levels?: number;
  /** Fill opacity for each series polygon. Default 0.2. */
  fillOpacity?: number;
  showLegend?: boolean;
  showAxisLabels?: boolean;
  animate?: boolean;
}

const CHAR_W = 0.6;

function polygonPath(points: [number, number][]): string {
  if (points.length === 0) return '';
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ') + ' Z';
}

/**
 * Radar (spider) chart. Each record is an axis; each series is a polygon across
 * the axes. Self-contained radial chart (does not use the Cartesian frame).
 */
export function RadarChart({
  data,
  axis,
  series,
  width,
  height,
  aspect = 1,
  theme: themeOverride,
  maxValue,
  levels = 4,
  fillOpacity = 0.2,
  showLegend = true,
  showAxisLabels = true,
  animate,
}: RadarChartProps) {
  const theme = useTheme(themeOverride);
  const size = useAutoSize(width, height ?? 'auto', aspect);
  const [hidden, setHidden] = useState<Set<number>>(new Set());
  const t = useAnimatedValue({
    enabled: (animate ?? theme.animation.enabled) && theme.animation.enabled,
    durationMs: theme.animation.durationMs,
  });

  const n = data.length;
  const legendH = showLegend ? theme.legend.swatchSize + 16 : 0;
  const cx = size.width / 2;
  const cy = (size.height - legendH) / 2;
  const radius = Math.max(0, Math.min(size.width, size.height - legendH) / 2 - 28);

  const resolved = series.map((s, i) => ({
    ...s,
    color: s.color ?? theme.colors[i % theme.colors.length],
    label: s.label ?? (typeof s.dataKey === 'string' ? s.dataKey : `series ${i + 1}`),
    seriesIndex: i,
    hidden: hidden.has(i),
  }));

  // Domain max across every series value (unless overridden).
  let max = maxValue ?? 0;
  if (maxValue == null) {
    data.forEach((d, i) => series.forEach((s) => {
      const v = getNumber(d, s.dataKey, i);
      if (Number.isFinite(v) && v > max) max = v;
    }));
    if (max === 0) max = 1;
  }

  const angleFor = (i: number) => -Math.PI / 2 + (i / n) * Math.PI * 2;
  const pointAt = (i: number, r: number): [number, number] => [Math.cos(angleFor(i)) * r, Math.sin(angleFor(i)) * r];

  const toggle = (idx: number) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });

  return (
    <Svg width={size.svgWidth} height={size.svgHeight} onLayout={size.onLayout}>
      {size.width > 0 && (
        <>
          {theme.background !== 'transparent' && <Rect x={0} y={0} width={size.width} height={size.height} fill={theme.background} />}
          <G transform={`translate(${cx},${cy})`}>
        {/* concentric grid rings */}
        {Array.from({ length: levels }, (_, l) => {
          const r = (radius * (l + 1)) / levels;
          const pts = Array.from({ length: n }, (_, i) => pointAt(i, r));
          return <Path key={`ring${l}`} d={polygonPath(pts)} fill="none" stroke={theme.grid.color} strokeWidth={theme.grid.strokeWidth} />;
        })}
        {/* spokes + axis labels */}
        {data.map((d, i) => {
          const [ox, oy] = pointAt(i, radius);
          const [lx, ly] = pointAt(i, radius + 14);
          return (
            <G key={`spoke${i}`}>
              <Line x1={0} y1={0} x2={ox} y2={oy} stroke={theme.grid.color} strokeWidth={theme.grid.strokeWidth} />
              {showAxisLabels && (
                <SvgText x={lx} y={ly} fill={theme.axis.labelColor} fontSize={theme.axis.labelSize} fontFamily={theme.font.family} textAnchor="middle" verticalAnchor="middle">
                  {getCategory(d, axis, i)}
                </SvgText>
              )}
            </G>
          );
        })}
        {/* series polygons */}
        {resolved.map((s) => {
          if (s.hidden) return null;
          const pts = data.map((d, i) => pointAt(i, (getNumber(d, s.dataKey, i) / max) * radius * t));
          return (
            <G key={s.seriesIndex}>
              <Path d={polygonPath(pts)} fill={s.color} fillOpacity={fillOpacity} stroke={s.color} strokeWidth={2} strokeLinejoin="round" />
              {pts.map((p, i) => (
                <Circle key={i} cx={p[0]} cy={p[1]} r={3} fill={s.color} />
              ))}
            </G>
          );
        })}
      </G>

          {showLegend && (
            <RadarLegend items={resolved} theme={theme} width={size.width} y={size.height - legendH + 2} onToggle={toggle} />
          )}
        </>
      )}
    </Svg>
  );
}

interface RadarLegendProps {
  items: { seriesIndex: number; label: string; color: string; hidden?: boolean }[];
  theme: ChartTheme;
  width: number;
  y: number;
  onToggle: (index: number) => void;
}

function RadarLegend({ items, theme, width, y, onToggle }: RadarLegendProps) {
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
        const dim = it.hidden ? 0.35 : 1;
        return (
          <G key={it.seriesIndex} transform={`translate(${x},${y})`} onPress={() => onToggle(it.seriesIndex)}>
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
