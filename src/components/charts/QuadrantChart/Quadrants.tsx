import { G, Rect, Line, SvgText } from '../../../primitives';
import { useChartContext } from '../../ChartContext';
import type { QuadrantStyle } from '../../../core/quadrant';

interface QuadrantsProps {
  /** Threshold value on the X axis (in data coordinates) */
  thresholdX: number;
  /** Threshold value on the Y axis (in data coordinates) */
  thresholdY: number;
  /** Optional labels for the 4 quadrants [TL, TR, BL, BR] */
  quadrantLabels?: [string, string, string, string];
  /** Whether to show quadrant labels (default: true) */
  showQuadrantLabels?: boolean;
  /** Styling for all quadrants (dividers, background colors, opacity) */
  quadrantStyles: QuadrantStyle[];
  /** X domain bounds [min, max] in data coordinates */
  xDomain: [number, number];
  /** Y domain bounds [min, max] in data coordinates */
  yDomain: [number, number];
}

/**
 * Quadrants component — renders 4 background rectangles, 2 divider lines, and optional labels.
 * Used by QuadrantChart to display the quadrant areas divided by X and Y thresholds.
 */
export function Quadrants({
  thresholdX,
  thresholdY,
  quadrantLabels,
  showQuadrantLabels = true,
  quadrantStyles,
  xDomain,
  yDomain,
}: QuadrantsProps) {
  const { bounds, theme } = useChartContext();

  // For a linear numeric x-scale, the scale maps data values [xDomain[0], xDomain[1]]
  // to pixel positions [0, bounds.innerWidth]. We can invert by sampling two points.
  // However, for categorical x, xPixel takes indices not values, so we need to know the scale type.
  //
  // The safest approach: store the numeric x and y scales or their domains in context.
  // For now, we'll convert threshold data values to pixel positions assuming:
  // - For the inner coordinate space, y=0 is at the bottom, y=bounds.innerHeight is at the top
  // - For x, we need the actual scale (could be linear, band, or point)
  //
  // Convert threshold data values to pixel positions by calling xPixel/yPixel.
  // This assumes xPixel and yPixel are properly defined scales.

  // The tricky part: xPixel(index) for categorical, or xPixel(value) for numeric.
  // We'll assume we need to sample the scale. For now, we compute based on bounds and domain.
  // A proper implementation would pass the actual scale or have xDomain/yDomain in context.

  // Pixel bounds of the plot area
  const x0Pixel = 0; // left edge of inner bounds
  const x1Pixel = bounds.innerWidth; // right edge
  const y0Pixel = bounds.innerHeight; // bottom (max y value)
  const y1Pixel = 0; // top (min y value)

  // Convert threshold values to pixels using linear interpolation
  // Assumes the scale is linear: pixel = (value - min) / (max - min) * pixelRange
  const xRange = xDomain[1] - xDomain[0];
  const yRange = yDomain[1] - yDomain[0];

  const thresholdXPixel = x0Pixel + ((thresholdX - xDomain[0]) / xRange) * (x1Pixel - x0Pixel);
  const thresholdYPixel = y0Pixel - ((thresholdY - yDomain[0]) / yRange) * (y0Pixel - y1Pixel);

  // Clamp thresholds to within bounds
  const clampedThresholdXPixel = Math.max(x0Pixel, Math.min(x1Pixel, thresholdXPixel));
  const clampedThresholdYPixel = Math.max(y1Pixel, Math.min(y0Pixel, thresholdYPixel));

  // Define the 4 quadrants: TL (0), TR (1), BL (2), BR (3)
  const quadrants = [
    // Top-left (0): x < threshold, y >= threshold
    {
      x: x0Pixel,
      y: y1Pixel,
      width: clampedThresholdXPixel - x0Pixel,
      height: clampedThresholdYPixel - y1Pixel,
      labelX: x0Pixel + (clampedThresholdXPixel - x0Pixel) / 2,
      labelY: y1Pixel + (clampedThresholdYPixel - y1Pixel) / 2,
    },
    // Top-right (1): x >= threshold, y >= threshold
    {
      x: clampedThresholdXPixel,
      y: y1Pixel,
      width: x1Pixel - clampedThresholdXPixel,
      height: clampedThresholdYPixel - y1Pixel,
      labelX: clampedThresholdXPixel + (x1Pixel - clampedThresholdXPixel) / 2,
      labelY: y1Pixel + (clampedThresholdYPixel - y1Pixel) / 2,
    },
    // Bottom-left (2): x < threshold, y < threshold
    {
      x: x0Pixel,
      y: clampedThresholdYPixel,
      width: clampedThresholdXPixel - x0Pixel,
      height: y0Pixel - clampedThresholdYPixel,
      labelX: x0Pixel + (clampedThresholdXPixel - x0Pixel) / 2,
      labelY: clampedThresholdYPixel + (y0Pixel - clampedThresholdYPixel) / 2,
    },
    // Bottom-right (3): x >= threshold, y < threshold
    {
      x: clampedThresholdXPixel,
      y: clampedThresholdYPixel,
      width: x1Pixel - clampedThresholdXPixel,
      height: y0Pixel - clampedThresholdYPixel,
      labelX: clampedThresholdXPixel + (x1Pixel - clampedThresholdXPixel) / 2,
      labelY: clampedThresholdYPixel + (y0Pixel - clampedThresholdYPixel) / 2,
    },
  ];

  const defaultFontSize = theme.axis.labelSize || 12;
  const labelColor = theme.axis.labelColor || '#666';

  return (
    <G>
      {/* Quadrant background rectangles */}
      {quadrants.map((quad, i) => {
        // Only render if width and height are positive
        if (quad.width <= 0 || quad.height <= 0) return null;
        return (
          <Rect
            key={`bg-${i}`}
            x={quad.x}
            y={quad.y}
            width={quad.width}
            height={quad.height}
            fill={quadrantStyles[i].backgroundColor}
            fillOpacity={quadrantStyles[i].backgroundOpacity}
          />
        );
      })}

      {/* Vertical divider line (X threshold) */}
      <Line
        x1={clampedThresholdXPixel}
        y1={y1Pixel}
        x2={clampedThresholdXPixel}
        y2={y0Pixel}
        stroke={quadrantStyles[0].dividerStroke}
        strokeWidth={quadrantStyles[0].dividerStrokeWidth}
        strokeDasharray="2,2"
      />

      {/* Horizontal divider line (Y threshold) */}
      <Line
        x1={x0Pixel}
        y1={clampedThresholdYPixel}
        x2={x1Pixel}
        y2={clampedThresholdYPixel}
        stroke={quadrantStyles[0].dividerStroke}
        strokeWidth={quadrantStyles[0].dividerStrokeWidth}
        strokeDasharray="2,2"
      />

      {/* Quadrant labels (centered in each quadrant) */}
      {showQuadrantLabels &&
        quadrantLabels &&
        quadrants.map((quad, i) => {
          // Only render label if quadrant has positive dimensions
          if (quad.width <= 0 || quad.height <= 0) return null;
          return (
            <SvgText
              key={`label-${i}`}
              x={quad.labelX}
              y={quad.labelY}
              textAnchor="middle"
              verticalAnchor="middle"
              fontSize={defaultFontSize}
              fill={labelColor}
              opacity={0.6}
            >
              {quadrantLabels[i]}
            </SvgText>
          );
        })}
    </G>
  );
}
