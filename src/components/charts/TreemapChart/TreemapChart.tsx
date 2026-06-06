import { useState } from 'react';
import { Svg, G, Rect, SvgText } from '../../../primitives';
import { useTheme } from '../../../theme/useTheme';
import { useAnimatedValue } from '../../../hooks/useAnimatedValue';
import { useAutoSize, type Dimension } from '../../../hooks/useAutoSize';
import { treemapLayout, type TreemapRect, type ChildrenAccessor } from '../../../core/treemap';
import { getCategory } from '../../../core/accessors';
import { getContrastingTextColor } from '../../../utils/colorHelpers';
import type { Accessor } from '../../../core/accessors';
import type { Datum } from '../../../core/types';
import type { ChartTheme, DeepPartial } from '../../../theme/defaultTheme';

export interface TreemapChartProps {
  /** A flat array of records, or a single nested root record. */
  data: Datum[] | Datum;
  /** Accessor for each cell's numeric value (size). */
  value: Accessor<number>;
  /** Accessor for each cell's label (text inside the cell + tooltip). */
  label?: Accessor<unknown>;
  /** Flat data only: group records into a 2-level treemap, colored by group. */
  group?: Accessor<unknown>;
  /**
   * Nested data only: how to read a record's children. A key (default
   * `"children"`) or a function. Named `childrenKey` to avoid colliding with
   * React's `children`.
   */
  childrenKey?: ChildrenAccessor;
  /** Pixel width, or 'auto' (default) to fill the parent. */
  width?: Dimension;
  /** Pixel height, or 'auto' to derive from width via `aspect`. Default 300. */
  height?: Dimension;
  /** width / height ratio when height is 'auto'. Default 1.6. */
  aspect?: number;
  theme?: DeepPartial<ChartTheme>;
  /** Gap between cells, in px. Default 1. */
  padding?: number;
  /** Header band height for groups (grouped mode auto-uses 18). */
  paddingTop?: number;
  /** Override the categorical palette. */
  colors?: string[];
  /** Show labels inside cells (hidden when a cell is too small). Default true. */
  showLabels?: boolean;
  /** Show the value beneath the label. Default false. */
  showValues?: boolean;
  /** Show the interactive legend. Default true. */
  showLegend?: boolean;
  /** Show the hover/touch tooltip. Default true. */
  showTooltip?: boolean;
  /** Format the numeric value shown in labels/tooltip. */
  valueFormat?: (value: number) => string;
  animate?: boolean;
}

const CHAR_W = 0.6; // rough character-width factor for sizing SVG text

interface LegendEntry {
  key: string;
  label: string;
}

/**
 * Treemap. Self-contained (does not use the Cartesian frame). Accepts flat data
 * (optionally a `group` accessor for a 2-level grouped map) or a nested root
 * record (`childrenKey`). Leaves are colored by their top-level ancestor — the
 * classic "flare" look. Cells animate in; tapping a legend item re-packs the map.
 */
export function TreemapChart({
  data,
  value,
  label,
  group,
  childrenKey,
  width,
  height,
  aspect = 1.6,
  theme: themeOverride,
  padding = 1,
  paddingTop,
  colors,
  showLabels = true,
  showValues = false,
  showLegend = true,
  showTooltip = true,
  valueFormat,
  animate,
}: TreemapChartProps) {
  const theme = useTheme(themeOverride);
  const size = useAutoSize(width, height ?? 'auto', aspect);
  const palette = colors ?? theme.colors;
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<{ x: number; y: number; rect: TreemapRect } | null>(null);

  const t = useAnimatedValue({
    enabled: (animate ?? theme.animation.enabled) && theme.animation.enabled,
    durationMs: theme.animation.durationMs,
  });

  const fmt = valueFormat ?? ((v: number) => v.toLocaleString());
  const isArray = Array.isArray(data);
  const isGrouped = isArray && !!group;

  // --- Stable top-level keys (from the FULL data) → stable colors + legend. ---
  const childrenAcc: ChildrenAccessor = childrenKey ?? 'children';
  const childrenList = (d: Datum): Datum[] => {
    const raw = typeof childrenAcc === 'function' ? childrenAcc(d) : d[childrenAcc as string];
    return Array.isArray(raw) ? (raw as Datum[]) : [];
  };

  const entries: LegendEntry[] = [];
  const seen = new Set<string>();
  const datumKey = new Map<Datum, string>();
  if (isArray) {
    (data as Datum[]).forEach((d, i) => {
      const key = group ? getCategory(d, group, i) : label ? getCategory(d, label, i) : String(i);
      datumKey.set(d, key);
      if (!seen.has(key)) {
        seen.add(key);
        entries.push({ key, label: group || label ? key : String(i + 1) });
      }
    });
  } else {
    const kids = childrenList(data as Datum);
    if (kids.length === 0) {
      const k = label ? getCategory(data as Datum, label, 0) : 'root';
      entries.push({ key: k, label: k });
    } else {
      kids.forEach((c, i) => {
        const k = label ? getCategory(c, label, i) : String(i);
        if (!seen.has(k)) {
          seen.add(k);
          entries.push({ key: k, label: k });
        }
      });
    }
  }
  const colorIndex = new Map(entries.map((e, i) => [e.key, i]));
  const colorForKey = (key: string) => palette[(colorIndex.get(key) ?? 0) % palette.length];
  const keyForRect = (r: TreemapRect) =>
    isArray ? (datumKey.get(r.data) ?? r.groupLabel) : r.groupLabel;

  // --- Filtered layout input (hidden groups are dropped so the map re-packs). ---
  const layoutInput = isArray
    ? { data: (data as Datum[]).filter((d) => !hidden.has(datumKey.get(d)!)), value, label, group }
    : {
        data: data as Datum,
        value,
        label,
        children: ((d: Datum) => {
          const kids = childrenList(d);
          if (d === data) {
            return kids.filter((c, i) => !hidden.has(label ? getCategory(c, label, i) : String(i)));
          }
          return kids;
        }) as ChildrenAccessor,
      };

  const legendH = showLegend ? theme.legend.swatchSize + 16 : 0;
  const chartH = Math.max(0, size.height - legendH);
  const padTop = paddingTop ?? (isGrouped ? 18 : 0);

  const rects =
    size.width > 0
      ? treemapLayout(layoutInput, {
          width: size.width,
          height: chartH,
          paddingInner: padding,
          paddingTop: padTop,
        })
      : [];

  const leaves = rects.filter((r) => r.isLeaf);
  const groups = rects.filter((r) => !r.isLeaf && r.depth === 1);

  const handleMove = (e: { x: number; y: number }) => {
    const hit = [...leaves]
      .reverse()
      .find((r) => e.x >= r.x0 && e.x <= r.x1 && e.y >= r.y0 && e.y <= r.y1);
    setActive(hit ? { x: e.x, y: e.y, rect: hit } : null);
  };

  const fontSize = theme.legend.fontSize;
  const labelColor = theme.font.color;

  return (
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

          {/* Group bands (grouped mode only) behind the leaves. */}
          {isGrouped &&
            groups.map((g, i) => (
              <G key={`g${i}`}>
                <Rect
                  x={g.x0}
                  y={g.y0}
                  width={Math.max(0, g.x1 - g.x0)}
                  height={Math.max(0, g.y1 - g.y0)}
                  fill={colorForKey(g.groupLabel)}
                  opacity={0.12 * t}
                />
                {padTop > 0 && g.x1 - g.x0 > g.label.length * fontSize * CHAR_W + 6 && (
                  <SvgText
                    x={g.x0 + 4}
                    y={g.y0 + padTop / 2}
                    fill={colorForKey(g.groupLabel)}
                    fontSize={fontSize}
                    fontFamily={theme.font.family}
                    fontWeight="bold"
                    textAnchor="start"
                    verticalAnchor="middle"
                    opacity={t}
                  >
                    {g.label}
                  </SvgText>
                )}
              </G>
            ))}

          {/* Leaf cells — grown from their center for the enter animation. */}
          {leaves.map((r) => {
            const cw = r.x1 - r.x0;
            const ch = r.y1 - r.y0;
            if (cw <= 0 || ch <= 0) return null;
            const cx = r.x0 + cw / 2;
            const cy = r.y0 + ch / 2;
            const w = cw * t;
            const h = ch * t;
            const x = cx - w / 2;
            const y = cy - h / 2;
            const fill = colorForKey(keyForRect(r));
            const labelPx = r.label.length * fontSize * CHAR_W;
            const fits =
              showLabels &&
              r.label &&
              cw > labelPx + 6 &&
              ch > (showValues ? 2 * fontSize + 6 : fontSize + 6);
            return (
              <G key={r.index} onPress={() => setActive({ x: cx, y: r.y0, rect: r })}>
                <Rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  fill={fill}
                  stroke={theme.background === 'transparent' ? '#fff' : theme.background}
                  strokeWidth={1}
                  opacity={t}
                />
                {fits && (
                  <G opacity={t}>
                    <SvgText
                      x={r.x0 + 4}
                      y={r.y0 + fontSize}
                      fill={labelColor}
                      fontSize={fontSize}
                      fontFamily={theme.font.family}
                      textAnchor="start"
                      verticalAnchor="middle"
                    >
                      {r.label}
                    </SvgText>
                    {showValues && (
                      <SvgText
                        x={r.x0 + 4}
                        y={r.y0 + fontSize * 2}
                        fill={labelColor}
                        fontSize={fontSize - 1}
                        fontFamily={theme.font.family}
                        textAnchor="start"
                        verticalAnchor="middle"
                        opacity={0.7}
                      >
                        {fmt(r.value)}
                      </SvgText>
                    )}
                  </G>
                )}
              </G>
            );
          })}

          {showTooltip && active && (
            <TreemapTooltip
              x={active.x}
              y={active.y}
              text={active.rect.label || fmt(active.rect.value)}
              valueText={active.rect.label ? fmt(active.rect.value) : ''}
              color={colorForKey(keyForRect(active.rect))}
              theme={theme}
              bounds={{ width: size.width, height: chartH }}
            />
          )}

          {showLegend && (
            <TreemapLegend
              entries={entries}
              hidden={hidden}
              colorForKey={colorForKey}
              theme={theme}
              width={size.width}
              y={size.height - legendH + 2}
              onToggle={(key) =>
                setHidden((prev) => {
                  const next = new Set(prev);
                  if (next.has(key)) next.delete(key);
                  else next.add(key);
                  return next;
                })
              }
            />
          )}
        </>
      )}
    </Svg>
  );
}

interface TreemapTooltipProps {
  x: number;
  y: number;
  text: string;
  valueText: string;
  color: string;
  theme: ChartTheme;
  bounds: { width: number; height: number };
}

function TreemapTooltip({ x, y, text, valueText, color, theme, bounds }: TreemapTooltipProps) {
  const fontSize = theme.tooltip.fontSize;
  const lineH = fontSize + 6;
  const pad = 8;
  const rows = valueText ? [text, valueText] : [text];
  const longest = Math.max(...rows.map((r) => r.length), 1);
  const boxW = pad * 2 + 12 + longest * fontSize * CHAR_W;
  const boxH = pad * 2 + lineH * rows.length;
  const flip = x + boxW + 16 > bounds.width;
  const boxX = Math.max(0, flip ? x - boxW - 12 : x + 12);
  const boxY = Math.max(0, Math.min(y + 8, bounds.height - boxH));

  const textColor = getContrastingTextColor(color);

  return (
    <G transform={`translate(${boxX},${boxY})`}>
      <Rect
        x={0}
        y={0}
        width={boxW}
        height={boxH}
        rx={theme.tooltip.radius}
        ry={theme.tooltip.radius}
        fill={color}
        stroke={textColor}
        strokeWidth={1}
        opacity={0.95}
      />
      <Rect x={pad} y={pad + 1} width={8} height={8} rx={2} fill={textColor} opacity={0.5} />
      <SvgText
        x={pad + 14}
        y={pad + fontSize - 1}
        fill={textColor}
        fontSize={fontSize}
        fontWeight="bold"
        fontFamily={theme.font.family}
        verticalAnchor="start"
      >
        {text}
      </SvgText>
      {valueText ? (
        <SvgText
          x={pad}
          y={pad + lineH + fontSize - 1}
          fill={textColor}
          fontSize={fontSize}
          fontFamily={theme.font.family}
          verticalAnchor="start"
        >
          {valueText}
        </SvgText>
      ) : null}
    </G>
  );
}

interface TreemapLegendProps {
  entries: LegendEntry[];
  hidden: Set<string>;
  colorForKey: (key: string) => string;
  theme: ChartTheme;
  width: number;
  y: number;
  onToggle: (key: string) => void;
}

function TreemapLegend({ entries, hidden, colorForKey, theme, width, y, onToggle }: TreemapLegendProps) {
  const { swatchSize, gap, fontSize, color } = theme.legend;
  const measured = entries.map((e) => ({ e, w: swatchSize + 6 + e.label.length * fontSize * CHAR_W }));
  const rowW = measured.reduce((acc, m) => acc + m.w + gap, -gap);
  const start = Math.max(0, (width - rowW) / 2);
  const positioned = measured.map((m, i) => ({
    ...m,
    x: start + measured.slice(0, i).reduce((acc, p) => acc + p.w + gap, 0),
  }));

  return (
    <G>
      {positioned.map(({ e, w, x }) => {
        const dim = hidden.has(e.key) ? 0.35 : 1;
        return (
          <G key={e.key} transform={`translate(${x},${y})`} onPress={() => onToggle(e.key)}>
            <Rect x={0} y={0} width={w} height={swatchSize + 4} fill="transparent" />
            <Rect x={0} y={2} width={swatchSize} height={swatchSize} rx={2} fill={colorForKey(e.key)} opacity={dim} />
            <SvgText
              x={swatchSize + 6}
              y={2 + swatchSize / 2}
              fill={color}
              opacity={dim}
              fontSize={fontSize}
              fontFamily={theme.font.family}
              textAnchor="start"
              verticalAnchor="middle"
            >
              {e.label}
            </SvgText>
          </G>
        );
      })}
    </G>
  );
}
