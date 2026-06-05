import { useState, useMemo } from 'react';
import { Svg, G, Path, Circle, SvgText, Rect } from '../../../primitives';
import { useTheme } from '../../../theme/useTheme';
import { useAnimatedValue } from '../../../hooks/useAnimatedValue';
import { useAutoSize, type Dimension } from '../../../hooks/useAutoSize';
import { sunburstLayout, type SunburstArc } from '../../../core/sunburst';
import type { Accessor } from '../../../core/accessors';
import type { Datum } from '../../../core/types';
import type { ChartTheme, DeepPartial } from '../../../theme/defaultTheme';

export interface SunburstChartProps {
  data: Datum[] | Datum;
  value: Accessor<number>;
  label?: Accessor<unknown>;
  childrenKey?: string | ((d: Datum) => Datum[] | undefined);
  width?: Dimension;
  height?: Dimension;
  aspect?: number;
  theme?: DeepPartial<ChartTheme>;
  colors?: string[];
  innerRadius?: number;
  padAngle?: number;
  showLabels?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  animate?: boolean;
}

const CHAR_W = 0.6;
const LABEL_MIN_ANGLE = 0.15;
const BACK_BUTTON_RADIUS = 20;

interface TooltipState {
  x: number;
  y: number;
  label: string;
  value: number;
  parentValue: number;
  depth: number;
}

export function SunburstChart({
  data,
  value,
  label,
  childrenKey,
  width,
  height,
  aspect = 1,
  theme: themeOverride,
  colors,
  innerRadius = 0,
  padAngle = 0.01,
  showLabels = true,
  showTooltip = true,
  showLegend = true,
  animate,
}: SunburstChartProps) {
  const theme = useTheme(themeOverride);
  const size = useAutoSize(width, height ?? 'auto', aspect);
  const palette = colors ?? theme.colors;

  const [focusStack, setFocusStack] = useState<Datum[]>([]);
  const [hidden, setHidden] = useState<Set<number>>(new Set());
  const [active, setActive] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const t = useAnimatedValue({
    enabled: (animate ?? theme.animation.enabled) && theme.animation.enabled,
    durationMs: theme.animation.durationMs,
  });

  const currentRoot = focusStack.length > 0 ? focusStack[focusStack.length - 1] : data;

  const arcs = useMemo(
    () =>
      sunburstLayout(
        { data: currentRoot, value, label, children: childrenKey },
        {
          radius: Math.min(size.width, size.height) / 2 - 16,
          innerRadius,
          padAngle,
        }
      ),
    [currentRoot, value, label, childrenKey, size.width, size.height, innerRadius, padAngle]
  );

  const legendH = showLegend ? theme.legend.swatchSize + 16 : 0;
  const cx = size.width / 2;
  const cy = (size.height - legendH) / 2;

  const radius = Math.min(size.width, size.height) / 2 - 16;
  const centerHole = innerRadius >= 1 ? innerRadius : radius * innerRadius;
  const backButtonRadius = centerHole > BACK_BUTTON_RADIUS ? centerHole : BACK_BUTTON_RADIUS;

  const visible = arcs.filter((a) => !hidden.has(a.groupIndex));

  const handleMove = () => {
    // Mouse move handler for the SVG root
  };

  const handleLeave = () => {
    setActive(null);
    setTooltip(null);
  };

  const handleArcClick = (arc: SunburstArc) => {
    if (!arc.isLeaf && arc.data) {
      setFocusStack((prev) => [...prev, arc.data]);
      setActive(null);
      setTooltip(null);
    }
  };

  const handleBackClick = () => {
    setFocusStack((prev) => prev.slice(0, -1));
    setActive(null);
    setTooltip(null);
  };

  return (
    <Svg
      width={size.svgWidth}
      height={size.svgHeight}
      onLayout={size.onLayout}
      onMove={handleMove}
      onLeave={handleLeave}
    >
      {size.width > 0 && (
        <>
          {theme.background !== 'transparent' && (
            <Rect
              x={0}
              y={0}
              width={size.width}
              height={size.height}
              fill={theme.background}
            />
          )}
          <G transform={`translate(${cx},${cy}) scale(${0.6 + 0.4 * t})`} opacity={t}>
            {visible.map((arc) => {
              const color = palette[arc.groupIndex % palette.length];
              const opacity = 1 - (arc.depth - 1) * 0.08;
              const arcAngle = arc.endAngle - arc.startAngle;
              const showLabel = showLabels && arcAngle > LABEL_MIN_ANGLE;
              const isActive = active === arc.index;

              return (
                <G
                  key={`${arc.depth}-${arc.groupIndex}-${arc.index}`}
                  onPress={() => handleArcClick(arc)}
                >
                  <Path
                    d={arc.path}
                    fill={color}
                    opacity={opacity}
                    stroke={theme.background === 'transparent' ? '#fff' : theme.background}
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                  {showLabel && arc.label && (
                    <SvgText
                      x={arc.centroid[0]}
                      y={arc.centroid[1]}
                      fill="#fff"
                      fontSize={theme.legend.fontSize}
                      fontFamily={theme.font.family}
                      textAnchor="middle"
                      verticalAnchor="middle"
                    >
                      {arc.label.length > 20 ? arc.label.substring(0, 17) + '...' : arc.label}
                    </SvgText>
                  )}
                </G>
              );
            })}

            {focusStack.length > 0 && (
              <G onPress={handleBackClick}>
                <Circle
                  cx={0}
                  cy={0}
                  r={backButtonRadius}
                  fill={palette[0]}
                  opacity={0.8}
                  stroke={theme.background === 'transparent' ? '#fff' : theme.background}
                  strokeWidth={1.5}
                />
                <SvgText
                  x={0}
                  y={0}
                  fill="#fff"
                  fontSize={theme.legend.fontSize}
                  fontFamily={theme.font.family}
                  fontWeight="bold"
                  textAnchor="middle"
                  verticalAnchor="middle"
                >
                  ↑
                </SvgText>
              </G>
            )}
          </G>

          {showTooltip && tooltip && (
            <G transform={`translate(${tooltip.x + 8},${tooltip.y - 8})`}>
              <Rect
                x={0}
                y={0}
                width={120}
                height={60}
                fill={theme.tooltip.background}
                stroke={theme.tooltip.borderColor}
                strokeWidth={1}
                rx={theme.tooltip.radius}
              />
              <SvgText
                x={8}
                y={16}
                fill={theme.tooltip.color}
                fontSize={theme.tooltip.fontSize}
                fontFamily={theme.font.family}
                fontWeight="600"
              >
                {tooltip.label}
              </SvgText>
              <SvgText
                x={8}
                y={34}
                fill={theme.tooltip.color}
                fontSize={theme.tooltip.fontSize - 1}
                fontFamily={theme.font.family}
              >
                {tooltip.value.toLocaleString()}
              </SvgText>
              {tooltip.depth > 1 && tooltip.parentValue > 0 && (
                <SvgText
                  x={8}
                  y={50}
                  fill={theme.tooltip.color}
                  fontSize={theme.tooltip.fontSize - 1}
                  fontFamily={theme.font.family}
                >
                  {`${Math.round((tooltip.value / tooltip.parentValue) * 100)}%`}
                </SvgText>
              )}
            </G>
          )}

          {showLegend && (
            <SunburstLegend
              arcs={arcs}
              hidden={hidden}
              theme={theme}
              palette={palette}
              width={size.width}
              y={size.height - legendH + 2}
              onToggle={(groupIndex) => {
                setHidden((prev) => {
                  const next = new Set(prev);
                  if (next.has(groupIndex)) next.delete(groupIndex);
                  else next.add(groupIndex);
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

interface SunburstLegendProps {
  arcs: SunburstArc[];
  hidden: Set<number>;
  theme: ChartTheme;
  palette: string[];
  width: number;
  y: number;
  onToggle: (groupIndex: number) => void;
}

function SunburstLegend({
  arcs,
  hidden,
  theme,
  palette,
  width,
  y,
  onToggle,
}: SunburstLegendProps) {
  const { swatchSize, gap, fontSize, color } = theme.legend;

  const items = Array.from(
    new Map(
      arcs
        .filter((a) => a.depth === 1)
        .map((a) => [a.groupIndex, { groupIndex: a.groupIndex, label: a.groupLabel }])
    ).values()
  );

  const measured = items.map((it) => ({
    it,
    w: swatchSize + 6 + it.label.length * fontSize * CHAR_W,
  }));
  const rowW = measured.reduce((acc, m) => acc + m.w + gap, -gap);
  const start = Math.max(0, (width - rowW) / 2);
  const positioned = measured.map((m, i) => ({
    ...m,
    x: start + measured.slice(0, i).reduce((acc, p) => acc + p.w + gap, 0),
  }));

  return (
    <G>
      {positioned.map(({ it, w, x }) => {
        const dim = hidden.has(it.groupIndex) ? 0.35 : 1;
        return (
          <G key={it.groupIndex} transform={`translate(${x},${y})`} onPress={() => onToggle(it.groupIndex)}>
            <Rect x={0} y={0} width={w} height={swatchSize + 4} fill="transparent" />
            <Rect
              x={0}
              y={2}
              width={swatchSize}
              height={swatchSize}
              rx={2}
              fill={palette[it.groupIndex % palette.length]}
              opacity={dim}
            />
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
              {it.label}
            </SvgText>
          </G>
        );
      })}
    </G>
  );
}
