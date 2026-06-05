import { useMemo } from 'react';
import {
  calculateSankeyLayout,
  type SankeyData,
} from '../../../core/sankey';
import { useTheme } from '../../../theme/useTheme';
import { useAutoSize, type Dimension } from '../../../hooks/useAutoSize';
import { Svg, G, Rect, SvgText } from '../../../primitives';
import { useAnimatedValue } from '../../../hooks/useAnimatedValue';
import type { ChartTheme, DeepPartial } from '../../../theme/useTheme';
import type { Margin } from '../../../core/types';
import { SankeyNode } from './SankeyNode';
import { SankeyLink } from './SankeyLink';

export interface SankeyDiagramProps {
  /** Nodes and links defining the Sankey flow. */
  data: SankeyData;
  /** Pixel width, or 'auto' (default) to fill the parent. */
  width?: Dimension;
  /** Pixel height, or 'auto' to derive from width via `aspect`. Default 300. */
  height?: Dimension;
  /** width / height ratio when height is 'auto'. Default 1.33. */
  aspect?: number;
  /** Chart margin. */
  margin?: Partial<Margin>;
  /** Chart theme override. */
  theme?: DeepPartial<ChartTheme>;
  /** Override the categorical palette. */
  colors?: string[];
  /** Show animations. */
  animate?: boolean;
  /** Optional: custom colors per node ID. */
  nodeColors?: Record<string | number, string>;
}

const defaultMargin: Margin = { top: 20, right: 20, bottom: 20, left: 20 };

/**
 * Sankey diagram. Self-contained (does not use the Cartesian frame).
 * Shows flow relationships from source to target nodes with proportional link widths.
 */
export function SankeyDiagram({
  data,
  width = 'auto',
  height = 'auto',
  aspect = 1.33,
  margin: customMargin,
  theme: themeOverride,
  colors,
  animate = true,
  nodeColors = {},
}: SankeyDiagramProps) {
  const theme = useTheme(themeOverride);
  const size = useAutoSize(width, height, aspect);
  const palette = colors ?? theme.colors;

  const finalMargin = useMemo<Margin>(
    () => ({ ...defaultMargin, ...customMargin }),
    [customMargin]
  );

  const t = useAnimatedValue({
    enabled: animate && theme.animation.enabled,
    durationMs: theme.animation.durationMs,
  });

  // Validate data
  const validData = useMemo(
    () => (data && Array.isArray(data.nodes) ? data : { nodes: [], links: [] }),
    [data]
  );

  const layout = useMemo(
    () =>
      calculateSankeyLayout(validData, size.width, size.height, finalMargin),
    [validData, size.width, size.height, finalMargin]
  );

  // Empty state
  if (validData.nodes.length === 0) {
    return (
      <Svg width={size.svgWidth} height={size.svgHeight} onLayout={size.onLayout}>
        {theme.background !== 'transparent' && (
          <Rect
            x={0}
            y={0}
            width={size.width}
            height={size.height}
            fill={theme.background}
          />
        )}
        <SvgText
          x={size.width / 2}
          y={size.height / 2}
          textAnchor="middle"
          fill={theme.font.color}
          fontSize={theme.font.size}
        >
          No data available
        </SvgText>
      </Svg>
    );
  }

  return (
    <Svg width={size.svgWidth} height={size.svgHeight} onLayout={size.onLayout}>
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
          <G
            transform={`translate(${finalMargin.left},${finalMargin.top}) scale(${0.8 + 0.2 * t})`}
            opacity={t}
          >
            {/* Links (drawn first, so they appear behind nodes) */}
            {layout.links.map((link, idx) => (
              <SankeyLink
                key={`link-${idx}`}
                link={link}
                opacity={0.3}
              />
            ))}

            {/* Nodes */}
            {layout.nodes.map((node, idx) => {
              const color =
                nodeColors[node.id] || palette[idx % palette.length];

              return (
                <SankeyNode
                  key={`node-${idx}`}
                  node={node}
                  color={color}
                  theme={theme}
                />
              );
            })}
          </G>
        </>
      )}
    </Svg>
  );
}

SankeyDiagram.displayName = 'SankeyDiagram';
