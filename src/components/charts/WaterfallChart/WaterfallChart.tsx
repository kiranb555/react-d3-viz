import { useMemo, useState } from 'react';
import { Svg, G, Rect, SvgText } from '../../../primitives';
import { useTheme } from '../../../theme/useTheme';
import { useAutoSize, type Dimension } from '../../../hooks/useAutoSize';
import { useAnimatedValue } from '../../../hooks/useAnimatedValue';
import {
  calculateWaterfallLayout,
  type WaterfallDataPoint,
} from '../../../core/waterfall';
import type { ChartTheme, DeepPartial } from '../../../theme/useTheme';
import { Waterfall } from './Waterfall';

export interface WaterfallChartProps {
  /** Array of data points with label and value. */
  data: WaterfallDataPoint[];
  /** Pixel width, or 'auto' (default) to fill the parent. */
  width?: Dimension;
  /** Pixel height, or 'auto' to derive from width via `aspect`. Default 300. */
  height?: Dimension;
  /** width / height ratio when height is 'auto'. Default 1.33. */
  aspect?: number;
  /** Chart theme override. */
  theme?: DeepPartial<ChartTheme>;
  /** Override the categorical palette. */
  colors?: string[];
  /** Show animations. */
  animate?: boolean;
  /** Format the numeric values displayed. */
  valueFormatter?: (value: number) => string;
}

const defaultMargin = { top: 20, right: 20, bottom: 40, left: 60 };

/**
 * Waterfall chart. Self-contained (does not use the Cartesian frame). Shows the
 * cumulative effect of sequentially introduced positive and negative values.
 * Segments are connected by lines, and a total segment can be marked with `isTotal`.
 */
export function WaterfallChart({
  data,
  width,
  height = 'auto',
  aspect = 1.33,
  theme: themeOverride,
  colors,
  animate,
  valueFormatter = (v) => v.toFixed(0),
}: WaterfallChartProps) {
  const theme = useTheme(themeOverride);
  const size = useAutoSize(width ?? 'auto', height, aspect);
  const palette = colors ?? theme.colors;

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const t = useAnimatedValue({
    enabled: (animate ?? theme.animation.enabled) && theme.animation.enabled,
    durationMs: theme.animation.durationMs,
  });

  // Validate data
  const validData = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data]
  );

  const layout = useMemo(
    () =>
      calculateWaterfallLayout(validData, size.width, size.height, defaultMargin),
    [validData, size.width, size.height]
  );

  // Empty state
  if (validData.length === 0) {
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
            transform={`translate(${defaultMargin.left},${defaultMargin.top}) scale(${0.8 + 0.2 * t})`}
            opacity={t}
          >
            <Waterfall
              layout={layout}
              data={validData}
              colors={palette}
              valueFormatter={valueFormatter}
              activeIndex={activeIndex}
              onSegmentPress={(idx) => setActiveIndex(activeIndex === idx ? null : idx)}
              theme={theme}
            />
          </G>
        </>
      )}
    </Svg>
  );
}

WaterfallChart.displayName = 'WaterfallChart';
