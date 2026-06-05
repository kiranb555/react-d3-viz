# Quadrant Chart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a production-ready Quadrant Chart component with configurable thresholds, custom styling, optional bubble sizing, and Storybook stories.

**Architecture:** Extends `CartesianChart` for Cartesian infrastructure (scales, axes, legend, tooltip). Pure-JS compute module handles threshold calculations. SVG-native rendering uses primitives. Follows existing patterns from ScatterPlot + BubbleChart.

**Tech Stack:** React, D3 (scale, array), TypeScript, Vitest, Storybook

---

## File Structure Overview

**Create:**
- `src/core/quadrant.ts` — compute helpers (threshold calculation, quadrant membership)
- `src/components/charts/QuadrantChart/QuadrantChart.tsx` — main component
- `src/components/charts/QuadrantChart/Quadrants.tsx` — quadrant backgrounds + dividers + labels
- `src/components/charts/QuadrantChart/Points.tsx` — data point circles
- `src/components/charts/QuadrantChart/QuadrantChart.stories.tsx` — Storybook
- `test/quadrant.test.ts` — unit tests for compute

**Modify:**
- `src/index.ts` — export QuadrantChart + props type
- `src/components/charts/common.ts` — add quadrant to chart registry if needed
- `test/render.test.tsx` — add QuadrantChart render test
- `src/App.tsx` — add demo card
- `screenshots/Gallery.tsx` — add gallery tile
- `scripts/shots.mjs` — add screenshot config
- `README.md` — add to charts list
- `CLAUDE.md` — update "Charts" section

---

## Task 1: Core Compute Module (`src/core/quadrant.ts`)

**Files:**
- Create: `src/core/quadrant.ts`
- Test: `test/quadrant.test.ts`

### Step 1: Write failing tests for compute helpers

Create `test/quadrant.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import {
  calculateThresholds,
  getQuadrant,
  getQuadrantIndex,
  defaultQuadrantStyles,
} from '../src/core/quadrant';
import { defaultTheme } from '../src/theme/useTheme';

describe('quadrant compute', () => {
  describe('calculateThresholds', () => {
    it('calculates mean correctly', () => {
      const values = [1, 2, 3, 4, 5];
      expect(calculateThresholds(values, 'mean')).toBe(3);
    });

    it('calculates median correctly for odd-length array', () => {
      const values = [1, 2, 3, 4, 5];
      expect(calculateThresholds(values, 'median')).toBe(3);
    });

    it('calculates median correctly for even-length array', () => {
      const values = [1, 2, 3, 4];
      expect(calculateThresholds(values, 'median')).toBe(2.5);
    });

    it('handles single value', () => {
      const values = [5];
      expect(calculateThresholds(values, 'mean')).toBe(5);
      expect(calculateThresholds(values, 'median')).toBe(5);
    });

    it('handles negative values', () => {
      const values = [-5, -2, 0, 2, 5];
      expect(calculateThresholds(values, 'mean')).toBe(0);
      expect(calculateThresholds(values, 'median')).toBe(0);
    });

    it('handles duplicate values', () => {
      const values = [1, 1, 1, 1];
      expect(calculateThresholds(values, 'mean')).toBe(1);
      expect(calculateThresholds(values, 'median')).toBe(1);
    });
  });

  describe('getQuadrant', () => {
    it('returns -1 when value < threshold', () => {
      expect(getQuadrant(2, 5)).toBe(-1);
    });

    it('returns 1 when value >= threshold', () => {
      expect(getQuadrant(5, 5)).toBe(1);
      expect(getQuadrant(6, 5)).toBe(1);
    });
  });

  describe('getQuadrantIndex', () => {
    it('returns 0 for top-left (x < threshold, y >= threshold)', () => {
      expect(getQuadrantIndex(2, 5, 6, 5)).toBe(0);
    });

    it('returns 1 for top-right (x >= threshold, y >= threshold)', () => {
      expect(getQuadrantIndex(5, 5, 6, 5)).toBe(1);
    });

    it('returns 2 for bottom-left (x < threshold, y < threshold)', () => {
      expect(getQuadrantIndex(2, 5, 4, 5)).toBe(2);
    });

    it('returns 3 for bottom-right (x >= threshold, y < threshold)', () => {
      expect(getQuadrantIndex(5, 5, 4, 5)).toBe(3);
    });

    it('handles threshold boundaries correctly', () => {
      expect(getQuadrantIndex(5, 5, 5, 5)).toBe(1); // top-right at boundary
    });
  });

  describe('defaultQuadrantStyles', () => {
    it('returns array of 4 styles', () => {
      const styles = defaultQuadrantStyles(defaultTheme);
      expect(styles).toHaveLength(4);
    });

    it('each style has required properties', () => {
      const styles = defaultQuadrantStyles(defaultTheme);
      styles.forEach((style) => {
        expect(style).toHaveProperty('dividerStroke');
        expect(style).toHaveProperty('dividerStrokeWidth');
        expect(style).toHaveProperty('backgroundColor');
        expect(style).toHaveProperty('backgroundOpacity');
      });
    });

    it('divider stroke width is positive number', () => {
      const styles = defaultQuadrantStyles(defaultTheme);
      styles.forEach((style) => {
        expect(typeof style.dividerStrokeWidth).toBe('number');
        expect(style.dividerStrokeWidth).toBeGreaterThan(0);
      });
    });

    it('background opacity is between 0 and 1', () => {
      const styles = defaultQuadrantStyles(defaultTheme);
      styles.forEach((style) => {
        expect(style.backgroundOpacity).toBeGreaterThanOrEqual(0);
        expect(style.backgroundOpacity).toBeLessThanOrEqual(1);
      });
    });
  });
});
```

### Step 2: Run tests to verify they fail

```bash
npm test -- test/quadrant.test.ts
```

Expected output: All tests fail with "module not found" or similar.

### Step 3: Implement core compute module

Create `src/core/quadrant.ts`:

```typescript
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
  return 3; // TR
}

/**
 * Generate default quadrant styles based on theme.
 * @param theme The chart theme
 * @returns Array of 4 QuadrantStyle objects
 */
export function defaultQuadrantStyles(theme: ChartTheme): QuadrantStyle[] {
  const gridColor = theme.colors.grid || '#e0e0e0';
  const gridOpacity = 0.1;

  return [
    {
      dividerStroke: gridColor,
      dividerStrokeWidth: 1,
      backgroundColor: theme.colors.primary || '#3b82f6',
      backgroundOpacity: gridOpacity,
    },
    {
      dividerStroke: gridColor,
      dividerStrokeWidth: 1,
      backgroundColor: theme.colors.secondary || '#8b5cf6',
      backgroundOpacity: gridOpacity,
    },
    {
      dividerStroke: gridColor,
      dividerStrokeWidth: 1,
      backgroundColor: theme.colors.accent || '#ec4899',
      backgroundOpacity: gridOpacity,
    },
    {
      dividerStroke: gridColor,
      dividerStrokeWidth: 1,
      backgroundColor: theme.colors.success || '#10b981',
      backgroundOpacity: gridOpacity,
    },
  ];
}
```

### Step 4: Run tests to verify they pass

```bash
npm test -- test/quadrant.test.ts
```

Expected output: All tests pass.

### Step 5: Commit

```bash
git add src/core/quadrant.ts test/quadrant.test.ts
git commit -m "feat: add quadrant compute module with threshold and membership logic

- calculateThresholds: mean/median calculation
- getQuadrant: side-of-threshold determination
- getQuadrantIndex: quadrant membership (0-3)
- defaultQuadrantStyles: theme-based styling
- Full unit test coverage

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Quadrants Rendering Component

**Files:**
- Create: `src/components/charts/QuadrantChart/Quadrants.tsx`

### Step 1: Examine ChartContext to understand available properties

Read existing chart to see context usage:

```bash
grep -A 10 "useChartContext" src/components/charts/BubbleChart/BubbleChart.tsx | head -20
```

### Step 2: Create Quadrants.tsx

Create `src/components/charts/QuadrantChart/Quadrants.tsx`:

```typescript
import { G, Rect, Line, SvgText } from '../../../primitives';
import { useChartContext } from '../../ChartContext';
import type { ResolvedSeries } from '../../chartTypes';
import type { QuadrantStyle } from '../../../core/quadrant';

interface QuadrantsProps {
  thresholdX: number;
  thresholdY: number;
  quadrantLabels?: [string, string, string, string];
  showQuadrantLabels?: boolean;
  quadrantStyles: QuadrantStyle[];
}

export function Quadrants({
  thresholdX,
  thresholdY,
  quadrantLabels,
  showQuadrantLabels = true,
  quadrantStyles,
}: QuadrantsProps) {
  const { xPixel, yPixel, xDomain, yDomain, theme } = useChartContext();

  // Convert threshold data values to pixel positions
  const thresholdXPixel = xPixel(thresholdX);
  const thresholdYPixel = yPixel(thresholdY);

  // Get domain bounds in pixels (top-left is min, bottom-right is max)
  const x0Pixel = xPixel(xDomain[0]);
  const x1Pixel = xPixel(xDomain[1]);
  const y0Pixel = yPixel(yDomain[0]); // This is the max (top)
  const y1Pixel = yPixel(yDomain[1]); // This is the min (bottom)

  const minXPixel = Math.min(x0Pixel, x1Pixel);
  const maxXPixel = Math.max(x0Pixel, x1Pixel);
  const minYPixel = Math.min(y0Pixel, y1Pixel);
  const maxYPixel = Math.max(y0Pixel, y1Pixel);

  // Define the 4 quadrants: TL, TR, BL, BR
  const quadrants = [
    // Top-left (0)
    {
      x: minXPixel,
      y: minYPixel,
      width: thresholdXPixel - minXPixel,
      height: thresholdYPixel - minYPixel,
      labelX: minXPixel + (thresholdXPixel - minXPixel) / 2,
      labelY: minYPixel + (thresholdYPixel - minYPixel) / 2,
    },
    // Top-right (1)
    {
      x: thresholdXPixel,
      y: minYPixel,
      width: maxXPixel - thresholdXPixel,
      height: thresholdYPixel - minYPixel,
      labelX: thresholdXPixel + (maxXPixel - thresholdXPixel) / 2,
      labelY: minYPixel + (thresholdYPixel - minYPixel) / 2,
    },
    // Bottom-left (2)
    {
      x: minXPixel,
      y: thresholdYPixel,
      width: thresholdXPixel - minXPixel,
      height: maxYPixel - thresholdYPixel,
      labelX: minXPixel + (thresholdXPixel - minXPixel) / 2,
      labelY: thresholdYPixel + (maxYPixel - thresholdYPixel) / 2,
    },
    // Bottom-right (3)
    {
      x: thresholdXPixel,
      y: thresholdYPixel,
      width: maxXPixel - thresholdXPixel,
      height: maxYPixel - thresholdYPixel,
      labelX: thresholdXPixel + (maxXPixel - thresholdXPixel) / 2,
      labelY: thresholdYPixel + (maxYPixel - thresholdYPixel) / 2,
    },
  ];

  const defaultFontSize = theme.axis.fontSize || 12;
  const labelColor = theme.colors.text || '#666';

  return (
    <G>
      {/* Quadrant backgrounds */}
      {quadrants.map((quad, i) => (
        <Rect
          key={`bg-${i}`}
          x={quad.x}
          y={quad.y}
          width={quad.width}
          height={quad.height}
          fill={quadrantStyles[i].backgroundColor}
          fillOpacity={quadrantStyles[i].backgroundOpacity}
        />
      ))}

      {/* Divider lines */}
      <Line
        x1={thresholdXPixel}
        y1={minYPixel}
        x2={thresholdXPixel}
        y2={maxYPixel}
        stroke={quadrantStyles[0].dividerStroke}
        strokeWidth={quadrantStyles[0].dividerStrokeWidth}
        strokeDasharray="2,2"
      />
      <Line
        x1={minXPixel}
        y1={thresholdYPixel}
        x2={maxXPixel}
        y2={thresholdYPixel}
        stroke={quadrantStyles[0].dividerStroke}
        strokeWidth={quadrantStyles[0].dividerStrokeWidth}
        strokeDasharray="2,2"
      />

      {/* Quadrant labels */}
      {showQuadrantLabels &&
        quadrantLabels &&
        quadrants.map((quad, i) => (
          <SvgText
            key={`label-${i}`}
            x={quad.labelX}
            y={quad.labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={defaultFontSize}
            fill={labelColor}
            opacity={0.6}
            pointerEvents="none"
          >
            {quadrantLabels[i]}
          </SvgText>
        ))}
    </G>
  );
}
```

### Step 3: Commit

```bash
git add src/components/charts/QuadrantChart/Quadrants.tsx
git commit -m "feat: add Quadrants rendering component

- Renders 4 background rectangles (one per quadrant)
- Renders 2 dashed divider lines (X and Y thresholds)
- Renders 4 optional text labels in quadrant centers
- Uses ChartContext for coordinate transformation

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Points Rendering Component

**Files:**
- Create: `src/components/charts/QuadrantChart/Points.tsx`

### Step 1: Create Points.tsx (data point circles)

Create `src/components/charts/QuadrantChart/Points.tsx`:

```typescript
import { G, Circle } from '../../../primitives';
import { useChartContext } from '../../ChartContext';
import { useAnimatedValue } from '../../../hooks/useAnimatedValue';
import { getNumber } from '../../../core/accessors';
import { numericDomain } from '../../../core/scales';
import { scaleSqrt } from 'd3-scale';
import type { ResolvedSeries } from '../../chartTypes';
import type { Accessor } from '../../../core/accessors';

interface PointsProps {
  series: ResolvedSeries;
  size?: Accessor<number>;
  radiusRange?: [number, number];
  pointRadius?: number;
  animate?: boolean;
}

export function Points({
  series,
  size,
  radiusRange = [4, 28],
  pointRadius,
  animate = true,
}: PointsProps) {
  const { data, xPixel, yPixel, theme, active } = useChartContext();

  const t = useAnimatedValue({
    enabled: animate && theme.animation.enabled,
    durationMs: theme.animation.durationMs,
  });

  if (series.hidden) return null;

  let sizeScale: (v: number) => number | undefined;
  if (size) {
    const sizes = data.map((d, i) => getNumber(d, size, i));
    sizeScale = scaleSqrt()
      .domain(numericDomain(sizes, { includeZero: true, padTop: 0 }))
      .range(radiusRange);
  }

  return (
    <G>
      {data.map((d, i) => {
        const v = getNumber(d, series.dataKey, i);
        if (!Number.isFinite(v)) return null;

        const x = xPixel(i);
        const y = yPixel(v);
        let r = pointRadius ?? 4;

        if (size && sizeScale) {
          const sv = getNumber(d, size, i);
          if (!Number.isFinite(sv)) return null;
          r = sizeScale(sv) || 4;
        }

        r = r * t;

        const isActive = active?.seriesIndex === series.seriesIndex && active?.index === i;

        return (
          <Circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill={series.color}
            fillOpacity={isActive ? 0.8 : 0.5}
            stroke={series.color}
            strokeWidth={1.5}
          />
        );
      })}
    </G>
  );
}
```

### Step 2: Commit

```bash
git add src/components/charts/QuadrantChart/Points.tsx
git commit -m "feat: add Points rendering component for data circles

- Renders circles at (x, y) positions from data
- Supports optional bubble sizing via size accessor (sqrt scale)
- Highlights on hover via active state
- Animates radius on mount if enabled

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Main QuadrantChart Component

**Files:**
- Create: `src/components/charts/QuadrantChart/QuadrantChart.tsx`

### Step 1: Create QuadrantChart.tsx

Create `src/components/charts/QuadrantChart/QuadrantChart.tsx`:

```typescript
import { CartesianChart } from '../../CartesianChart';
import { Quadrants } from './Quadrants';
import { Points } from './Points';
import { resolveSeries, type BaseCartesianProps } from '../common';
import { calculateThresholds, defaultQuadrantStyles, type QuadrantStyle } from '../../../core/quadrant';
import { getNumber } from '../../../core/accessors';
import type { Accessor } from '../../../core/accessors';

export interface QuadrantChartProps extends BaseCartesianProps {
  /** Threshold positioning mode: 'mean' (default), 'median', or 'custom'. */
  thresholdMode?: 'mean' | 'median' | 'custom';
  /** Custom X threshold (required if thresholdMode='custom'). */
  thresholdX?: number;
  /** Custom Y threshold (required if thresholdMode='custom'). */
  thresholdY?: number;
  /** Custom labels for quadrants: [top-left, top-right, bottom-left, bottom-right]. */
  quadrantLabels?: [string, string, string, string];
  /** Show quadrant labels (default true). */
  showQuadrantLabels?: boolean;
  /** Optional accessor for bubble size (third dimension). */
  size?: Accessor<number>;
  /** Min/max bubble radius in px. Default [4, 28]. */
  radiusRange?: [number, number];
  /** Point radius if size not provided. */
  pointRadius?: number;
  /** Treat X as categorical (default false). */
  categoricalX?: boolean;
  /** Customize styling per quadrant. */
  quadrantStyles?: Partial<QuadrantStyle>[];
}

/**
 * Quadrant chart — 2D scatter plot divided into 4 quadrants by X and Y thresholds.
 * Supports automatic (mean/median) or custom threshold positioning, optional bubble sizing,
 * custom quadrant labels, and fully customizable styling.
 */
export function QuadrantChart({
  thresholdMode = 'mean',
  thresholdX,
  thresholdY,
  quadrantLabels,
  showQuadrantLabels = true,
  size,
  radiusRange,
  pointRadius,
  categoricalX = false,
  quadrantStyles: customStyles,
  series,
  y,
  ...rest
}: QuadrantChartProps) {
  const resolved = resolveSeries(series, y);

  // Calculate thresholds
  let finalThresholdX = thresholdX ?? 0;
  let finalThresholdY = thresholdY ?? 0;

  if (thresholdMode === 'custom') {
    if (thresholdX === undefined || thresholdY === undefined) {
      throw new Error(
        'QuadrantChart: thresholdMode="custom" requires both thresholdX and thresholdY'
      );
    }
    finalThresholdX = thresholdX;
    finalThresholdY = thresholdY;
  } else {
    // For 'mean' or 'median', we calculate from data
    // We'll do this inside the render callback where we have access to data
    // For now, set flags to calculate inside renderSeries
  }

  return (
    <CartesianChart
      {...rest}
      series={resolved}
      xScaleType={categoricalX ? 'point' : 'linear'}
      renderSeries={(ctx) => {
        // Calculate thresholds if not custom
        let threshX = finalThresholdX;
        let threshY = finalThresholdY;

        if (thresholdMode !== 'custom') {
          const xValues = ctx.data.map((d, i) => getNumber(d, ctx.xAccessor, i));
          const yValues = resolved
            .filter((s) => !s.hidden)
            .flatMap((s) =>
              ctx.data.map((d, i) => getNumber(d, s.dataKey, i))
            );

          threshX = calculateThresholds(xValues, thresholdMode);
          threshY = calculateThresholds(yValues, thresholdMode);
        }

        // Merge custom styles with defaults
        const defaultStyles = defaultQuadrantStyles(ctx.theme);
        const finalStyles = defaultStyles.map((style, i) => ({
          ...style,
          ...customStyles?.[i],
        }));

        return (
          <>
            <Quadrants
              thresholdX={threshX}
              thresholdY={threshY}
              quadrantLabels={quadrantLabels}
              showQuadrantLabels={showQuadrantLabels}
              quadrantStyles={finalStyles}
            />
            {ctx.series.map((s) => (
              <Points
                key={s.seriesIndex}
                series={s}
                size={size}
                radiusRange={radiusRange}
                pointRadius={pointRadius}
                animate={rest.animate}
              />
            ))}
          </>
        );
      }}
    />
  );
}
```

### Step 2: Commit

```bash
git add src/components/charts/QuadrantChart/QuadrantChart.tsx
git commit -m "feat: add main QuadrantChart component

- Extends CartesianChart for Cartesian infrastructure
- Supports mean/median/custom threshold modes
- Calculates thresholds from data or uses custom values
- Merges default and custom quadrant styles
- Renders Quadrants (dividers, backgrounds, labels) + Points

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Storybook Stories

**Files:**
- Create: `src/components/charts/QuadrantChart/QuadrantChart.stories.tsx`

### Step 1: Create stories file

Create `src/components/charts/QuadrantChart/QuadrantChart.stories.tsx`:

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
import { QuadrantChart } from './QuadrantChart';

// Generate sample data with more variation
const generateData = (count = 40) =>
  Array.from({ length: count }, () => ({
    x: Math.round(Math.random() * 100),
    y: Math.round(Math.random() * 100),
    size: Math.round(Math.random() * 80 + 10),
  }));

const data = generateData(40);

const meta = {
  title: 'Charts/QuadrantChart',
  component: QuadrantChart,
  tags: ['autodocs'],
  args: { data, x: 'x', y: 'y', height: 320 },
} satisfies Meta<typeof QuadrantChart>;

export default meta;
type Story = StoryObj<typeof QuadrantChart>;

export const Default: Story = {
  args: { thresholdMode: 'mean' },
};

export const MedianThresholds: Story = {
  args: { thresholdMode: 'median' },
};

export const CustomThresholds: Story = {
  args: { thresholdMode: 'custom', thresholdX: 40, thresholdY: 60 },
};

export const WithBubbleSize: Story = {
  args: {
    thresholdMode: 'mean',
    size: 'size',
    radiusRange: [6, 35],
  },
};

export const WithCustomLabels: Story = {
  args: {
    thresholdMode: 'mean',
    quadrantLabels: ['High Value\nLow Risk', 'High Value\nHigh Risk', 'Low Value\nLow Risk', 'Low Value\nHigh Risk'],
  },
};

export const CustomStyling: Story = {
  args: {
    thresholdMode: 'mean',
    quadrantStyles: [
      {
        backgroundColor: '#dbeafe',
        backgroundOpacity: 0.15,
        dividerStroke: '#3b82f6',
        dividerStrokeWidth: 2,
      },
      {
        backgroundColor: '#fecaca',
        backgroundOpacity: 0.15,
        dividerStroke: '#ef4444',
        dividerStrokeWidth: 2,
      },
      {
        backgroundColor: '#d1fae5',
        backgroundOpacity: 0.15,
        dividerStroke: '#10b981',
        dividerStrokeWidth: 2,
      },
      {
        backgroundColor: '#fef3c7',
        backgroundOpacity: 0.15,
        dividerStroke: '#f59e0b',
        dividerStrokeWidth: 2,
      },
    ],
  },
};

export const MultipleSeries: Story = {
  args: {
    thresholdMode: 'mean',
    series: [
      { dataKey: 'y', name: 'Series A', color: '#3b82f6' },
      { dataKey: 'y2', name: 'Series B', color: '#ef4444' },
    ],
    data: generateData(40).map((d) => ({
      ...d,
      y2: Math.round(Math.random() * 100),
    })),
  },
};

export const NoAnimation: Story = {
  args: { thresholdMode: 'mean', animate: false },
};

export const NoLabels: Story = {
  args: {
    thresholdMode: 'mean',
    showQuadrantLabels: false,
  },
};
```

### Step 2: Commit

```bash
git add src/components/charts/QuadrantChart/QuadrantChart.stories.tsx
git commit -m "feat: add Storybook stories for QuadrantChart

- Default (mean thresholds)
- Median thresholds
- Custom thresholds
- With bubble size
- With custom labels
- Custom styling
- Multiple series
- No animation variant
- No labels variant

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Add Render Test

**Files:**
- Modify: `test/render.test.tsx`

### Step 1: Add QuadrantChart render test

Read the existing render test file:

```bash
head -30 test/render.test.tsx
```

Then add the test case. Find where other chart tests are and add:

```typescript
it('QuadrantChart renders without error', () => {
  const data = Array.from({ length: 20 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));
  const { container } = render(
    <QuadrantChart
      data={data}
      x="x"
      y="y"
      width={400}
      height={300}
      thresholdMode="mean"
    />
  );
  expect(container.querySelector('svg')).toBeTruthy();
});
```

### Step 2: Commit

```bash
git add test/render.test.tsx
git commit -m "test: add QuadrantChart render test

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Export from Public API

**Files:**
- Modify: `src/index.ts`

### Step 1: Add exports

Find the charts section in `src/index.ts` and add:

```typescript
export { QuadrantChart } from './components/charts/QuadrantChart/QuadrantChart';
export type { QuadrantChartProps } from './components/charts/QuadrantChart/QuadrantChart';
```

### Step 2: Commit

```bash
git add src/index.ts
git commit -m "chore: export QuadrantChart from public API

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Integration — App.tsx Demo Card

**Files:**
- Modify: `src/App.tsx`

### Step 1: Add QuadrantChart demo

Find the charts section in `src/App.tsx`. Add a new card:

```typescript
{
  title: 'Quadrant Chart',
  description: 'Scatter plot with configurable thresholds dividing into 4 quadrants',
  component: (
    <QuadrantChart
      data={Array.from({ length: 50 }, () => ({
        x: Math.round(Math.random() * 100),
        y: Math.round(Math.random() * 100),
      }))}
      x="x"
      y="y"
      thresholdMode="mean"
      quadrantLabels={['High', 'High', 'Low', 'Low']}
      showQuadrantLabels
      height={300}
    />
  ),
}
```

### Step 2: Verify the demo renders

```bash
npm run dev
```

Check that the Quadrant chart card displays correctly in the browser.

### Step 3: Commit

```bash
git add src/App.tsx
git commit -m "demo: add QuadrantChart demo card to App.tsx

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 9: Update README

**Files:**
- Modify: `README.md`

### Step 1: Find and update charts list

Locate the chart list in README.md and add QuadrantChart. The entry should be alphabetically placed and follow the pattern:

```markdown
- **Quadrant Chart** — 2D scatter plot divided into 4 quadrants by configurable X/Y thresholds. Supports mean/median/custom threshold modes, optional bubble sizing, custom labels, and per-quadrant styling.
```

### Step 2: Commit

```bash
git add README.md
git commit -m "docs: add QuadrantChart to README charts list

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 10: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

### Step 1: Add to Charts section

Find the "Charts" section in CLAUDE.md. Add QuadrantChart to the list:

```markdown
LineChart, AreaChart, BarChart (grouped + `stacked`), ScatterPlot, BubbleChart, QuadrantChart, PieChart (+ donut via `innerRadius`), Histogram, RadarChart, TreemapChart (flat, grouped via `group`, or nested via `childrenKey`), WaterfallChart, MekkoChart, SankeyDiagram.
```

Also update the chart properties description if needed to mention threshold modes and quadrant styling.

### Step 2: Commit

```bash
git add CLAUDE.md
git commit -m "docs: add QuadrantChart to CLAUDE.md charts list

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 11: Gallery Integration (Optional but Recommended)

**Files:**
- Modify: `screenshots/Gallery.tsx`
- Modify: `scripts/shots.mjs`

### Step 1: Add to Gallery.tsx

Find the gallery tiles section and add a QuadrantChart tile following the pattern of other charts.

### Step 2: Add screenshot config to shots.mjs

Add entry to screenshot generation:

```javascript
{
  name: 'QuadrantChart',
  component: 'QuadrantChart',
  data: generateScatterData(50),
  props: { thresholdMode: 'mean' },
},
```

### Step 3: Commit

```bash
git add screenshots/Gallery.tsx scripts/shots.mjs
git commit -m "docs: add QuadrantChart to gallery and screenshots

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 12: Verify Everything Works

**Files:**
- No files modified, only testing

### Step 1: Run linting

```bash
npm run lint
```

Expected output: No errors.

### Step 2: Run tests

```bash
npm test
```

Expected output: All tests pass, including new quadrant.test.ts and render test.

### Step 3: Build library

```bash
npm run build
```

Expected output: Success, `dist/` contains new files:
- `dist/components/charts/QuadrantChart/QuadrantChart.js`
- `dist/core/quadrant.js`

### Step 4: Start dev server and verify visually

```bash
npm run dev
```

In browser:
- Navigate to http://localhost:5173
- Scroll to Quadrant Chart demo card — it should render
- Check Storybook: `npm run storybook`
- Visit each story variant (Default, Median, Custom, BubbleSize, Labels, Styling, Multiple, NoAnimation, NoLabels)
- Verify hover highlights work
- Verify legend toggle works on Multiple Series variant
- Verify animation plays on page load (points grow in)

### Step 5: Commit final verification

```bash
git add -A
git commit -m "verify: all tests pass, linting passes, build succeeds, dev server works

- npm test: all tests pass
- npm run lint: no errors
- npm run build: succeeds
- npm run dev: demo renders correctly
- npm run storybook: all 9 stories render correctly

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 13: Final Summary & Follow-Ups

### Step 1: Summary

All core Quadrant Chart implementation complete:
- ✅ Pure-JS compute module with tests
- ✅ Quadrants rendering (backgrounds, dividers, labels)
- ✅ Points rendering with animation support
- ✅ Main component with threshold modes
- ✅ Full Storybook coverage (9 stories)
- ✅ Render tests
- ✅ Public API exports
- ✅ Demo card
- ✅ README + CLAUDE.md updated
- ✅ All linting + tests pass
- ✅ Build succeeds

### Step 2: Follow-Ups (Separate Tasks)

**NOT part of this plan but noted:**
1. Update react-d3-viz-ui docs site with QuadrantChart documentation and interactive examples (requires separate repo)
2. Consider adding more advanced features in future releases (e.g., tooltips with quadrant aggregates, animations on threshold changes)

### Step 3: Final Status Check

```bash
git log --oneline -15
```

You should see all commit messages for the QuadrantChart implementation.

---

## Summary

**Total commits:** 11 feature/test commits + 1 verification commit = 12 total

**New files:** 6
- `src/core/quadrant.ts`
- `src/components/charts/QuadrantChart/QuadrantChart.tsx`
- `src/components/charts/QuadrantChart/Quadrants.tsx`
- `src/components/charts/QuadrantChart/Points.tsx`
- `src/components/charts/QuadrantChart/QuadrantChart.stories.tsx`
- `test/quadrant.test.ts`

**Modified files:** 6
- `src/index.ts`
- `test/render.test.tsx`
- `src/App.tsx`
- `README.md`
- `CLAUDE.md`
- `screenshots/Gallery.tsx` + `scripts/shots.mjs` (optional)

**Success criteria:** All met upon completion of Task 12.
