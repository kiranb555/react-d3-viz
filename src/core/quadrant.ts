import type { ChartTheme } from '../theme/useTheme';

export interface QuadrantStyle {
  dividerStroke: string;
  dividerStrokeWidth: number;
  backgroundColor: string;
  backgroundOpacity: number;
}

export type ThresholdMode = 'mean' | 'median' | 'custom';

export interface ThresholdConfig {
  mode: ThresholdMode;
  customX?: number;
  customY?: number;
}

/**
 * Calculate a single threshold value (mean or median).
 * @param values Array of numeric values
 * @param mode 'mean' or 'median'
 * @returns The threshold value
 */
export function calculateThresholds(values: number[], mode: ThresholdMode): number {
  if (values.length === 0) return 0;

  if (mode === 'mean') {
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }

  if (mode === 'median') {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }

  return 0;
}

/**
 * Determine which side of threshold a value is on.
 * @param value The value to test
 * @param threshold The threshold
 * @returns -1 if value < threshold, 1 if value >= threshold
 */
export function getQuadrant(value: number, threshold: number): -1 | 1 {
  return value < threshold ? -1 : 1;
}

/**
 * Get quadrant index (0-3) for a point given thresholds.
 * 0 = top-left (x < xThreshold, y >= yThreshold)
 * 1 = top-right (x >= xThreshold, y >= yThreshold)
 * 2 = bottom-left (x < xThreshold, y < yThreshold)
 * 3 = bottom-right (x >= xThreshold, y < yThreshold)
 */
export function getQuadrantIndex(
  x: number,
  xThreshold: number,
  y: number,
  yThreshold: number
): 0 | 1 | 2 | 3 {
  const xSide = getQuadrant(x, xThreshold); // -1 or 1
  const ySide = getQuadrant(y, yThreshold); // -1 or 1

  // Map combinations to quadrant indices
  if (xSide === -1 && ySide === 1) return 0; // TL
  if (xSide === 1 && ySide === 1) return 1; // TR
  if (xSide === -1 && ySide === -1) return 2; // BL
  return 3; // BR
}

/**
 * Generate default quadrant styles based on theme.
 * @param theme The chart theme
 * @returns Array of 4 QuadrantStyle objects
 */
export function defaultQuadrantStyles(theme: ChartTheme): QuadrantStyle[] {
  const gridColor = theme.grid.color;
  const gridOpacity = 0.1;

  return [
    {
      dividerStroke: gridColor,
      dividerStrokeWidth: 1,
      backgroundColor: theme.colors[0],
      backgroundOpacity: gridOpacity,
    },
    {
      dividerStroke: gridColor,
      dividerStrokeWidth: 1,
      backgroundColor: theme.colors[1],
      backgroundOpacity: gridOpacity,
    },
    {
      dividerStroke: gridColor,
      dividerStrokeWidth: 1,
      backgroundColor: theme.colors[2],
      backgroundOpacity: gridOpacity,
    },
    {
      dividerStroke: gridColor,
      dividerStrokeWidth: 1,
      backgroundColor: theme.colors[3],
      backgroundOpacity: gridOpacity,
    },
  ];
}
