import { useMemo } from 'react';
import type { DeepPartial, ChartTheme } from '../../../theme/useTheme';
import type { Dimension } from '../../../hooks/useAutoSize';
import type { Margin } from '../../../core/types';
import { calculateMekkoLayout, type MekkoData } from '../../../core/mekko';
import { useTheme } from '../../../theme/useTheme';
import { useAutoSize } from '../../../hooks/useAutoSize';
import { Svg, G, Rect, SvgText } from '../../../primitives';
import { MekkoBar } from './MekkoBar';

export interface MekkoChartProps {
  /** Data with categories and series. */
  data: MekkoData;
  /** Pixel width, or 'auto' (default) to fill the parent. */
  width?: Dimension;
  /** Pixel height, or 'auto' to derive from width via `aspect`. Default 300. */
  height?: Dimension;
  /** width / height ratio when height is 'auto'. Default 4/3. */
  aspect?: number;
  /** Chart margins. */
  margin?: Partial<Margin>;
  /** Chart theme override. */
  theme?: DeepPartial<ChartTheme>;
  /** Override the categorical palette. */
  colors?: string[];
  /** Show animations. */
  animate?: boolean;
  /** Format category labels. */
  categoryLabelFormatter?: (label: string) => string;
  /** Format numeric values. */
  valueFormatter?: (value: number) => string;
  /** Callback on segment hover. */
  onSegmentHover?: (seriesId: string | null) => void;
}

const defaultMargin: Margin = { top: 20, right: 20, bottom: 40, left: 60 };

/**
 * Mekko chart. Self-contained (does not use the Cartesian frame).
 * Shows categories as columns with width proportional to category values,
 * and series as stacked segments within each column.
 */
export function MekkoChart({
  data,
  width = 'auto',
  height = 300,
  aspect = 4 / 3,
  margin: customMargin,
  theme: themeOverride,
  colors,
  animate = true,
  categoryLabelFormatter = (l) => l,
  valueFormatter = (v) => v.toFixed(0),
  onSegmentHover,
}: MekkoChartProps) {
  const theme = useTheme(themeOverride);
  const size = useAutoSize(width, height, aspect);
  const palette = colors ?? theme.colors;

  // Memoize margin to avoid useMemo dependency changes
  const margin = useMemo(
    () => ({ ...defaultMargin, ...customMargin }),
    [customMargin]
  );

  // Calculate layout (must be called unconditionally for hook ordering)
  const layout = useMemo(
    () => calculateMekkoLayout(data, size.width, size.height, margin),
    [data, size.width, size.height, margin]
  );

  // Validate data
  if (!data || !data.categories || data.categories.length === 0) {
    return (
      <Svg width={size.svgWidth} height={size.svgHeight} onLayout={size.onLayout}>
        <Rect
          x={0}
          y={0}
          width={size.width}
          height={size.height}
          fill={theme.background}
        />
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

  if (layout.columns.length === 0) {
    return (
      <Svg width={size.svgWidth} height={size.svgHeight} onLayout={size.onLayout}>
        <Rect
          x={0}
          y={0}
          width={size.width}
          height={size.height}
          fill={theme.background}
        />
        <SvgText
          x={size.width / 2}
          y={size.height / 2}
          textAnchor="middle"
          fill={theme.font.color}
          fontSize={theme.font.size}
        >
          No valid categories
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
          <G transform={`translate(${margin.left},${margin.top})`}>
            {/* Columns */}
            {layout.columns.map((column, colIdx) => (
              <MekkoBar
                key={`column-${colIdx}`}
                column={column}
                colors={palette}
                animate={animate}
                valueFormatter={valueFormatter}
                onHover={onSegmentHover}
              />
            ))}

            {/* Category labels */}
            {layout.columns.map((column, colIdx) => (
              <SvgText
                key={`label-${colIdx}`}
                x={column.x + column.width / 2}
                y={layout.bounds.maxY + 20}
                textAnchor="middle"
                fontSize={12}
                fill={theme.font.color}
              >
                {categoryLabelFormatter(column.label)}
              </SvgText>
            ))}
          </G>
        </>
      )}
    </Svg>
  );
}
